# Copyright (c) 2019 Red Hat, Inc.

"""Test tahrir.utils.date_time"""

from tahrir.utils import date_time


def test_singularize_value_1():
    """Test that the trailing letter is returned when value is 1."""
    assert date_time.singularize("cats", 1) == "cat"
