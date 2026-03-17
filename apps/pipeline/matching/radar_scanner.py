"""Radar scanner — evaluates jobs against user radar configurations."""

from __future__ import annotations

import logging
from typing import Any

from matching.engine import MatchingEngine
from models import MatchResult, RadarResult

logger = logging.getLogger(__name__)


class RadarScanner:
    """Scan active radar configurations against new jobs.

    For each user's radar config, the scanner:
    1. Filters jobs by radar criteria (keywords, salary, remote, sponsor).
    2. Scores filtered jobs against the user's profile.
    3. Creates discovery + radar_result records.
    4. Flags real-time radars for notification.
    """

    def __init__(self, engine: MatchingEngine | None = None) -> None:
        self.engine = engine or MatchingEngine()

    async def scan(
        self,
        radar_configs: list[dict[str, Any]],
        jobs: list[dict[str, Any]],
        profiles: dict[str, dict[str, Any]],
    ) -> list[RadarResult]:
        """Scan all radar configs against the provided jobs.

        Args:
            radar_configs: List of radar config dicts with keys:
                - id, profile_id, keywords, salary_min, salary_max,
                  remote_only, sponsor_required, is_realtime.
            jobs: List of job dicts (same format as MatchingEngine.score expects).
            profiles: Mapping of profile_id -> profile dict.

        Returns:
            List of RadarResult objects for qualifying matches.
        """
        all_results: list[RadarResult] = []

        for radar in radar_configs:
            try:
                results = self._scan_single_radar(radar, jobs, profiles)
                all_results.extend(results)
            except Exception:
                logger.exception("Failed to scan radar %s", radar.get("id"))

        logger.info(
            "Scanned %d radars against %d jobs, produced %d results",
            len(radar_configs),
            len(jobs),
            len(all_results),
        )
        return all_results

    def _scan_single_radar(
        self,
        radar: dict[str, Any],
        jobs: list[dict[str, Any]],
        profiles: dict[str, dict[str, Any]],
    ) -> list[RadarResult]:
        """Evaluate a single radar config against all jobs."""
        profile_id = radar.get("profile_id", "")
        profile = profiles.get(profile_id)
        if not profile:
            logger.warning("Profile %s not found for radar %s", profile_id, radar.get("id"))
            return []

        # Step 1: Filter jobs by radar criteria
        filtered = self._filter_jobs(radar, jobs)
        if not filtered:
            return []

        # Step 2: Score against profile
        matches = self.engine.match_profile_against_jobs(profile, filtered)

        # Step 3: Convert to RadarResult
        results: list[RadarResult] = []
        for match in matches:
            results.append(
                RadarResult(
                    radar_id=radar.get("id", ""),
                    profile_id=profile_id,
                    job_id=match.job_id,
                    score=match.overall_score,
                    match_reason=match.match_reason,
                    notified=False,
                )
            )

        return results

    @staticmethod
    def _filter_jobs(radar: dict[str, Any], jobs: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """Apply radar filters to narrow down candidate jobs."""
        filtered: list[dict[str, Any]] = []

        keywords: list[str] = [k.lower() for k in radar.get("keywords", [])]
        salary_min: int | None = radar.get("salary_min")
        salary_max: int | None = radar.get("salary_max")
        remote_only: bool = radar.get("remote_only", False)
        sponsor_required: bool = radar.get("sponsor_required", False)

        for job in jobs:
            # Keyword filter
            if keywords:
                job_text = (
                    f"{job.get('title', '')} {job.get('description', '')} "
                    f"{' '.join(job.get('required_skills', []))}"
                ).lower()
                if not any(kw in job_text for kw in keywords):
                    continue

            # Salary filter
            if salary_min is not None:
                job_max_salary = job.get("salary_max_usd") or job.get("salary_min_usd")
                if job_max_salary is not None and job_max_salary < salary_min:
                    continue

            if salary_max is not None:
                job_min_salary = job.get("salary_min_usd") or job.get("salary_max_usd")
                if job_min_salary is not None and job_min_salary > salary_max:
                    continue

            # Remote filter
            if remote_only and job.get("remote", "unknown").lower() != "remote":
                continue

            # Visa sponsorship filter
            if sponsor_required and job.get("visa_signal", "unknown").lower() == "no":
                continue

            filtered.append(job)

        return filtered
