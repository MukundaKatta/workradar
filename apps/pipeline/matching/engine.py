"""Core matching engine — scores profiles against jobs using weighted multi-signal approach."""

from __future__ import annotations

import logging
import math
from typing import Any

import numpy as np

from config import PipelineConfig, get_config
from models import MatchResult, MatchScores, RemoteStatus, VisaSponsorSignal

logger = logging.getLogger(__name__)


class MatchingEngine:
    """Score and match user profiles against job postings.

    The overall match score is a weighted sum of:
        - vector_similarity (0.30): cosine similarity of profile/job embeddings
        - skill_match (0.25): intersection of profile skills and required skills
        - experience_match (0.10): Gaussian fit of years of experience
        - salary_match (0.10): range overlap scoring
        - location_match (0.10): remote/location compatibility
        - visa_match (0.10): sponsorship compatibility
        - culture_match (0.05): cosine similarity of culture vectors
    """

    def __init__(self, config: PipelineConfig | None = None) -> None:
        self.config = config or get_config()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def score(self, profile: dict[str, Any], job: dict[str, Any]) -> MatchResult:
        """Compute the match score between a profile and a job.

        Args:
            profile: Dict with keys: id, skills, years_experience,
                     salary_min, salary_max, remote_preference, visa_needed,
                     embedding, culture_embedding, locations.
            job: Dict with keys: id, required_skills, preferred_skills,
                 years_experience_min, years_experience_max,
                 salary_min_usd, salary_max_usd, remote, visa_signal,
                 embedding, culture_embedding, location.

        Returns:
            MatchResult with overall score and breakdown.
        """
        scores = MatchScores(
            vector_similarity=self._vector_similarity(
                profile.get("embedding"), job.get("embedding")
            ),
            skill_match=self._skill_match(
                set(s.lower() for s in profile.get("skills", [])),
                set(s.lower() for s in job.get("required_skills", [])),
                set(s.lower() for s in job.get("preferred_skills", [])),
            ),
            experience_match=self._experience_match(
                profile.get("years_experience"),
                job.get("years_experience_min"),
                job.get("years_experience_max"),
            ),
            salary_match=self._salary_match(
                profile.get("salary_min"),
                profile.get("salary_max"),
                job.get("salary_min_usd"),
                job.get("salary_max_usd"),
            ),
            location_match=self._location_match(
                profile.get("remote_preference"),
                job.get("remote"),
                profile.get("locations", []),
                job.get("location", ""),
            ),
            visa_match=self._visa_match(
                profile.get("visa_needed", False),
                job.get("visa_signal", "unknown"),
            ),
            culture_match=self._vector_similarity(
                profile.get("culture_embedding"), job.get("culture_embedding")
            ),
        )

        cfg = self.config
        overall = (
            cfg.match_weight_vector * scores.vector_similarity
            + cfg.match_weight_skill * scores.skill_match
            + cfg.match_weight_experience * scores.experience_match
            + cfg.match_weight_salary * scores.salary_match
            + cfg.match_weight_location * scores.location_match
            + cfg.match_weight_visa * scores.visa_match
            + cfg.match_weight_culture * scores.culture_match
        )

        reason = self._generate_reason(scores, profile, job)

        return MatchResult(
            profile_id=profile.get("id", ""),
            job_id=job.get("id", ""),
            overall_score=round(overall, 4),
            scores=scores,
            match_reason=reason,
        )

    def match_profile_against_jobs(
        self, profile: dict[str, Any], jobs: list[dict[str, Any]]
    ) -> list[MatchResult]:
        """Score a profile against multiple jobs and return sorted results.

        Only returns matches above the configured minimum score.
        """
        results: list[MatchResult] = []
        for job in jobs:
            try:
                result = self.score(profile, job)
                if result.overall_score >= self.config.match_min_score:
                    results.append(result)
            except Exception:
                logger.exception(
                    "Failed to score profile %s against job %s",
                    profile.get("id"),
                    job.get("id"),
                )

        results.sort(key=lambda r: r.overall_score, reverse=True)
        return results

    # ------------------------------------------------------------------
    # Individual scoring functions
    # ------------------------------------------------------------------

    @staticmethod
    def _vector_similarity(
        vec_a: list[float] | None, vec_b: list[float] | None
    ) -> float:
        """Cosine similarity between two embedding vectors."""
        if not vec_a or not vec_b:
            return 0.5  # neutral when embeddings unavailable

        a = np.array(vec_a, dtype=np.float64)
        b = np.array(vec_b, dtype=np.float64)

        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)

        if norm_a == 0 or norm_b == 0:
            return 0.0

        similarity = float(np.dot(a, b) / (norm_a * norm_b))
        # Normalise from [-1, 1] to [0, 1]
        return (similarity + 1.0) / 2.0

    @staticmethod
    def _skill_match(
        profile_skills: set[str],
        required_skills: set[str],
        preferred_skills: set[str],
    ) -> float:
        """Score based on intersection of profile skills with job requirements.

        Required skill matches count fully; preferred skill matches count at 50%.
        """
        if not required_skills and not preferred_skills:
            return 0.5  # neutral when no skills listed

        score = 0.0
        total_weight = 0.0

        if required_skills:
            matched = len(profile_skills & required_skills)
            score += matched
            total_weight += len(required_skills)

        if preferred_skills:
            matched = len(profile_skills & preferred_skills)
            score += matched * 0.5
            total_weight += len(preferred_skills) * 0.5

        if total_weight == 0:
            return 0.5

        return min(score / total_weight, 1.0)

    @staticmethod
    def _experience_match(
        profile_years: int | None,
        job_min: int | None,
        job_max: int | None,
    ) -> float:
        """Gaussian fit scoring for years of experience.

        Perfect score when within range, decays as a Gaussian outside.
        """
        if profile_years is None:
            return 0.5  # neutral

        if job_min is None and job_max is None:
            return 0.5  # no requirement

        # Default range
        low = job_min if job_min is not None else 0
        high = job_max if job_max is not None else low + 5

        if low <= profile_years <= high:
            return 1.0

        # Gaussian decay — sigma = 3 years
        sigma = 3.0
        if profile_years < low:
            distance = low - profile_years
        else:
            distance = profile_years - high

        return math.exp(-(distance ** 2) / (2 * sigma ** 2))

    @staticmethod
    def _salary_match(
        profile_min: int | None,
        profile_max: int | None,
        job_min: int | None,
        job_max: int | None,
    ) -> float:
        """Range overlap scoring for salary.

        Returns 1.0 for full overlap, decreasing with gap.
        """
        if profile_min is None or job_min is None:
            return 0.5  # neutral when salary unknown

        p_low = profile_min
        p_high = profile_max or profile_min
        j_low = job_min
        j_high = job_max or job_min

        # Calculate overlap
        overlap_low = max(p_low, j_low)
        overlap_high = min(p_high, j_high)

        if overlap_low <= overlap_high:
            # There is overlap
            overlap_size = overlap_high - overlap_low
            total_range = max(p_high, j_high) - min(p_low, j_low)
            if total_range == 0:
                return 1.0
            return max(0.5, overlap_size / total_range)

        # No overlap — score based on gap
        gap = overlap_low - overlap_high
        midpoint = (j_low + j_high) / 2 if j_high > j_low else j_low
        if midpoint == 0:
            return 0.0

        relative_gap = gap / midpoint
        return max(0.0, 1.0 - relative_gap)

    @staticmethod
    def _location_match(
        remote_pref: str | None,
        job_remote: str | None,
        profile_locations: list[str],
        job_location: str,
    ) -> float:
        """Score remote/location compatibility."""
        if not remote_pref or not job_remote:
            return 0.5

        pref = remote_pref.lower()
        job_r = job_remote.lower()

        # Remote seeker + remote job = perfect
        if pref == "remote" and job_r == "remote":
            return 1.0

        # Remote seeker + onsite job = poor
        if pref == "remote" and job_r == "onsite":
            return 0.1

        # Onsite seeker + remote job = decent (can still apply)
        if pref == "onsite" and job_r == "remote":
            return 0.7

        # Hybrid is middle ground
        if "hybrid" in pref or "hybrid" in job_r:
            return 0.7

        # Check location match for onsite
        if profile_locations and job_location:
            job_loc_lower = job_location.lower()
            for loc in profile_locations:
                if loc.lower() in job_loc_lower or job_loc_lower in loc.lower():
                    return 1.0
            return 0.3

        return 0.5

    @staticmethod
    def _visa_match(visa_needed: bool, job_visa_signal: str) -> float:
        """Score visa sponsorship compatibility.

        Rules:
        - Doesn't need visa: always 1.0
        - Needs visa + job sponsors: 1.0
        - Needs visa + job maybe sponsors: 0.6
        - Needs visa + job doesn't sponsor: 0.0
        - Needs visa + unknown: 0.4
        """
        if not visa_needed:
            return 1.0

        signal = job_visa_signal.lower()
        match signal:
            case "yes":
                return 1.0
            case "no":
                return 0.0
            case "maybe":
                return 0.6
            case _:
                return 0.4

    # ------------------------------------------------------------------
    # Reason generation
    # ------------------------------------------------------------------

    @staticmethod
    def _generate_reason(
        scores: MatchScores,
        profile: dict[str, Any],
        job: dict[str, Any],
    ) -> str:
        """Generate a human-readable match reason string."""
        reasons: list[str] = []

        if scores.skill_match >= 0.7:
            matched = set(s.lower() for s in profile.get("skills", [])) & set(
                s.lower() for s in job.get("required_skills", [])
            )
            if matched:
                reasons.append(f"Strong skill match: {', '.join(list(matched)[:5])}")

        if scores.vector_similarity >= 0.7:
            reasons.append("High overall relevance to your profile")

        if scores.salary_match >= 0.8:
            reasons.append("Salary aligns with your expectations")

        if scores.location_match >= 0.9:
            reasons.append("Location/remote preference matches")

        if scores.visa_match >= 0.8 and profile.get("visa_needed"):
            reasons.append("Visa sponsorship likely available")
        elif scores.visa_match <= 0.1 and profile.get("visa_needed"):
            reasons.append("Warning: unlikely to sponsor visa")

        if scores.experience_match >= 0.9:
            reasons.append("Experience level is a great fit")

        if not reasons:
            reasons.append("Moderate overall fit based on combined signals")

        return "; ".join(reasons)
