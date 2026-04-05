# Copyright (c) 2019 Red Hat, Inc.

"""Test tahrir.utils.date_time"""

from datetime import date, datetime, timedelta, timezone

from tahrir.utils import date_time


def test_singularize_value_1():
    """Test that the trailing letter is returned when value is 1."""
    assert date_time.singularize("cats", 1) == "cat"


def test_singularize_without_value_1():
    """Test that the original word is returned when value is not 1."""
    assert date_time.singularize("buses", 0) == "buses"


def test_singularize_without_value_2():
    """Test that the original word is returned when value is not 1."""
    assert date_time.singularize("buses", 2) == "buses"


def test_get_start_week_known_date():
    """Test that the correct start of the week is returned for a known date."""
    assert date_time.get_start_week(2020, 1, 1) == date(2019, 12, 30)


def test_get_start_week_when_date_is_monday():
    """Test that get_start_week returns the same date when given a Monday."""
    # January 6, 2020 was a Monday
    assert date_time.get_start_week(2020, 1, 6) == date(2020, 1, 6)


def test_relative_time_just_now():
    """Test that very recent times return 'just now' or seconds."""
    recent = datetime.now(timezone.utc) - timedelta(milliseconds=100)
    result = date_time.relative_time(recent)
    # Should contain "ago" since it's in the past
    assert "ago" in result or result == "just now"
