"""Pydantic models for the WorkRadar pipeline."""

from __future__ import annotations

import datetime as dt
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class RemoteStatus(str, Enum):
    """Remote work classification."""
    REMOTE = "remote"
    HYBRID = "hybrid"
    ONSITE = "onsite"
    UNKNOWN = "unknown"


class VisaSponsorSignal(str, Enum):
    """Visa sponsorship likelihood."""
    YES = "yes"
    NO = "no"
    MAYBE = "maybe"
    UNKNOWN = "unknown"


class InteractionType(str, Enum):
    """User interaction types for taste learning."""
    SAVE = "save"
    DISMISS = "dismiss"
    APPLY = "apply"
    VIEW = "view"


# ---------------------------------------------------------------------------
# Scraper models
# ---------------------------------------------------------------------------

class RawJob(BaseModel):
    """A job posting as scraped from a source, before AI parsing."""

    source: str = Field(description="Scraper source identifier, e.g. 'hn_hiring', 'greenhouse'.")
    source_id: str = Field(default="", description="Unique ID within the source.")
    source_url: str = Field(default="", description="Original URL of the posting.")
    company: str = Field(default="")
    title: str = Field(default="")
    location: str = Field(default="")
    remote: RemoteStatus = RemoteStatus.UNKNOWN
    description_html: str = Field(default="", description="Raw HTML or text of the posting.")
    description_text: str = Field(default="", description="Cleaned plain-text description.")
    posted_at: dt.datetime | None = None
    scraped_at: dt.datetime = Field(default_factory=dt.datetime.utcnow)
    extra: dict[str, Any] = Field(default_factory=dict)


# ---------------------------------------------------------------------------
# Parser models
# ---------------------------------------------------------------------------

class SalaryRange(BaseModel):
    """Normalised annual salary range in USD."""
    min_usd: int | None = None
    max_usd: int | None = None
    currency: str = "USD"
    period: str = "year"
    raw_text: str = ""


class VisaAssessment(BaseModel):
    """Visa sponsorship assessment for a posting."""
    signal: VisaSponsorSignal = VisaSponsorSignal.UNKNOWN
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    evidence: list[str] = Field(default_factory=list)


class ParsedJob(BaseModel):
    """A job posting after AI-powered parsing and enrichment."""

    raw_job_id: str = ""
    clean_title: str = ""
    company: str = ""
    location: str = ""
    remote: RemoteStatus = RemoteStatus.UNKNOWN

    required_skills: list[str] = Field(default_factory=list)
    preferred_skills: list[str] = Field(default_factory=list)
    years_experience_min: int | None = None
    years_experience_max: int | None = None

    salary: SalaryRange = Field(default_factory=SalaryRange)
    visa: VisaAssessment = Field(default_factory=VisaAssessment)

    red_flags: list[str] = Field(default_factory=list)
    green_flags: list[str] = Field(default_factory=list)
    culture_signals: list[str] = Field(default_factory=list)

    ai_summary: str = ""
    parsed_at: dt.datetime = Field(default_factory=dt.datetime.utcnow)
    extra: dict[str, Any] = Field(default_factory=dict)


# ---------------------------------------------------------------------------
# Matching models
# ---------------------------------------------------------------------------

class MatchScores(BaseModel):
    """Breakdown of individual match scores."""
    vector_similarity: float = 0.0
    skill_match: float = 0.0
    experience_match: float = 0.0
    salary_match: float = 0.0
    location_match: float = 0.0
    visa_match: float = 0.0
    culture_match: float = 0.0


class MatchResult(BaseModel):
    """Result of matching a profile against a job."""
    profile_id: str
    job_id: str
    overall_score: float = 0.0
    scores: MatchScores = Field(default_factory=MatchScores)
    match_reason: str = ""
    matched_at: dt.datetime = Field(default_factory=dt.datetime.utcnow)


class RadarResult(BaseModel):
    """A job that matched a user's radar configuration."""
    radar_id: str
    profile_id: str
    job_id: str
    score: float = 0.0
    match_reason: str = ""
    notified: bool = False


# ---------------------------------------------------------------------------
# Enrichment models
# ---------------------------------------------------------------------------

class CompanyInfo(BaseModel):
    """Enriched company data."""
    name: str
    logo_url: str = ""
    industry: str = ""
    size: str = ""
    glassdoor_rating: float | None = None
    tech_stack: list[str] = Field(default_factory=list)
    h1b_sponsor_history: bool = False
    h1b_filing_count: int = 0
    h1b_approval_rate: float | None = None


class VisaIntel(BaseModel):
    """H-1B visa intelligence for a company."""
    company_name: str
    total_filings: int = 0
    approved: int = 0
    denied: int = 0
    withdrawn: int = 0
    approval_rate: float | None = None
    avg_salary: float | None = None
    top_roles: list[str] = Field(default_factory=list)
    last_updated: dt.datetime = Field(default_factory=dt.datetime.utcnow)
