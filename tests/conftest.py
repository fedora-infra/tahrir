import os

import pytest
from tahrir_api.utils import get_db_manager_from_uri

from tahrir.app import create_app
from tahrir.cache import cache
from tahrir.database import db


@pytest.fixture
def app_config(tmpdir):
    db_path = os.path.join(tmpdir, "database.sqlite")
    return dict(
        TESTING=True,
        DEBUG=True,
        WTF_CSRF_ENABLED=False,
        # Session secret
        SECRET_KEY=b"not-secret",
        # We don't do https for testing
        SESSION_COOKIE_SECURE=False,
        SQLALCHEMY_DATABASE_URI=f"sqlite:///{db_path}",
        TAHRIR_ADMIN_GROUPS=["admin"],
        OIDC_ENABLED=False,
        OIDC_TESTING_PROFILE={"nickname": "test-user", "groups": ["admin"]},
    )


@pytest.fixture
def app(app_config):
    # Reset the dogpile cache singleton so it can be re-configured
    cache.__dict__.pop("backend", None)
    app = create_app(app_config)
    with app.app_context():
        db_manager = get_db_manager_from_uri(app.config["SQLALCHEMY_DATABASE_URI"])
        db_manager.create()
    yield app
    db.Session.close()


@pytest.fixture
def request_context(app):
    with app.test_request_context("/"):
        yield


@pytest.fixture
def client(app):
    with app.test_client() as client:
        with app.app_context():
            yield client


@pytest.fixture
def dummy_issuer(app):
    tahrir_db = db.get_db()
    return tahrir_db.add_issuer(
        origin="testing", name="test-issuer", org="testing", contact="testing"
    )
