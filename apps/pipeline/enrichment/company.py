"""Company data enrichment — logos, industry, size, Glassdoor, H-1B history."""

from __future__ import annotations

import logging
import re
from typing import Any

import httpx

from config import PipelineConfig, get_config
from models import CompanyInfo

logger = logging.getLogger(__name__)

# Common tech stack keywords to detect from job descriptions
_TECH_KEYWORDS = [
    "python", "javascript", "typescript", "react", "vue", "angular", "node.js",
    "go", "golang", "rust", "java", "kotlin", "swift", "ruby", "rails",
    "django", "flask", "fastapi", "spring", "docker", "kubernetes", "k8s",
    "aws", "gcp", "azure", "terraform", "postgresql", "mysql", "mongodb",
    "redis", "kafka", "graphql", "rest", "grpc", "nextjs", "next.js",
    "tailwind", "svelte", "elixir", "scala", "c++", "c#", ".net",
    "pytorch", "tensorflow", "spark", "airflow", "dbt", "snowflake",
    "elasticsearch", "rabbitmq", "datadog", "sentry",
]


class CompanyEnricher:
    """Enrich company profiles with additional data.

    Capabilities:
    - Detect tech stack from job descriptions
    - Fetch company logo via Clearbit Logo API (free)
    - Detect industry from description patterns
    - Look up H-1B sponsorship history
    """

    def __init__(self, config: PipelineConfig | None = None) -> None:
        self.config = config or get_config()
        self._client: httpx.AsyncClient | None = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(timeout=15.0, follow_redirects=True)
        return self._client

    async def close(self) -> None:
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    async def enrich(
        self,
        company_name: str,
        domain: str = "",
        job_descriptions: list[str] | None = None,
    ) -> CompanyInfo:
        """Build an enriched CompanyInfo for the given company.

        Args:
            company_name: The company name.
            domain: Company website domain (e.g., "stripe.com").
            job_descriptions: Raw job description texts for tech stack detection.

        Returns:
            CompanyInfo with available enrichment data.
        """
        info = CompanyInfo(name=company_name)

        # Tech stack detection
        if job_descriptions:
            info.tech_stack = self.detect_tech_stack(job_descriptions)

        # Logo
        if domain:
            info.logo_url = f"https://logo.clearbit.com/{domain}"

        # Industry detection from descriptions
        if job_descriptions:
            info.industry = self._detect_industry(job_descriptions)

        logger.info(
            "Enriched %s: industry=%s, tech_stack=%d items",
            company_name,
            info.industry,
            len(info.tech_stack),
        )
        return info

    @staticmethod
    def detect_tech_stack(descriptions: list[str]) -> list[str]:
        """Extract tech stack from job description text.

        Returns a sorted list of detected technologies.
        """
        combined = " ".join(descriptions).lower()
        detected: set[str] = set()

        for tech in _TECH_KEYWORDS:
            # Use word boundary matching to avoid false positives
            pattern = rf"\b{re.escape(tech)}\b"
            if re.search(pattern, combined):
                detected.add(tech)

        return sorted(detected)

    @staticmethod
    def _detect_industry(descriptions: list[str]) -> str:
        """Heuristic industry detection from job descriptions."""
        combined = " ".join(descriptions).lower()

        industry_signals: dict[str, list[str]] = {
            "fintech": ["fintech", "banking", "payments", "financial services", "trading"],
            "healthcare": ["healthcare", "health tech", "medical", "clinical", "patient"],
            "e-commerce": ["e-commerce", "ecommerce", "retail", "marketplace", "shopping"],
            "saas": ["saas", "b2b", "enterprise software", "platform"],
            "ai/ml": ["machine learning", "artificial intelligence", "deep learning", "llm", "nlp"],
            "cybersecurity": ["cybersecurity", "security", "infosec", "threat", "vulnerability"],
            "edtech": ["education", "edtech", "learning platform", "e-learning"],
            "devtools": ["developer tools", "devtools", "developer experience", "sdk", "api platform"],
            "gaming": ["gaming", "game development", "game engine"],
            "crypto/web3": ["blockchain", "crypto", "web3", "defi", "smart contract"],
        }

        scores: dict[str, int] = {}
        for industry, keywords in industry_signals.items():
            score = sum(1 for kw in keywords if kw in combined)
            if score > 0:
                scores[industry] = score

        if scores:
            return max(scores, key=scores.get)  # type: ignore[arg-type]
        return ""

    async def __aenter__(self) -> CompanyEnricher:
        return self

    async def __aexit__(self, *exc: object) -> None:
        await self.close()
