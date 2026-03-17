"""Scraper runner — orchestrates all scrapers in parallel with deduplication."""

from __future__ import annotations

import asyncio
import hashlib
import logging
from difflib import SequenceMatcher

from config import PipelineConfig, get_config
from models import RawJob
from scrapers.base import BaseScraper

logger = logging.getLogger(__name__)


class ScraperRunner:
    """Run multiple scrapers concurrently, deduplicate results, and store them.

    Usage::

        runner = ScraperRunner(scrapers=[HNHiringScraper(), RemoteOKScraper(), ...])
        jobs = await runner.run()
    """

    def __init__(
        self,
        scrapers: list[BaseScraper],
        config: PipelineConfig | None = None,
        batch_size: int | None = None,
    ) -> None:
        self.scrapers = scrapers
        self.config = config or get_config()
        self.batch_size = batch_size or self.config.scraper_batch_size

    async def run(self) -> list[RawJob]:
        """Run all scrapers concurrently and return deduplicated results."""
        tasks = [self._run_scraper(s) for s in self.scrapers]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        all_jobs: list[RawJob] = []
        for i, result in enumerate(results):
            scraper_name = self.scrapers[i].name
            if isinstance(result, BaseException):
                logger.error("Scraper %s failed: %s", scraper_name, result)
                continue
            logger.info("Scraper %s returned %d jobs", scraper_name, len(result))
            all_jobs.extend(result)

        deduped = self._deduplicate(all_jobs)
        logger.info(
            "Total scraped: %d, after dedup: %d (removed %d duplicates)",
            len(all_jobs),
            len(deduped),
            len(all_jobs) - len(deduped),
        )
        return deduped

    async def _run_scraper(self, scraper: BaseScraper) -> list[RawJob]:
        """Run a single scraper within its own context."""
        async with scraper:
            return await scraper.scrape()

    # ------------------------------------------------------------------
    # Deduplication
    # ------------------------------------------------------------------

    def _deduplicate(self, jobs: list[RawJob]) -> list[RawJob]:
        """Remove duplicate jobs using fuzzy matching on (company, title, location).

        Two jobs are considered duplicates if the combined similarity of their
        company + title + location exceeds 0.85.
        """
        unique: list[RawJob] = []
        seen_keys: list[str] = []

        for job in jobs:
            key = self._dedup_key(job)
            is_dup = False
            for existing_key in seen_keys:
                if self._similarity(key, existing_key) > 0.85:
                    is_dup = True
                    break
            if not is_dup:
                unique.append(job)
                seen_keys.append(key)

        return unique

    @staticmethod
    def _dedup_key(job: RawJob) -> str:
        """Build a normalised deduplication key."""
        parts = [
            job.company.lower().strip(),
            job.title.lower().strip(),
            job.location.lower().strip(),
        ]
        return "|".join(parts)

    @staticmethod
    def _similarity(a: str, b: str) -> float:
        """Return SequenceMatcher ratio between two strings."""
        return SequenceMatcher(None, a, b).ratio()

    # ------------------------------------------------------------------
    # Storage (placeholder — wire to Supabase in production)
    # ------------------------------------------------------------------

    async def store(self, jobs: list[RawJob]) -> int:
        """Store raw jobs to the database in batches.

        Returns the number of jobs stored.
        """
        stored = 0
        for i in range(0, len(jobs), self.batch_size):
            batch = jobs[i : i + self.batch_size]
            try:
                # TODO: insert batch into Supabase raw_jobs table
                stored += len(batch)
                logger.debug("Stored batch of %d jobs", len(batch))
            except Exception:
                logger.exception("Failed to store batch starting at index %d", i)
        return stored
