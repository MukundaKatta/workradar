"""H-1B visa intelligence — parse DOL disclosure data and company sponsorship history."""

from __future__ import annotations

import csv
import io
import logging
from typing import Any

import httpx

from config import PipelineConfig, get_config
from models import VisaIntel

logger = logging.getLogger(__name__)

# DOL publishes H-1B disclosure data quarterly. This URL pattern can be
# updated each fiscal year. In production, you would cache and periodically
# refresh this data.
DOL_LCA_BASE_URL = "https://www.dol.gov/sites/dolgov/files/ETA/oflc/pdfs/LCA_Disclosure_Data"


class VisaIntelligence:
    """Parse and query H-1B disclosure data for company sponsorship intelligence.

    Provides:
    - Company sponsorship history (has the company filed H-1B LCAs?)
    - Filing counts and approval rates
    - Average salary by role at each company
    """

    def __init__(self, config: PipelineConfig | None = None) -> None:
        self.config = config or get_config()
        self._client: httpx.AsyncClient | None = None
        # In-memory cache of processed company data
        self._company_cache: dict[str, VisaIntel] = {}

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(timeout=60.0, follow_redirects=True)
        return self._client

    async def close(self) -> None:
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    async def lookup_company(self, company_name: str) -> VisaIntel:
        """Look up H-1B sponsorship intelligence for a company.

        Returns cached data if available, otherwise returns an empty result.
        In production, this queries the pre-loaded DOL data from the database.
        """
        normalised = company_name.strip().lower()

        if normalised in self._company_cache:
            return self._company_cache[normalised]

        # Return empty intel if not in cache
        return VisaIntel(company_name=company_name)

    def load_from_records(self, records: list[dict[str, Any]]) -> int:
        """Load H-1B LCA records and aggregate by company.

        Each record should have:
            - employer_name: str
            - case_status: str (e.g., "Certified", "Denied", "Withdrawn")
            - job_title: str
            - wage_rate_of_pay_from: float
            - wage_unit_of_pay: str ("Year", "Hour", etc.)

        Returns the number of unique companies loaded.
        """
        company_data: dict[str, dict[str, Any]] = {}

        for record in records:
            name = (record.get("employer_name") or "").strip().lower()
            if not name:
                continue

            if name not in company_data:
                company_data[name] = {
                    "name_original": record.get("employer_name", ""),
                    "total": 0,
                    "approved": 0,
                    "denied": 0,
                    "withdrawn": 0,
                    "salaries": [],
                    "roles": {},
                }

            data = company_data[name]
            status = (record.get("case_status") or "").lower()
            data["total"] += 1

            if "certified" in status:
                data["approved"] += 1
            elif "denied" in status:
                data["denied"] += 1
            elif "withdrawn" in status:
                data["withdrawn"] += 1

            # Salary
            wage = record.get("wage_rate_of_pay_from")
            unit = (record.get("wage_unit_of_pay") or "").lower()
            if wage is not None:
                try:
                    annual = self._to_annual(float(wage), unit)
                    if annual:
                        data["salaries"].append(annual)
                except (ValueError, TypeError):
                    pass

            # Role tracking
            role = (record.get("job_title") or "").strip()
            if role:
                data["roles"][role] = data["roles"].get(role, 0) + 1

        # Build VisaIntel objects
        for name, data in company_data.items():
            top_roles = sorted(data["roles"], key=data["roles"].get, reverse=True)[:5]  # type: ignore[arg-type]
            avg_salary = (
                sum(data["salaries"]) / len(data["salaries"])
                if data["salaries"]
                else None
            )
            approval_rate = (
                data["approved"] / data["total"] if data["total"] > 0 else None
            )

            self._company_cache[name] = VisaIntel(
                company_name=data["name_original"],
                total_filings=data["total"],
                approved=data["approved"],
                denied=data["denied"],
                withdrawn=data["withdrawn"],
                approval_rate=round(approval_rate, 4) if approval_rate is not None else None,
                avg_salary=round(avg_salary, 2) if avg_salary is not None else None,
                top_roles=top_roles,
            )

        logger.info("Loaded H-1B data for %d companies", len(company_data))
        return len(company_data)

    def has_sponsorship_history(self, company_name: str) -> bool:
        """Check if a company has any H-1B filing history."""
        normalised = company_name.strip().lower()
        intel = self._company_cache.get(normalised)
        return intel is not None and intel.total_filings > 0

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _to_annual(wage: float, unit: str) -> float | None:
        """Convert a wage to annual based on unit."""
        if "year" in unit:
            return wage
        elif "hour" in unit:
            return wage * 2080
        elif "month" in unit:
            return wage * 12
        elif "week" in unit:
            return wage * 52
        elif "bi-week" in unit or "2 week" in unit:
            return wage * 26
        return None

    async def __aenter__(self) -> VisaIntelligence:
        return self

    async def __aexit__(self, *exc: object) -> None:
        await self.close()
