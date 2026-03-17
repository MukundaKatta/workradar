"""Scraper for Greenhouse public job boards."""

from __future__ import annotations

import logging
from datetime import datetime, timezone

from models import RawJob, RemoteStatus
from scrapers.base import BaseScraper

logger = logging.getLogger(__name__)

GH_API = "https://boards-api.greenhouse.io/v1/boards"


class GreenhouseScraper(BaseScraper):
    """Scrape job listings from Greenhouse public board JSON API.

    Supply a list of company board tokens (the slug in
    ``https://boards.greenhouse.io/<token>``).
    """

    name = "greenhouse"

    def __init__(self, company_tokens: list[str] | None = None, **kwargs: object) -> None:
        super().__init__(**kwargs)  # type: ignore[arg-type]
        self.company_tokens: list[str] = company_tokens or []

    async def scrape(self) -> list[RawJob]:
        """Scrape all configured Greenhouse boards."""
        all_jobs: list[RawJob] = []
        for token in self.company_tokens:
            try:
                jobs = await self._scrape_board(token)
                all_jobs.extend(jobs)
                logger.info("[greenhouse] %s: %d jobs", token, len(jobs))
            except Exception:
                logger.exception("[greenhouse] Failed to scrape board %s", token)
        return all_jobs

    async def _scrape_board(self, token: str) -> list[RawJob]:
        """Scrape a single Greenhouse board."""
        url = f"{GH_API}/{token}/jobs?content=true"
        data = await self.fetch_json(url)

        jobs: list[RawJob] = []
        for item in data.get("jobs", []) if isinstance(data, dict) else []:
            location_name = ""
            if item.get("location"):
                location_name = item["location"].get("name", "")

            remote = RemoteStatus.UNKNOWN
            loc_lower = location_name.lower()
            if "remote" in loc_lower:
                remote = RemoteStatus.REMOTE
            elif "hybrid" in loc_lower:
                remote = RemoteStatus.HYBRID

            posted_at = None
            if item.get("updated_at"):
                try:
                    posted_at = datetime.fromisoformat(item["updated_at"].replace("Z", "+00:00"))
                except ValueError:
                    pass

            content_html = item.get("content", "")
            from scrapers.hn_hiring import _strip_html

            jobs.append(
                RawJob(
                    source=self.name,
                    source_id=str(item.get("id", "")),
                    source_url=item.get("absolute_url", ""),
                    company=token,
                    title=item.get("title", ""),
                    location=location_name,
                    remote=remote,
                    description_html=content_html,
                    description_text=_strip_html(content_html),
                    posted_at=posted_at,
                )
            )
        return jobs
