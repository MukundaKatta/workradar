"""Abstract base scraper with rate limiting, retries, and robots.txt support."""

from __future__ import annotations

import asyncio
import logging
import time
from abc import ABC, abstractmethod
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser

import httpx
from tenacity import (
    RetryError,
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from config import PipelineConfig, get_config
from models import RawJob

logger = logging.getLogger(__name__)


class BaseScraper(ABC):
    """Abstract base class for all WorkRadar scrapers.

    Provides:
    - Async HTTP client via ``httpx``
    - Configurable rate limiting (RPM)
    - Retry with exponential backoff
    - robots.txt respect
    """

    name: str = "base"

    def __init__(self, config: PipelineConfig | None = None) -> None:
        self.config = config or get_config()
        self._rpm = self.config.scraper_rpm
        self._max_retries = self.config.scraper_max_retries
        self._min_interval = 60.0 / self._rpm if self._rpm > 0 else 0.0
        self._last_request_time: float = 0.0
        self._robot_parsers: dict[str, RobotFileParser] = {}
        self._client: httpx.AsyncClient | None = None

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------

    async def _get_client(self) -> httpx.AsyncClient:
        """Lazily initialise and return the shared HTTP client."""
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                headers={"User-Agent": self.config.scraper_user_agent},
                timeout=httpx.Timeout(30.0, connect=10.0),
                follow_redirects=True,
            )
        return self._client

    async def close(self) -> None:
        """Close the underlying HTTP client."""
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    # ------------------------------------------------------------------
    # Rate limiting
    # ------------------------------------------------------------------

    async def _rate_limit(self) -> None:
        """Sleep if necessary to respect the configured RPM."""
        if self._min_interval <= 0:
            return
        elapsed = time.monotonic() - self._last_request_time
        if elapsed < self._min_interval:
            await asyncio.sleep(self._min_interval - elapsed)
        self._last_request_time = time.monotonic()

    # ------------------------------------------------------------------
    # robots.txt
    # ------------------------------------------------------------------

    async def _check_robots(self, url: str) -> bool:
        """Return True if ``url`` is allowed by the host's robots.txt."""
        parsed = urlparse(url)
        origin = f"{parsed.scheme}://{parsed.netloc}"

        if origin not in self._robot_parsers:
            rp = RobotFileParser()
            robots_url = f"{origin}/robots.txt"
            try:
                client = await self._get_client()
                resp = await client.get(robots_url)
                if resp.status_code == 200:
                    rp.parse(resp.text.splitlines())
                else:
                    # If robots.txt is missing, allow everything.
                    rp.allow_all = True  # type: ignore[attr-defined]
            except Exception:
                logger.debug("Could not fetch robots.txt for %s, allowing all.", origin)
                rp.allow_all = True  # type: ignore[attr-defined]
            self._robot_parsers[origin] = rp

        rp = self._robot_parsers[origin]
        if getattr(rp, "allow_all", False):
            return True
        return rp.can_fetch(self.config.scraper_user_agent, url)

    # ------------------------------------------------------------------
    # HTTP helpers with retry
    # ------------------------------------------------------------------

    async def fetch(self, url: str) -> httpx.Response:
        """Fetch a URL with rate limiting, robots.txt check, and retries.

        Raises:
            PermissionError: If robots.txt disallows the URL.
            httpx.HTTPStatusError: On non-retryable HTTP errors.
        """
        if not await self._check_robots(url):
            raise PermissionError(f"robots.txt disallows fetching {url}")

        await self._rate_limit()
        return await self._fetch_with_retry(url)

    @retry(
        retry=retry_if_exception_type((httpx.TransportError, httpx.HTTPStatusError)),
        wait=wait_exponential(multiplier=1, min=1, max=30),
        stop=stop_after_attempt(4),
        reraise=True,
    )
    async def _fetch_with_retry(self, url: str) -> httpx.Response:
        """Internal fetch with tenacity retry logic."""
        client = await self._get_client()
        logger.debug("[%s] GET %s", self.name, url)
        resp = await client.get(url)
        resp.raise_for_status()
        return resp

    async def fetch_json(self, url: str) -> dict | list:
        """Fetch a URL and return parsed JSON."""
        resp = await self.fetch(url)
        return resp.json()

    # ------------------------------------------------------------------
    # Abstract interface
    # ------------------------------------------------------------------

    @abstractmethod
    async def scrape(self) -> list[RawJob]:
        """Scrape the source and return a list of raw job postings.

        Subclasses must implement this method.
        """
        ...

    # ------------------------------------------------------------------
    # Context manager
    # ------------------------------------------------------------------

    async def __aenter__(self) -> BaseScraper:
        return self

    async def __aexit__(self, *exc: object) -> None:
        await self.close()
