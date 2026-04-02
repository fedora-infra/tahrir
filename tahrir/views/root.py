from . import blueprint as bp


# These route stubs exist so that url_for() references in RSS feeds
# and other kept views can build valid URLs. The actual pages are
# served by the React frontend.


@bp.route("/")
def home():
    return "", 204


@bp.route("/user/<user_id>")
def user(user_id):
    return "", 204


@bp.route("/badge/<badge_id>")
def badge(badge_id):
    return "", 204


@bp.route("/report/<int:year>/<int:month>")
def report_year_month(year, month):
    return "", 204
