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
def user_with_assertions(app, dummy_issuer):
    tahrir_db = db.get_db()
    tahrir_db.add_person("test@example.com", nickname="testuser")
    for i in range(15):
        tahrir_db.add_badge(
            name=f"badge-{i}",
            image="dummy-image",
            desc="dummy-desc",
            criteria="",
            issuer_id=dummy_issuer,
        )
        tahrir_db.add_assertion(f"badge-{i}", "test@example.com", None)
    return tahrir_db.get_person("test@example.com")


def test_user_profile_default_pagination(client, user_with_assertions):
    """Test that user profile paginates history to 10 items by default."""
    response = client.get("/user/testuser")
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert "Page 1 of 2" in html
    assert "Next" in html


def test_user_profile_page_2(client, user_with_assertions):
    """Test navigating to page 2 of badge history."""
    response = client.get("/user/testuser?page=2")
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert "Page 2 of 2" in html
    assert "Previous" in html


def test_user_profile_custom_per_page(client, user_with_assertions):
    """Test custom per_page parameter."""
    response = client.get("/user/testuser?per_page=5")
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert "Page 1 of 3" in html


def test_user_profile_invalid_page(client, user_with_assertions):
    """Test that invalid pagination params return 400."""
    response = client.get("/user/testuser?page=abc")
    assert response.status_code == 400


def test_user_profile_negative_page(client, user_with_assertions):
    """Test that negative page returns 400."""
    response = client.get("/user/testuser?page=-1")
    assert response.status_code == 400
