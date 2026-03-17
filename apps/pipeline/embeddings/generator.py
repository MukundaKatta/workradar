"""Embedding generation using OpenAI text-embedding-3-small."""

from __future__ import annotations

import asyncio
import logging
from typing import Any

import numpy as np
import openai

from config import PipelineConfig, get_config

logger = logging.getLogger(__name__)


class EmbeddingGenerator:
    """Generate and store vector embeddings for jobs, profiles, and companies.

    Uses OpenAI's ``text-embedding-3-small`` model with batch support
    (up to 2048 texts per API call).
    """

    def __init__(self, config: PipelineConfig | None = None) -> None:
        self.config = config or get_config()
        self._client: openai.AsyncOpenAI | None = None

    @property
    def client(self) -> openai.AsyncOpenAI:
        """Lazily initialise the OpenAI async client."""
        if self._client is None:
            self._client = openai.AsyncOpenAI(api_key=self.config.openai_api_key)
        return self._client

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    async def embed_texts(self, texts: list[str]) -> list[list[float]]:
        """Generate embeddings for a list of texts in batches.

        Returns a list of embedding vectors, one per input text.
        """
        all_embeddings: list[list[float]] = []
        batch_size = self.config.embedding_batch_size

        for i in range(0, len(texts), batch_size):
            batch = texts[i : i + batch_size]
            # Filter out empty strings (API rejects them)
            batch = [t if t.strip() else " " for t in batch]

            try:
                response = await self.client.embeddings.create(
                    model=self.config.embedding_model,
                    input=batch,
                    dimensions=self.config.embedding_dimensions,
                )
                batch_embeddings = [item.embedding for item in response.data]
                all_embeddings.extend(batch_embeddings)
                logger.debug("Embedded batch %d-%d (%d texts)", i, i + len(batch), len(batch))
            except Exception:
                logger.exception("Failed to embed batch %d-%d", i, i + len(batch))
                # Append zero vectors for failed batch so indices stay aligned
                all_embeddings.extend(
                    [[0.0] * self.config.embedding_dimensions] * len(batch)
                )

        return all_embeddings

    async def embed_job(self, title: str, description: str, skills: list[str]) -> list[float]:
        """Generate an embedding for a job posting.

        Combines title, cleaned description, and skills into a single text.
        """
        combined = self._combine_job_text(title, description, skills)
        embeddings = await self.embed_texts([combined])
        return embeddings[0]

    async def embed_profile(
        self,
        desired_roles: list[str],
        skills: list[str],
        headline: str = "",
        work_history: str = "",
    ) -> list[float]:
        """Generate an embedding for a user profile.

        Combines desired roles, skills, headline, and work history.
        """
        parts = []
        if desired_roles:
            parts.append("Desired roles: " + ", ".join(desired_roles))
        if skills:
            parts.append("Skills: " + ", ".join(skills))
        if headline:
            parts.append("Headline: " + headline)
        if work_history:
            parts.append("Experience: " + work_history[:2000])

        combined = "\n".join(parts)
        embeddings = await self.embed_texts([combined])
        return embeddings[0]

    async def embed_company(
        self,
        name: str,
        industry: str = "",
        tech_stack: list[str] | None = None,
        culture: str = "",
    ) -> list[float]:
        """Generate an embedding for a company.

        Combines name, industry, tech stack, and culture signals.
        """
        parts = [f"Company: {name}"]
        if industry:
            parts.append(f"Industry: {industry}")
        if tech_stack:
            parts.append("Tech stack: " + ", ".join(tech_stack))
        if culture:
            parts.append(f"Culture: {culture}")

        combined = "\n".join(parts)
        embeddings = await self.embed_texts([combined])
        return embeddings[0]

    async def embed_jobs_batch(
        self,
        jobs: list[dict[str, Any]],
    ) -> list[list[float]]:
        """Embed a batch of jobs. Each job dict should have 'title', 'description', 'skills'."""
        texts = [
            self._combine_job_text(
                j.get("title", ""),
                j.get("description", ""),
                j.get("skills", []),
            )
            for j in jobs
        ]
        return await self.embed_texts(texts)

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _combine_job_text(title: str, description: str, skills: list[str]) -> str:
        """Combine job fields into a single text for embedding."""
        parts = []
        if title:
            parts.append(f"Title: {title}")
        if skills:
            parts.append("Skills: " + ", ".join(skills))
        if description:
            # Truncate long descriptions to stay within token limits
            parts.append("Description: " + description[:4000])
        return "\n".join(parts)
