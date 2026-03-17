"""Scraper for HackerNews 'Who is Hiring' monthly threads."""

from __future__ import annotations

import logging
import re

from models import RawJob, RemoteStatus
from scrapers.base import BaseScraper

logger = logging.getLogger(__name__)

HN_API = "https://hacker-news.firebaseio.com/v0"
HN_USER = "whoishiring"


class HNHiringScraper(BaseScraper):
    """Fetch the latest monthly 'Who is Hiring?' thread from HN and parse each comment."""

    name = "hn_hiring"

    async def scrape(self) -> list[RawJob]:
        """Scrape the latest HN Who-is-Hiring thread."""
        thread_id = await self._find_latest_thread()
        if thread_id is None:
            logger.warning("No 'Who is Hiring' thread found.")
            return []

        logger.info("Scraping HN thread %s", thread_id)
        thread = await self.fetch_json(f"{HN_API}/item/{thread_id}.json")
        kid_ids: list[int] = thread.get("kids", [])
        logger.info("Found %d comments in thread %s", len(kid_ids), thread_id)

        jobs: list[RawJob] = []
        for kid_id in kid_ids:
            try:
                comment = await self.fetch_json(f"{HN_API}/item/{kid_id}.json")
                if not comment or comment.get("deleted") or comment.get("dead"):
                    continue
                job = self._parse_comment(comment)
                if job:
                    jobs.append(job)
            except Exception:
                logger.exception("Failed to parse HN comment %s", kid_id)

        logger.info("Parsed %d jobs from HN thread %s", len(jobs), thread_id)
        return jobs

    # ------------------------------------------------------------------
    # Internals
    # ------------------------------------------------------------------

    async def _find_latest_thread(self) -> int | None:
        """Find the most recent 'Who is Hiring' submission by the whoishiring user."""
        user = await self.fetch_json(f"{HN_API}/user/{HN_USER}.json")
        submitted: list[int] = user.get("submitted", [])

        for item_id in submitted[:10]:
            item = await self.fetch_json(f"{HN_API}/item/{item_id}.json")
            title = (item.get("title") or "").lower()
            if "who is hiring" in title and "freelancer" not in title:
                return int(item["id"])
        return None

    def _parse_comment(self, comment: dict) -> RawJob | None:
        """Parse a single HN comment into a RawJob."""
        text: str = comment.get("text", "")
        if not text or len(text) < 30:
            return None

        # First line is typically "Company | Role | Location | Remote"
        first_line, _, rest = text.partition("<p>")
        first_line = _strip_html(first_line)
        parts = [p.strip() for p in first_line.split("|")]

        company = parts[0] if len(parts) >= 1 else ""
        title = parts[1] if len(parts) >= 2 else ""
        location = parts[2] if len(parts) >= 3 else ""

        remote = RemoteStatus.UNKNOWN
        full_text_lower = text.lower()
        if "remote" in full_text_lower:
            remote = RemoteStatus.REMOTE
        if "hybrid" in full_text_lower:
            remote = RemoteStatus.HYBRID
        if "onsite" in full_text_lower or "on-site" in full_text_lower:
            remote = RemoteStatus.ONSITE

        # Check extra pipe-delimited segments for REMOTE tag
        for part in parts[3:]:
            if "remote" in part.lower():
                remote = RemoteStatus.REMOTE

        description_text = _strip_html(text)

        return RawJob(
            source=self.name,
            source_id=str(comment.get("id", "")),
            source_url=f"https://news.ycombinator.com/item?id={comment.get('id', '')}",
            company=company,
            title=title,
            location=location,
            remote=remote,
            description_html=text,
            description_text=description_text,
            posted_at=None,
        )


def _strip_html(html: str) -> str:
    """Naively strip HTML tags and decode common entities."""
    text = re.sub(r"<[^>]+>", " ", html)
    text = text.replace("&#x27;", "'").replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", '"')
    return re.sub(r"\s+", " ", text).strip()
