"""AI-powered job parsing using Claude (via Anthropic API or Bedrock)."""

from __future__ import annotations

import asyncio
import hashlib
import json
import logging
from typing import Any

import anthropic

from config import PipelineConfig, get_config
from models import ParsedJob, RawJob, RemoteStatus, SalaryRange, VisaAssessment, VisaSponsorSignal

logger = logging.getLogger(__name__)

PARSE_SYSTEM_PROMPT = """\
You are an expert job-posting analyst. Given a raw job posting, extract structured information.
Return ONLY valid JSON matching the schema below — no markdown, no explanation.

Schema:
{
  "clean_title": "string — normalised job title",
  "company": "string",
  "location": "string",
  "remote": "remote | hybrid | onsite | unknown",
  "required_skills": ["string"],
  "preferred_skills": ["string"],
  "years_experience_min": int | null,
  "years_experience_max": int | null,
  "salary_min_usd": int | null,
  "salary_max_usd": int | null,
  "salary_raw": "string — original salary text",
  "visa_signal": "yes | no | maybe | unknown",
  "visa_evidence": ["string — exact quotes that indicate visa stance"],
  "red_flags": ["string — concerning signals for candidates"],
  "green_flags": ["string — positive signals for candidates"],
  "culture_signals": ["string — culture/values indicators"],
  "ai_summary": "string — 2-3 sentence summary for job seekers"
}
"""


class AIJobParser:
    """Parse raw job postings into structured data using Claude.

    Supports both the Anthropic API and AWS Bedrock as backends.
    """

    def __init__(self, config: PipelineConfig | None = None) -> None:
        self.config = config or get_config()
        self._client: anthropic.Anthropic | None = None
        self._cache: dict[str, ParsedJob] = {}

    @property
    def client(self) -> anthropic.Anthropic:
        """Lazily initialise the Anthropic client."""
        if self._client is None:
            if self.config.use_bedrock:
                self._client = anthropic.AnthropicBedrock(
                    aws_region=self.config.aws_region,
                )
            else:
                self._client = anthropic.Anthropic(
                    api_key=self.config.anthropic_api_key,
                )
        return self._client

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    async def parse_jobs(self, raw_jobs: list[RawJob]) -> list[ParsedJob]:
        """Parse a batch of raw jobs into structured ParsedJob models.

        Skips jobs that are already cached (unchanged content).
        """
        results: list[ParsedJob] = []
        semaphore = asyncio.Semaphore(5)  # limit concurrency

        async def _parse_one(job: RawJob) -> ParsedJob | None:
            async with semaphore:
                return await self.parse_job(job)

        tasks = [_parse_one(job) for job in raw_jobs]
        outcomes = await asyncio.gather(*tasks, return_exceptions=True)

        for i, outcome in enumerate(outcomes):
            if isinstance(outcome, BaseException):
                logger.error(
                    "Failed to parse job %s/%s: %s",
                    raw_jobs[i].source,
                    raw_jobs[i].source_id,
                    outcome,
                )
            elif outcome is not None:
                results.append(outcome)

        logger.info("Parsed %d / %d jobs successfully", len(results), len(raw_jobs))
        return results

    async def parse_job(self, raw: RawJob) -> ParsedJob | None:
        """Parse a single raw job posting.

        Returns None if the content is too short to be useful.
        """
        text = raw.description_text or raw.description_html
        if len(text.strip()) < 20:
            logger.debug("Skipping short posting: %s", raw.source_id)
            return None

        # Cache check
        content_hash = hashlib.sha256(text.encode()).hexdigest()
        if content_hash in self._cache:
            logger.debug("Cache hit for %s", raw.source_id)
            return self._cache[content_hash]

        # Build prompt
        user_prompt = (
            f"Company: {raw.company}\n"
            f"Title: {raw.title}\n"
            f"Location: {raw.location}\n"
            f"Remote: {raw.remote.value}\n\n"
            f"--- Job Posting ---\n{text[:8000]}"
        )

        try:
            parsed = await self._call_claude(user_prompt)
            if parsed is None:
                return None

            result = self._to_parsed_job(parsed, raw)
            self._cache[content_hash] = result
            return result
        except Exception:
            logger.exception("Claude API call failed for %s/%s", raw.source, raw.source_id)
            return None

    # ------------------------------------------------------------------
    # Internals
    # ------------------------------------------------------------------

    async def _call_claude(self, user_prompt: str) -> dict[str, Any] | None:
        """Call Claude and parse the JSON response."""
        model = (
            self.config.bedrock_model_id
            if self.config.use_bedrock
            else self.config.anthropic_model
        )

        # Run synchronous Anthropic client in executor
        loop = asyncio.get_running_loop()
        response = await loop.run_in_executor(
            None,
            lambda: self.client.messages.create(
                model=model,
                max_tokens=2048,
                system=PARSE_SYSTEM_PROMPT,
                messages=[{"role": "user", "content": user_prompt}],
            ),
        )

        raw_text = response.content[0].text.strip()

        # Strip markdown code fences if present
        if raw_text.startswith("```"):
            lines = raw_text.split("\n")
            raw_text = "\n".join(lines[1:-1] if lines[-1].startswith("```") else lines[1:])

        try:
            return json.loads(raw_text)
        except json.JSONDecodeError:
            logger.error("Failed to parse Claude JSON response: %.200s", raw_text)
            return None

    @staticmethod
    def _to_parsed_job(data: dict[str, Any], raw: RawJob) -> ParsedJob:
        """Convert parsed JSON dict into a ParsedJob model."""
        remote_map = {
            "remote": RemoteStatus.REMOTE,
            "hybrid": RemoteStatus.HYBRID,
            "onsite": RemoteStatus.ONSITE,
        }
        visa_map = {
            "yes": VisaSponsorSignal.YES,
            "no": VisaSponsorSignal.NO,
            "maybe": VisaSponsorSignal.MAYBE,
        }

        return ParsedJob(
            raw_job_id=raw.source_id,
            clean_title=data.get("clean_title", raw.title),
            company=data.get("company", raw.company),
            location=data.get("location", raw.location),
            remote=remote_map.get(data.get("remote", ""), RemoteStatus.UNKNOWN),
            required_skills=data.get("required_skills", []),
            preferred_skills=data.get("preferred_skills", []),
            years_experience_min=data.get("years_experience_min"),
            years_experience_max=data.get("years_experience_max"),
            salary=SalaryRange(
                min_usd=data.get("salary_min_usd"),
                max_usd=data.get("salary_max_usd"),
                raw_text=data.get("salary_raw", ""),
            ),
            visa=VisaAssessment(
                signal=visa_map.get(data.get("visa_signal", ""), VisaSponsorSignal.UNKNOWN),
                confidence=0.8 if data.get("visa_signal") in ("yes", "no") else 0.5,
                evidence=data.get("visa_evidence", []),
            ),
            red_flags=data.get("red_flags", []),
            green_flags=data.get("green_flags", []),
            culture_signals=data.get("culture_signals", []),
            ai_summary=data.get("ai_summary", ""),
        )
