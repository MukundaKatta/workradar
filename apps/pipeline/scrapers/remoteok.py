"""Scraper for RemoteOK API."""

from __future__ import annotations

import logging
from datetime import datetime, timezone

from models import RawJob, RemoteStatus
from scrapers.base import BaseScraper

logger = logging.getLogger(__name__)

REMOTEOK_API = "https://remoteok.com/api"


class RemoteOKScraper(BaseScraper):
    """Fetch remote job listings from the RemoteOK JSON API."""

    name = "remoteok"

    async def scrape(self) -> list[RawJob]:
        """Scrape the RemoteOK API."""
        data = await self.fetch_json(REMOTEOK_API)

        if not isinstance(data, list):
            logger.warning("[remoteok] Unexpected response format.")
            return []

        jobs: list[RawJob] = []
        for item in data:
            # The first element is typically a legal disclaimer object.
            if not item.get("id") or not item.get("position"):
                continue

            posted_at = None
            if item.get("date"):
                try:
                    posted_at = datetime.fromisoformat(
                        str(item["date"]).replace("Z", "+00:00")
                    )
                except ValueError:
                    pass

            location = item.get("location", "") or ""
            tags = item.get("tags", []) or []
            description = item.get("description", "") or ""

            jobs.append(
                RawJob(
                    source=self.name,
                    source_id=str(item.get("id", "")),
                    source_url=item.get("url", ""),
                    company=item.get("company", ""),
                    title=item.get("position", ""),
                    location=location,
                    remote=RemoteStatus.REMOTE,
                    description_html=description,
                    description_text=description,
                    posted_at=posted_at,
                    extra={"tags": tags, "salary_min": item.get("salary_min"), "salary_max": item.get("salary_max")},
                )
            )

        logger.info("[remoteok] Scraped %d jobs", len(jobs))
        return jobs
