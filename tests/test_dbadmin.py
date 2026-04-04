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


def test_dbadmin_badge(client, dummy_badge):
    """Test the badge page in the dbadmin UI"""
    response = client.get("/dbadmin/badge/")
    assert response.status_code == 200, response.data
    assert 'data-pk="test-badge"' in response.get_data(as_text=True)
