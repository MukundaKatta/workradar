"""Salary extraction and normalisation from job posting text."""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass

from models import SalaryRange

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Regex patterns for common salary formats
# ---------------------------------------------------------------------------

# $150,000 - $200,000 / year  |  $150k-$200k  |  150,000-200,000
_RANGE_PATTERN = re.compile(
    r"\$?\s*(\d{2,3})[,.]?(\d{3})?\s*[kK]?\s*[-–—to]+\s*\$?\s*(\d{2,3})[,.]?(\d{3})?\s*[kK]?"
    r"(?:\s*(?:per\s+|/\s*|a\s+)?(?:year|yr|annual|annum|pa))?",
    re.IGNORECASE,
)

# $150k  |  $150K  |  $150,000
_SINGLE_PATTERN = re.compile(
    r"\$\s*(\d{2,3})[,.]?(\d{3})?\s*[kK]?"
    r"(?:\s*(?:per\s+|/\s*|a\s+)?(?:year|yr|annual|annum|pa|hour|hr|month|mo))?",
    re.IGNORECASE,
)

# $50/hr  |  $50 per hour  |  $50/hour
_HOURLY_PATTERN = re.compile(
    r"\$\s*(\d{2,4})\s*(?:per\s+|/\s*)?(?:hour|hr)\b",
    re.IGNORECASE,
)

# $10,000/month  |  $10k/mo
_MONTHLY_PATTERN = re.compile(
    r"\$\s*(\d{1,3})[,.]?(\d{3})?\s*[kK]?\s*(?:per\s+|/\s*)?(?:month|mo)\b",
    re.IGNORECASE,
)

HOURS_PER_YEAR = 2080
MONTHS_PER_YEAR = 12


class SalaryParser:
    """Extract and normalise salary information from job posting text."""

    def parse(self, text: str) -> SalaryRange:
        """Extract salary from text and normalise to annual USD.

        Tries multiple patterns in order of specificity.
        """
        if not text:
            return SalaryRange()

        # Try hourly first (more specific)
        hourly = self._try_hourly(text)
        if hourly:
            return hourly

        # Try monthly
        monthly = self._try_monthly(text)
        if monthly:
            return monthly

        # Try range pattern
        range_match = self._try_range(text)
        if range_match:
            return range_match

        # Try single value
        single = self._try_single(text)
        if single:
            return single

        return SalaryRange()

    # ------------------------------------------------------------------
    # Pattern matchers
    # ------------------------------------------------------------------

    def _try_range(self, text: str) -> SalaryRange | None:
        """Try to extract a salary range like '$150k - $200k'."""
        match = _RANGE_PATTERN.search(text)
        if not match:
            return None

        low = self._parse_amount(match.group(1), match.group(2))
        high = self._parse_amount(match.group(3), match.group(4))

        if low is None or high is None:
            return None

        # Ensure the range is in the right order
        if low > high:
            low, high = high, low

        return SalaryRange(
            min_usd=low,
            max_usd=high,
            raw_text=match.group(0).strip(),
        )

    def _try_single(self, text: str) -> SalaryRange | None:
        """Try to extract a single salary value like '$150k'."""
        match = _SINGLE_PATTERN.search(text)
        if not match:
            return None

        amount = self._parse_amount(match.group(1), match.group(2))
        if amount is None:
            return None

        return SalaryRange(
            min_usd=amount,
            max_usd=amount,
            raw_text=match.group(0).strip(),
        )

    def _try_hourly(self, text: str) -> SalaryRange | None:
        """Try to extract an hourly rate and convert to annual."""
        match = _HOURLY_PATTERN.search(text)
        if not match:
            return None

        hourly_rate = int(match.group(1))
        annual = hourly_rate * HOURS_PER_YEAR

        return SalaryRange(
            min_usd=annual,
            max_usd=annual,
            period="hour",
            raw_text=match.group(0).strip(),
        )

    def _try_monthly(self, text: str) -> SalaryRange | None:
        """Try to extract a monthly salary and convert to annual."""
        match = _MONTHLY_PATTERN.search(text)
        if not match:
            return None

        monthly = self._parse_amount(match.group(1), match.group(2))
        if monthly is None:
            return None

        annual = monthly * MONTHS_PER_YEAR

        return SalaryRange(
            min_usd=annual,
            max_usd=annual,
            period="month",
            raw_text=match.group(0).strip(),
        )

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _parse_amount(main: str, thousands: str | None) -> int | None:
        """Parse a salary amount from regex groups.

        Handles both '$150,000' (main='150', thousands='000') and
        '$150k' (main='150', thousands=None) formats.
        """
        if not main:
            return None

        try:
            if thousands:
                return int(main) * 1000 + int(thousands)
            else:
                value = int(main)
                # If the number is small (< 1000), assume it's in thousands (e.g., 150k)
                if value < 1000:
                    return value * 1000
                return value
        except ValueError:
            return None
