# Copyright (c) 2026 Red Hat, Inc.

"""Test tahrir.views."""

import pytest
from flask import Flask

from tahrir.views import add_frontend_view


@pytest.fixture
def frontend_dir(tmp_path):
    (tmp_path / "index.html").write_text("<html>index</html>")
    return str(tmp_path)


@pytest.fixture
def app(frontend_dir):
    app = Flask(__name__)
    app.config["TESTING"] = True
    add_frontend_view(app, frontend_dir)
    return app


def test_serve_index_on_unknown_path(app):
    with app.test_client() as client:
        response = client.get("/some/spa/route")
    assert response.status_code == 200
    assert b"index" in response.data


def test_path_traversal_absolute(app):
    with app.test_client() as client:
        response = client.get("/etc/passwd")
    assert response.status_code == 200
    assert b"index" in response.data
