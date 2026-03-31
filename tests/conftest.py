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
    return {
        "TESTING": True,
        "DEBUG": True,
        "WTF_CSRF_ENABLED": False,
        "SECRET_KEY": b"not-secret",
        "SESSION_COOKIE_SECURE": False,
        "SQLALCHEMY_DATABASE_URI": f"sqlite:///{db_path}",
        "TAHRIR_ADMIN_GROUPS": ["admin"],
        "OIDC_ENABLED": False,
        "OIDC_TESTING_PROFILE": {"nickname": "test-user", "groups": ["admin"]},
    }


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
def request_context(app):
    with app.test_request_context("/"):
        yield


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
