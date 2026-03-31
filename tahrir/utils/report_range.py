"""Parsing and validation for custom date-range leaderboard reports."""

from datetime import datetime


# Cap range length to limit load on make_leaderboard (roughly one leap year).
MAX_CUSTOM_REPORT_RANGE_DAYS = 366


def parse_custom_report_range(start_s: str, end_s: str):
    """Parse ISO dates (YYYY-MM-DD) and enforce ordering and max span.

    Returns:
        tuple[date, date]: (start, end) inclusive calendar days for the report.

    Raises:
        ValueError: Invalid format, start after end, or span too long.
    """
    try:
        start_d = datetime.strptime(start_s.strip(), "%Y-%m-%d").date()
        end_d = datetime.strptime(end_s.strip(), "%Y-%m-%d").date()
    except ValueError as exc:
        raise ValueError("Dates must be in YYYY-MM-DD format.") from exc
    if start_d > end_d:
        raise ValueError("Start date must be on or before end date.")
    if (end_d - start_d).days > MAX_CUSTOM_REPORT_RANGE_DAYS:
        raise ValueError(f"Date range cannot exceed {MAX_CUSTOM_REPORT_RANGE_DAYS} days.")
    return start_d, end_d
