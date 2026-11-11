# Copyright (c) 2026 Red Hat, Inc.

"""Test tahrir.views."""

import pytest
from flask import Flask

from tahrir.views import add_frontend_view


@pytest.fixture
def frontend_dir(tmp_path):
    frontend = tmp_path / "frontend"
    frontend.mkdir()
    (frontend / "index.html").write_text("<html>index</html>")
    (frontend / "styles.css").write_text("body { margin: 0; }")
    (tmp_path / "secret.txt").write_text("top-secret")
    return str(frontend)


@pytest.fixture
def app(frontend_dir):
    app = Flask(__name__)
    app.config["TESTING"] = True
    add_frontend_view(app, frontend_dir)
    return app


def test_serve_existing_static_file(app):
    with app.test_client() as client:
        response = client.get("/styles.css")
    assert response.status_code == 200
    assert b"margin" in response.data


def test_unknown_path_serves_index(app):
    with app.test_client() as client:
        response = client.get("/some/spa/route")
    assert response.status_code == 200
    assert b"index" in response.data


@pytest.mark.parametrize(
    "path",
    [
        "/etc/passwd",
        "/../../../etc/passwd",
        "/%2e%2e/%2e%2e/etc/passwd",
    ],
)
def test_path_traversal_does_not_escape_frontend(app, path):
    with app.test_client() as client:
        response = client.get(path)
    assert response.status_code == 200
    assert b"index" in response.data
    assert b"root:" not in response.data
    assert b"top-secret" not in response.data
