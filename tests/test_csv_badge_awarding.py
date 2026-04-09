"""Test CSV badge awarding endpoint by direct function call with app context."""

from unittest.mock import MagicMock, patch

import pytest
from flask import Flask


@pytest.fixture
def app():
    """Minimal Flask app to provide context for jsonify."""
    return Flask(__name__)


def make_mock_db(badge_exists=True, person_exists=True, assertion_exists=False):
    db = MagicMock(unsafe=True)
    db.badge_exists.return_value = badge_exists
    db.person_exists.return_value = person_exists
    db.assertion_exists.return_value = assertion_exists
    return db


def run_endpoint(app, csv_content, db=None):
    """Call award_badges_from_csv with mocks and app context."""

    mock_file = MagicMock()
    mock_file.filename = "test.csv"
    if csv_content is None:
        mock_files = {}
    else:
        mock_file.read.return_value = csv_content.encode("utf-8")
        mock_files = {"csv-file": mock_file}

    mock_request = MagicMock()
    mock_request.files = mock_files

    mock_g = MagicMock(unsafe=True)
    mock_g.tahrirdb = db or make_mock_db()

    # Patch where the decorators are defined to keep them from running
    with (
        patch("tahrir.app.oidc.require_login", lambda f: f),
        patch("tahrir.utils.user.require_admin", lambda f: f),
        patch("tahrir.endpoints.admin.badges.request", mock_request),
        patch("tahrir.endpoints.admin.badges.g", mock_g),
        app.app_context(),
    ):
        from tahrir.endpoints.admin.badges import award_badges_from_csv

        return award_badges_from_csv()


def test_csv_no_file(app):
    from werkzeug.exceptions import BadRequest

    with pytest.raises(BadRequest):
        run_endpoint(app, None)


def test_csv_empty_file(app):
    from werkzeug.exceptions import BadRequest

    with pytest.raises(BadRequest):
        run_endpoint(app, "")


def test_csv_malformed_lines(app):
    response, status = run_endpoint(app, "notavalidline\n")
    assert status == 400
    assert len(response.get_json()["malformed_lines"]) > 0


def test_csv_invalid_email(app):
    response, status = run_endpoint(app, "invalid-email,some-badge\n")
    assert status == 400
    assert any("invalid email" in line for line in response.get_json()["malformed_lines"])


def test_csv_badge_not_found(app):
    db = make_mock_db(badge_exists=False)
    response, status = run_endpoint(app, "test@example.com,nonexistent-badge\n", db)
    assert status == 400
    assert "nonexistent-badge" in response.get_json()["not_found_badges"]


def test_csv_successful_award(app):
    db = make_mock_db()
    response, status = run_endpoint(app, "test@example.com,some-badge\n", db)
    assert status == 200
    assert response.get_json()["successful_awards"] == 1


def test_csv_already_awarded(app):
    db = make_mock_db(assertion_exists=True)
    response, status = run_endpoint(app, "test@example.com,some-badge\n", db)
    assert status == 400
    assert len(response.get_json()["already_awarded"]) == 1


def test_csv_multiple_badges_same_user(app):
    db = make_mock_db()
    db.assertion_exists.side_effect = [False, False]

    csv_content = "test@example.com,badge-1\ntest@example.com,badge-2"
    response, status = run_endpoint(app, csv_content, db)

    assert status == 200
    assert response.get_json()["successful_awards"] == 2
