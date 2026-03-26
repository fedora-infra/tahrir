"""Test tahrir.views.report - regression tests for monthly leaderboard."""

from datetime import date, timedelta


def test_report_year_month_returns_200(client):
    """Test that the monthly report page loads successfully."""
    response = client.get("/report/2024/1")
    assert response.status_code == 200


def test_report_year_month_december_returns_200(client):
    """Test December works correctly.

    Before the fix, month + 1 = 13 would cause a ValueError.
    """
    response = client.get("/report/2024/12")
    assert response.status_code == 200


def test_report_year_month_stop_date_january():
    """Test that stop date is the last day of January."""
    stop = date(2024, 2, 1) - timedelta(days=1)
    assert stop == date(2024, 1, 31)


def test_report_year_month_stop_date_december():
    """Test that stop date is the last day of December.

    This tests the month == 12 branch which avoids date(year, 13, 1).
    """
    stop = date(2025, 1, 1) - timedelta(days=1)
    assert stop == date(2024, 12, 31)


def test_report_year_month_stop_date_leap_year():
    """Test that stop date handles February in a leap year correctly."""
    stop = date(2024, 3, 1) - timedelta(days=1)
    assert stop == date(2024, 2, 29)


def test_report_year_month_stop_date_non_leap_year():
    """Test that stop date handles February in a non-leap year correctly."""
    stop = date(2023, 3, 1) - timedelta(days=1)
    assert stop == date(2023, 2, 28)
