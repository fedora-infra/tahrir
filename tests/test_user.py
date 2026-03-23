"""Tests for user view pagination."""

from datetime import datetime, timedelta

import pytest

from tahrir.database import db


@pytest.fixture
def dummy_badge(app, dummy_issuer):
    tahrir_db = db.get_db()
    return tahrir_db.add_badge(
        name="test-badge",
        image="dummy-image",
        desc="dummy-desc",
        criteria="",
        issuer_id=dummy_issuer,
    )


@pytest.fixture
def user_with_badges(app, dummy_issuer):
    """Create a user with 15 badge assertions for pagination testing."""
    tahrir_db = db.get_db()
    person_email = "test-user@fedoraproject.org"
    tahrir_db.add_person(person_email, nickname="test-user")

    badges = []
    for i in range(15):
        badge_id = tahrir_db.add_badge(
            name=f"badge-{i}",
            image=f"image-{i}",
            desc=f"desc-{i}",
            criteria="",
            issuer_id=dummy_issuer,
        )
        badges.append(badge_id)

    base_date = datetime(2025, 1, 1)
    for i, badge_id in enumerate(badges):
        tahrir_db.add_assertion(
            badge_id,
            person_email,
            (base_date + timedelta(days=i)),
        )

    return tahrir_db.get_person(person_email=person_email)


def test_user_page_default_pagination(client, user_with_badges):
    """Default page=1, per_page=10 shows first 10 assertions."""
    response = client.get("/user/test-user")
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert "Page 1 of 2" in html
    assert "Next &raquo;" in html
    # Should not show previous on first page
    assert "&laquo; Previous" not in html


def test_user_page_second_page(client, user_with_badges):
    """Page 2 shows remaining assertions."""
    response = client.get("/user/test-user?page=2")
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert "Page 2 of 2" in html
    assert "&laquo; Previous" in html
    # Should not show next on last page
    assert "Next &raquo;" not in html


def test_user_page_custom_per_page(client, user_with_badges):
    """Custom per_page changes the number of pages."""
    response = client.get("/user/test-user?per_page=5")
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert "Page 1 of 3" in html


def test_user_page_beyond_total_clamps(client, user_with_badges):
    """Page beyond total_pages clamps to last page."""
    response = client.get("/user/test-user?page=999")
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert "Page 2 of 2" in html


def test_user_page_invalid_page_value(client, user_with_badges):
    """Non-integer page value returns 400."""
    response = client.get("/user/test-user?page=abc")
    assert response.status_code == 400


def test_user_page_invalid_per_page_value(client, user_with_badges):
    """Non-integer per_page value returns 400."""
    response = client.get("/user/test-user?per_page=abc")
    assert response.status_code == 400


def test_user_page_zero_page(client, user_with_badges):
    """Page 0 returns 400."""
    response = client.get("/user/test-user?page=0")
    assert response.status_code == 400


def test_user_page_negative_per_page(client, user_with_badges):
    """Negative per_page returns 400."""
    response = client.get("/user/test-user?per_page=-1")
    assert response.status_code == 400


def test_user_page_single_page(client, user_with_badges):
    """When all badges fit on one page, no pagination controls shown."""
    response = client.get("/user/test-user?per_page=20")
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert "Page 1 of 1" not in html
    assert "Next &raquo;" not in html
    assert "&laquo; Previous" not in html


def test_user_no_badges(client, app, dummy_badge):
    """User with no badges shows no history section."""
    tahrir_db = db.get_db()
    tahrir_db.add_person("nobadges@fedoraproject.org", nickname="nobadges-user")
    response = client.get("/user/nobadges-user")
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert "Page " not in html
