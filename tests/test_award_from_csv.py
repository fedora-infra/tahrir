
"""Test tahrir.views.admin.award_from_csv"""

import io

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


def test_award_from_csv_no_file(client):
    """Test that missing file upload is handled gracefully."""
    response = client.post(
        "/award_from_csv",
        data={},
        content_type="multipart/form-data",
    )
    # Should redirect back to admin, not crash
    assert response.status_code == 302


def test_award_from_csv_valid_email_first(client, dummy_badge):
    """Test CSV with email in first column."""
    csv_content = b"test@example.com,test-badge\n"
    response = client.post(
        "/award_from_csv",
        data={"csv-file": (io.BytesIO(csv_content), "test.csv")},
        content_type="multipart/form-data",
    )
    assert response.status_code == 302


def test_award_from_csv_valid_badge_first(client, dummy_badge):
    """Test CSV with badge_id in first column."""
    csv_content = b"test-badge,test@example.com\n"
    response = client.post(
        "/award_from_csv",
        data={"csv-file": (io.BytesIO(csv_content), "test.csv")},
        content_type="multipart/form-data",
    )
    assert response.status_code == 302


def test_award_from_csv_empty_file(client):
    """Test that an empty CSV file is handled gracefully."""
    response = client.post(
        "/award_from_csv",
        data={"csv-file": (io.BytesIO(b""), "test.csv")},
        content_type="multipart/form-data",
    )
    assert response.status_code == 302


def test_award_from_csv_malformed_line(client, dummy_badge):
    """Test that malformed lines are skipped without crashing."""
    csv_content = b"this-is-not-valid\ntest@example.com,test-badge\n"
    response = client.post(
        "/award_from_csv",
        data={"csv-file": (io.BytesIO(csv_content), "test.csv")},
        content_type="multipart/form-data",
    )
    assert response.status_code == 302


def test_award_from_csv_nonexistent_badge(client):
    """Test that nonexistent badge IDs are skipped gracefully."""
    csv_content = b"test@example.com,badge-that-does-not-exist\n"
    response = client.post(
        "/award_from_csv",
        data={"csv-file": (io.BytesIO(csv_content), "test.csv")},
        content_type="multipart/form-data",
    )
    assert response.status_code == 302
