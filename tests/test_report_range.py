# Copyright (c) 2019 Red Hat, Inc.

"""Tests for custom report date-range parsing."""

from datetime import date, timedelta

import pytest

from tahrir.utils.report_range import MAX_CUSTOM_REPORT_RANGE_DAYS, parse_custom_report_range


def test_parse_custom_report_range_ok():
    start, end = parse_custom_report_range("2024-03-01", "2024-03-31")
    assert start == date(2024, 3, 1)
    assert end == date(2024, 3, 31)


def test_parse_custom_report_range_single_day():
    start, end = parse_custom_report_range("2024-06-15", "2024-06-15")
    assert start == end == date(2024, 6, 15)


def test_parse_custom_report_range_rejects_order():
    with pytest.raises(ValueError, match="Start date"):
        parse_custom_report_range("2024-03-10", "2024-03-01")


def test_parse_custom_report_range_rejects_bad_format():
    with pytest.raises(ValueError, match="YYYY-MM-DD"):
        parse_custom_report_range("31-03-2024", "2024-03-31")


def test_parse_custom_report_range_max_span():
    start = date(2024, 1, 1)
    end_ok = start + timedelta(days=MAX_CUSTOM_REPORT_RANGE_DAYS)
    s_ok, e_ok = parse_custom_report_range(start.isoformat(), end_ok.isoformat())
    assert (e_ok - s_ok).days == MAX_CUSTOM_REPORT_RANGE_DAYS

    end_too_far = start + timedelta(days=MAX_CUSTOM_REPORT_RANGE_DAYS + 1)
    with pytest.raises(ValueError, match="cannot exceed"):
        parse_custom_report_range(start.isoformat(), end_too_far.isoformat())
