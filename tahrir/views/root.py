from flask import current_app
from flask.helpers import send_from_directory

from . import blueprint as bp

# These route stubs exist so that url_for() references in RSS feeds
# and other kept views can build valid URLs. They also serve the React
# frontend's index.html for browser navigation.


def _serve_index():
    return send_from_directory(current_app.config["TAHRIR_FRONTEND_PATH"], "index.html")


@bp.route("/")
def home():
    return _serve_index()


@bp.route("/user/<user_id>")
def user(user_id):
    return _serve_index()


@bp.route("/badge/<badge_id>")
def badge(badge_id):
    return _serve_index()


@bp.route("/report/<int:year>/<int:month>")
def report_year_month(year, month):
    return _serve_index()
