"""Visa sponsorship signal detection from job posting text."""

from __future__ import annotations

import logging
import re

from models import VisaAssessment, VisaSponsorSignal

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Signal patterns — (regex, signal, confidence, label)
# ---------------------------------------------------------------------------

_POSITIVE_PATTERNS: list[tuple[re.Pattern[str], float, str]] = [
    (re.compile(r"sponsor(?:ship)?\s+(?:is\s+)?available", re.I), 0.95, "sponsorship available"),
    (re.compile(r"will\s+sponsor", re.I), 0.95, "will sponsor"),
    (re.compile(r"we\s+sponsor\s+visas?", re.I), 0.95, "we sponsor visas"),
    (re.compile(r"visa\s+sponsor(?:ship)?\s+(?:provided|offered|included)", re.I), 0.90, "visa sponsorship provided"),
    (re.compile(r"h-?1b\s+sponsor(?:ship)?", re.I), 0.90, "H-1B sponsorship mentioned"),
    (re.compile(r"open\s+to\s+sponsor", re.I), 0.90, "open to sponsoring"),
    (re.compile(r"immigration\s+(?:support|assistance)", re.I), 0.80, "immigration support"),
    (re.compile(r"relocation\s+(?:support|assistance|package)", re.I), 0.60, "relocation support"),
]

_NEGATIVE_PATTERNS: list[tuple[re.Pattern[str], float, str]] = [
    (re.compile(r"must\s+be\s+(?:legally\s+)?(?:authorized|authorised)\s+to\s+work", re.I), 0.90, "must be authorized to work"),
    (re.compile(r"(?:cannot|can\s?not|unable\s+to)\s+sponsor", re.I), 0.95, "cannot sponsor"),
    (re.compile(r"no\s+(?:visa\s+)?sponsor(?:ship)?", re.I), 0.95, "no sponsorship"),
    (re.compile(r"(?:do|does)\s+not\s+sponsor", re.I), 0.95, "does not sponsor"),
    (re.compile(r"(?:us|u\.s\.)\s+(?:citizen(?:s|ship)?|permanent\s+resident)\s+(?:only|required)", re.I), 0.90, "US citizens only"),
    (re.compile(r"(?:must|need\s+to)\s+(?:have|hold|possess)\s+(?:a\s+)?(?:valid\s+)?(?:work\s+)?(?:authoriz|permit)", re.I), 0.85, "must have work authorization"),
    (re.compile(r"without\s+(?:the\s+)?need\s+for\s+sponsor", re.I), 0.90, "without need for sponsorship"),
    (re.compile(r"not\s+(?:eligible|able)\s+to\s+(?:provide|offer)\s+sponsor", re.I), 0.95, "not able to sponsor"),
]

_MAYBE_PATTERNS: list[tuple[re.Pattern[str], float, str]] = [
    (re.compile(r"e-?verify\s+(?:participant|employer)", re.I), 0.50, "E-Verify participant"),
    (re.compile(r"equal\s+opportunity\s+employer", re.I), 0.30, "Equal opportunity employer"),
    (re.compile(r"authorized\s+to\s+work.*preferred", re.I), 0.60, "work authorization preferred"),
]


class VisaParser:
    """Detect visa sponsorship signals from job posting text.

    Returns a ``VisaAssessment`` with the overall signal, confidence, and
    supporting evidence quotes.
    """

    def parse(self, text: str) -> VisaAssessment:
        """Analyse text for visa sponsorship signals.

        Checks negative patterns first (they tend to be more definitive),
        then positive, then ambiguous.
        """
        if not text:
            return VisaAssessment()

        evidence: list[str] = []

        # Check negative signals (no sponsor)
        neg_confidence = 0.0
        for pattern, conf, label in _NEGATIVE_PATTERNS:
            match = pattern.search(text)
            if match:
                evidence.append(f"[NO] {label}: '{match.group(0).strip()}'")
                neg_confidence = max(neg_confidence, conf)

        # Check positive signals (will sponsor)
        pos_confidence = 0.0
        for pattern, conf, label in _POSITIVE_PATTERNS:
            match = pattern.search(text)
            if match:
                evidence.append(f"[YES] {label}: '{match.group(0).strip()}'")
                pos_confidence = max(pos_confidence, conf)

        # Check ambiguous signals
        maybe_confidence = 0.0
        for pattern, conf, label in _MAYBE_PATTERNS:
            match = pattern.search(text)
            if match:
                evidence.append(f"[MAYBE] {label}: '{match.group(0).strip()}'")
                maybe_confidence = max(maybe_confidence, conf)

        # Determine overall signal — negative overrides if both present
        if neg_confidence > 0 and neg_confidence >= pos_confidence:
            return VisaAssessment(
                signal=VisaSponsorSignal.NO,
                confidence=neg_confidence,
                evidence=evidence,
            )
        elif pos_confidence > 0:
            return VisaAssessment(
                signal=VisaSponsorSignal.YES,
                confidence=pos_confidence,
                evidence=evidence,
            )
        elif maybe_confidence > 0:
            return VisaAssessment(
                signal=VisaSponsorSignal.MAYBE,
                confidence=maybe_confidence,
                evidence=evidence,
            )

        return VisaAssessment(
            signal=VisaSponsorSignal.UNKNOWN,
            confidence=0.0,
            evidence=evidence,
        )
