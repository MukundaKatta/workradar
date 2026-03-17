"""Taste learner — adapts profile embeddings based on user interactions."""

from __future__ import annotations

import logging
from typing import Any

import numpy as np

from models import InteractionType

logger = logging.getLogger(__name__)

# Interaction weights — how much each action shifts the profile embedding
_INTERACTION_WEIGHTS: dict[InteractionType, float] = {
    InteractionType.APPLY: 0.15,
    InteractionType.SAVE: 0.10,
    InteractionType.DISMISS: -0.08,
    InteractionType.VIEW: 0.02,
}

# Time decay — recent actions weigh more heavily
_DECAY_HALF_LIFE_DAYS = 14.0


class TasteLearner:
    """Learn user preferences from interaction signals (save, dismiss, apply).

    Updates the user's profile embedding by nudging it toward saved/applied jobs
    and away from dismissed ones. Recent actions are weighted more heavily via
    exponential time decay.
    """

    def __init__(self, learning_rate: float = 0.1) -> None:
        self.learning_rate = learning_rate

    def update_embedding(
        self,
        profile_embedding: list[float],
        interactions: list[dict[str, Any]],
    ) -> list[float]:
        """Update a profile embedding based on interaction history.

        Args:
            profile_embedding: Current profile embedding vector.
            interactions: List of dicts with keys:
                - type: InteractionType value ("save", "dismiss", "apply", "view")
                - job_embedding: The embedding of the interacted job.
                - days_ago: How many days ago the interaction occurred.

        Returns:
            Updated profile embedding vector.
        """
        if not interactions:
            return profile_embedding

        profile = np.array(profile_embedding, dtype=np.float64)
        adjustment = np.zeros_like(profile)

        for interaction in interactions:
            try:
                action = InteractionType(interaction["type"])
                job_emb = np.array(interaction["job_embedding"], dtype=np.float64)
                days_ago = float(interaction.get("days_ago", 0))

                weight = _INTERACTION_WEIGHTS.get(action, 0.0)
                time_decay = self._time_decay(days_ago)

                # Direction: difference between job and current profile
                direction = job_emb - profile
                norm = np.linalg.norm(direction)
                if norm > 0:
                    direction = direction / norm

                adjustment += weight * time_decay * direction

            except (KeyError, ValueError):
                logger.debug("Skipping invalid interaction: %s", interaction)
                continue

        # Apply adjustment with learning rate
        updated = profile + self.learning_rate * adjustment

        # Re-normalise to unit length
        norm = np.linalg.norm(updated)
        if norm > 0:
            updated = updated / norm

        logger.debug(
            "Updated profile embedding with %d interactions, delta norm=%.4f",
            len(interactions),
            float(np.linalg.norm(self.learning_rate * adjustment)),
        )

        return updated.tolist()

    def compute_preference_shift(
        self,
        old_embedding: list[float],
        new_embedding: list[float],
    ) -> float:
        """Measure how much the embedding shifted (cosine distance)."""
        a = np.array(old_embedding, dtype=np.float64)
        b = np.array(new_embedding, dtype=np.float64)

        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)

        if norm_a == 0 or norm_b == 0:
            return 1.0

        similarity = float(np.dot(a, b) / (norm_a * norm_b))
        return 1.0 - similarity

    @staticmethod
    def _time_decay(days_ago: float) -> float:
        """Exponential time decay with configurable half-life.

        Returns a weight between 0 and 1, where 1 is "just now" and
        decays to 0.5 after ``_DECAY_HALF_LIFE_DAYS``.
        """
        if days_ago <= 0:
            return 1.0
        return float(2.0 ** (-days_ago / _DECAY_HALF_LIFE_DAYS))
