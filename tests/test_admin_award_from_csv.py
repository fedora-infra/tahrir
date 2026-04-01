import io
import os
from uuid import uuid4

import pytest
from tahrir_api.utils import get_db_manager_from_uri

from tahrir.app import create_app
from tahrir.database import db


@pytest.fixture(scope="session")
def app_config(tmp_path_factory):
    tmpdir = tmp_path_factory.mktemp("db")
    db_path = os.path.join(tmpdir, "database.sqlite")
    return dict(
        TESTING=True,
        DEBUG=True,
        WTF_CSRF_ENABLED=False,
        SECRET_KEY=b"not-secret",
        SESSION_COOKIE_SECURE=False,
        SQLALCHEMY_DATABASE_URI=f"sqlite:///{db_path}",
        TAHRIR_ADMIN_GROUPS=["admin"],
        OIDC_ENABLED=False,
        OIDC_TESTING_PROFILE={"nickname": "test-user", "groups": ["admin"]},
    )


@pytest.fixture(scope="session")
def app(app_config):
    previous_flask_config = os.environ.pop("FLASK_CONFIG", None)
    app = create_app(app_config)
    with app.app_context():
        db_manager = get_db_manager_from_uri(app.config["SQLALCHEMY_DATABASE_URI"])
        db_manager.create()
    yield app
    db.Session.close()
    if previous_flask_config is not None:
        os.environ["FLASK_CONFIG"] = previous_flask_config


@pytest.fixture
def client(app):
    with app.test_client() as test_client:
        with app.app_context():
            yield test_client


@pytest.fixture
def dummy_issuer(app):
    tahrir_db = db.get_db()
    unique = str(uuid4())[:8]
    return tahrir_db.add_issuer(
        origin=f"testing-{unique}",
        name=f"test-issuer-{unique}",
        org="testing",
        contact="testing",
    )


def _upload_csv(client, payload: bytes, filename: str = "awards.csv"):
    return client.post(
        "/award_from_csv",
        data={"csv-file": (io.BytesIO(payload), filename)},
        content_type="multipart/form-data",
        follow_redirects=True,
    )


def test_award_from_csv_rejects_non_csv_extension(client):
    response = _upload_csv(client, b"user@example.com,test-badge\n", filename="awards.txt")

    assert response.status_code == 200
    assert "Invalid file type. Please upload a .csv file." in response.get_data(as_text=True)


def test_award_from_csv_rejects_invalid_encoding(client):
    response = _upload_csv(client, b"\xff\xfe\x00\x00", filename="awards.csv")

    assert response.status_code == 200
    assert "Invalid file encoding. Please upload a UTF-8 CSV file." in response.get_data(
        as_text=True
    )


def test_award_from_csv_awards_and_skips_invalid_rows(app, client, dummy_issuer):
    tahrir_db = db.get_db()
    badge_id = tahrir_db.add_badge(
        name="Test Badge",
        image="dummy-image",
        desc="dummy-desc",
        criteria="dummy-criteria",
        issuer_id=dummy_issuer,
    )

    csv_payload = (
        b"email,badge_id\n"
        + f"user1@example.com,{badge_id}\n".encode()
        + f"{badge_id},user2@example.com\n".encode()
        + f"user1@example.com,{badge_id}\n".encode()
        + b"bad-row-without-comma\n"
        + b"no-at-sign,badge-id\n"
        + b"user3@example.com,missing-badge\n"
    )

    response = _upload_csv(client, csv_payload)
    response_text = response.get_data(as_text=True)

    assert response.status_code == 200
    assert (
        "CSV import complete: 2 awarded, 0 already existed, 1 invalid badge rows, 2 invalid rows."
        in response_text
    )

    assert tahrir_db.assertion_exists(badge_id, "user1@example.com")
    assert tahrir_db.assertion_exists(badge_id, "user2@example.com")
    assert not tahrir_db.assertion_exists("missing-badge", "user3@example.com")
