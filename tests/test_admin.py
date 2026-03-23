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
        tags="existing-tag,",
    )


def test_add_tag(client, dummy_badge):
    """Test that the add_tag endpoint adds tags to a badge."""
    response = client.post(
        "/add_tag",
        data={"badge_id": "test-badge", "tags": "new-tag, another-tag"},
        follow_redirects=False,
    )
    assert response.status_code == 302

    tahrir_db = db.get_db()
    badge = tahrir_db.get_badge("test-badge")
    tags = {t.strip() for t in badge.tags.split(",") if t.strip()}
    assert "existing-tag" in tags
    assert "new-tag" in tags
    assert "another-tag" in tags


def test_add_tag_nonexistent_badge(client, dummy_badge):
    """Test that add_tag returns 404 for a badge that doesn't exist."""
    response = client.post(
        "/add_tag",
        data={"badge_id": "nonexistent-badge", "tags": "some-tag"},
    )
    assert response.status_code == 404
