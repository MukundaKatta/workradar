"""Pipeline configuration loaded from environment variables."""

from __future__ import annotations

from pydantic_settings import BaseSettings


class PipelineConfig(BaseSettings):
    """Central configuration for the WorkRadar pipeline.

    All values are read from environment variables (or a .env file).
    Prefix: ``WORKRADAR_``.
    """

    model_config = {"env_prefix": "WORKRADAR_"}

    # --- Supabase ----------------------------------------------------------
    supabase_url: str = ""
    supabase_service_key: str = ""

    # --- OpenAI (embeddings) -----------------------------------------------
    openai_api_key: str = ""
    embedding_model: str = "text-embedding-3-small"
    embedding_batch_size: int = 2048
    embedding_dimensions: int = 1536

    # --- Anthropic / Bedrock (parsing) -------------------------------------
    anthropic_api_key: str = ""
    anthropic_model: str = "claude-sonnet-4-20250514"

    # --- AWS Bedrock (optional alternative) --------------------------------
    aws_region: str = "us-east-1"
    bedrock_model_id: str = "anthropic.claude-sonnet-4-20250514-v1:0"
    use_bedrock: bool = False

    # --- Scraping ----------------------------------------------------------
    scraper_rpm: int = 30
    scraper_max_retries: int = 3
    scraper_batch_size: int = 100
    scraper_user_agent: str = (
        "WorkRadar/0.1 (+https://workradar.app; job-aggregation bot)"
    )

    # --- Matching ----------------------------------------------------------
    match_weight_vector: float = 0.30
    match_weight_skill: float = 0.25
    match_weight_experience: float = 0.10
    match_weight_salary: float = 0.10
    match_weight_location: float = 0.10
    match_weight_visa: float = 0.10
    match_weight_culture: float = 0.05

    match_min_score: float = 0.40

    # --- Logging -----------------------------------------------------------
    log_level: str = "INFO"


def get_config() -> PipelineConfig:
    """Return a validated pipeline configuration instance."""
    return PipelineConfig()  # type: ignore[call-arg]
