"""Scraper for WeWorkRemotely job listings."""

from __future__ import annotations

import logging
import re

from bs4 import BeautifulSoup

from models import RawJob, RemoteStatus
from scrapers.base import BaseScraper

logger = logging.getLogger(__name__)

WWR_BASE = "https://weworkremotely.com"
WWR_CATEGORIES = [
    "/remote-jobs/search?term=&button=&categories%5B%5D=2",  # Programming
    "/remote-jobs/search?term=&button=&categories%5B%5D=17",  # DevOps / Sysadmin
    "/remote-jobs/search?term=&button=&categories%5B%5D=1",  # Design
    "/remote-jobs/search?term=&button=&categories%5B%5D=7",  # Product
]


class WeWorkRemotelyScraper(BaseScraper):
    """Scrape job listings from weworkremotely.com HTML pages."""

    name = "weworkremotely"

    async def scrape(self) -> list[RawJob]:
        """Scrape WeWorkRemotely category pages."""
        all_jobs: list[RawJob] = []
        seen_urls: set[str] = set()

        for category_path in WWR_CATEGORIES:
            try:
                url = f"{WWR_BASE}{category_path}"
                resp = await self.fetch(url)
                jobs = self._parse_listing_page(resp.text)
                for job in jobs:
                    if job.source_url not in seen_urls:
                        seen_urls.add(job.source_url)
                        all_jobs.append(job)
            except Exception:
                logger.exception("[wwr] Failed to scrape category %s", category_path)

        logger.info("[wwr] Scraped %d unique jobs", len(all_jobs))
        return all_jobs

    def _parse_listing_page(self, html: str) -> list[RawJob]:
        """Parse the job listing page HTML."""
        soup = BeautifulSoup(html, "html.parser")
        jobs: list[RawJob] = []

        for li in soup.select("li.feature, li.new-feature"):
            link = li.select_one("a")
            if not link or not link.get("href"):
                continue

            href = link["href"]
            if not href.startswith("/"):
                continue
            full_url = f"{WWR_BASE}{href}"

            company_el = li.select_one(".company")
            title_el = li.select_one(".title")
            region_el = li.select_one(".region")

            company = company_el.get_text(strip=True) if company_el else ""
            title = title_el.get_text(strip=True) if title_el else ""
            location = region_el.get_text(strip=True) if region_el else ""

            jobs.append(
                RawJob(
                    source=self.name,
                    source_id=href,
                    source_url=full_url,
                    company=company,
                    title=title,
                    location=location,
                    remote=RemoteStatus.REMOTE,
                    description_html="",
                    description_text="",
                )
            )
        return jobs
