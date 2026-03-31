# Copyright (c) 2019 Red Hat, Inc.

"""Test tahrir.utils.date_time"""

from datetime import date

from tahrir.utils import date_time


def test_last_day_of_calendar_month():
    assert date_time.last_day_of_calendar_month(2024, 3) == date(2024, 3, 31)
    assert date_time.last_day_of_calendar_month(2024, 2) == date(2024, 2, 29)
    assert date_time.last_day_of_calendar_month(2023, 2) == date(2023, 2, 28)


def test_singularize_value_1():
    """Test that the trailing letter is returned when value is 1."""
    assert date_time.singularize("cats", 1) == "cat"
