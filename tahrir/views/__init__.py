from flask import Blueprint, Flask, render_template
from flask.helpers import send_from_directory


blueprint = Blueprint("tahrir", __name__)


def page_not_found(e):
    return render_template("404.html"), 404


def internal_server_error(e):
    return render_template("500.html"), 500


def add_static_view(app: Flask, directory: str, prefix: str, endpoint: str):
    def _view(filename):
        max_age = app.get_send_file_max_age(filename)
        return send_from_directory(directory, filename, max_age=max_age)

    app.add_url_rule(f"{prefix}/<path:filename>", endpoint=endpoint, view_func=_view)
