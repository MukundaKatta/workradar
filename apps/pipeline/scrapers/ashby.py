"""Scraper for Ashby public job boards."""

from __future__ import annotations

import logging

from models import RawJob, RemoteStatus
from scrapers.base import BaseScraper

logger = logging.getLogger(__name__)

ASHBY_API = "https://api.ashbyhq.com/posting-api/job-board"


class AshbyScraper(BaseScraper):
    """Scrape job postings from Ashby's public posting API.

    Supply a list of company slugs (the slug in
    ``https://jobs.ashbyhq.com/<slug>``).
    """

    name = "ashby"

    def __init__(self, company_slugs: list[str] | None = None, **kwargs: object) -> None:
        super().__init__(**kwargs)  # type: ignore[arg-type]
        self.company_slugs: list[str] = company_slugs or []

    async def scrape(self) -> list[RawJob]:
        """Scrape all configured Ashby boards."""
        all_jobs: list[RawJob] = []
        for slug in self.company_slugs:
            try:
                jobs = await self._scrape_board(slug)
                all_jobs.extend(jobs)
                logger.info("[ashby] %s: %d jobs", slug, len(jobs))
            except Exception:
                logger.exception("[ashby] Failed to scrape %s", slug)
        return all_jobs

    async def _scrape_board(self, slug: str) -> list[RawJob]:
        """Scrape a single Ashby board via the posting API."""
        url = f"{ASHBY_API}/{slug}"
        data = await self.fetch_json(url)

        if not isinstance(data, dict):
            logger.warning("[ashby] Unexpected response for %s", slug)
            return []

        jobs: list[RawJob] = []
        for posting in data.get("jobs", []):
            location = posting.get("location", "") or ""
            employment_type = posting.get("employmentType", "") or ""

            remote = RemoteStatus.UNKNOWN
            combined = f"{location} {employment_type}".lower()
            if "remote" in combined:
                remote = RemoteStatus.REMOTE
            elif "hybrid" in combined:
                remote = RemoteStatus.HYBRID

            desc_html = posting.get("descriptionHtml", "") or ""
            desc_plain = posting.get("descriptionPlain", "") or ""

            job_url = f"https://jobs.ashbyhq.com/{slug}/{posting.get('id', '')}"

            jobs.append(
                RawJob(
                    source=self.name,
                    source_id=str(posting.get("id", "")),
                    source_url=job_url,
                    company=slug,
                    title=posting.get("title", ""),
                    location=location,
                    remote=remote,
                    description_html=desc_html,
                    description_text=desc_plain,
                    extra={"department": posting.get("department", ""), "team": posting.get("team", "")},
                )
            )
        return jobs
