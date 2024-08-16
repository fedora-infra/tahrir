from flask import Blueprint, Flask, render_template
from flask.helpers import send_from_directory


blueprint = Blueprint("tahrir", __name__)


def page_not_found(e):
    title = "Oops! The page you are looking for doesn't exist."
    message = (
        "It might have been removed or had its name changed. "
        "Please check the URL or return to the home page."
    )
    return (
        render_template("error.html", error_code=404, error_title=title, error_message=message),
        404,
    )


def internal_server_error(e):
    title = "Whoops! There's badness in the server internals."
    message = (
        "Please try refreshing the page or come back later. "
        "If the issue persists, please open an "
        '<a href="https://pagure.io/fedora-infrastructure/new_issue">'
        "Infrastructure ticket<a>."
    )
    return (
        render_template("error.html", error_code=500, error_title=title, error_message=message),
        500,
    )


def add_static_view(app: Flask, directory: str, prefix: str, endpoint: str):
    def _view(filename):
        max_age = app.get_send_file_max_age(filename)
        return send_from_directory(directory, filename, max_age=max_age)

    app.add_url_rule(f"{prefix}/<path:filename>", endpoint=endpoint, view_func=_view)
