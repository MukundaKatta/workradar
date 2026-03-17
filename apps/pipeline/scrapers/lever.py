"""Scraper for Lever public job boards."""

from __future__ import annotations

import logging

from models import RawJob, RemoteStatus
from scrapers.base import BaseScraper

logger = logging.getLogger(__name__)

LEVER_API = "https://api.lever.co/v0/postings"


class LeverScraper(BaseScraper):
    """Scrape job postings from Lever's public JSON API.

    Supply a list of company slugs (the slug in
    ``https://jobs.lever.co/<slug>``).
    """

    name = "lever"

    def __init__(self, company_slugs: list[str] | None = None, **kwargs: object) -> None:
        super().__init__(**kwargs)  # type: ignore[arg-type]
        self.company_slugs: list[str] = company_slugs or []

    async def scrape(self) -> list[RawJob]:
        """Scrape all configured Lever boards."""
        all_jobs: list[RawJob] = []
        for slug in self.company_slugs:
            try:
                jobs = await self._scrape_company(slug)
                all_jobs.extend(jobs)
                logger.info("[lever] %s: %d jobs", slug, len(jobs))
            except Exception:
                logger.exception("[lever] Failed to scrape %s", slug)
        return all_jobs

    async def _scrape_company(self, slug: str) -> list[RawJob]:
        """Scrape a single Lever company board."""
        url = f"{LEVER_API}/{slug}?mode=json"
        data = await self.fetch_json(url)

        if not isinstance(data, list):
            logger.warning("[lever] Unexpected response format for %s", slug)
            return []

        jobs: list[RawJob] = []
        for posting in data:
            categories = posting.get("categories", {})
            location = categories.get("location", "") or ""
            commitment = categories.get("commitment", "") or ""

            remote = RemoteStatus.UNKNOWN
            combined = f"{location} {commitment}".lower()
            if "remote" in combined:
                remote = RemoteStatus.REMOTE
            elif "hybrid" in combined:
                remote = RemoteStatus.HYBRID

            desc_plain = posting.get("descriptionPlain", "") or ""
            additional = posting.get("additionalPlain", "") or ""
            full_text = f"{desc_plain}\n{additional}".strip()

            lists_html_parts: list[str] = []
            for lst in posting.get("lists", []):
                lists_html_parts.append(lst.get("content", ""))
            lists_text = " ".join(lists_html_parts)

            jobs.append(
                RawJob(
                    source=self.name,
                    source_id=str(posting.get("id", "")),
                    source_url=posting.get("hostedUrl", ""),
                    company=slug,
                    title=posting.get("text", ""),
                    location=location,
                    remote=remote,
                    description_html=posting.get("description", "") + lists_text,
                    description_text=full_text,
                )
            )
        return jobs
