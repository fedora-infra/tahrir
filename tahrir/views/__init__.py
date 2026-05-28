import werkzeug.exceptions
from flask import Blueprint, Flask, jsonify
from flask.helpers import send_from_directory

blueprint = Blueprint("tahrir", __name__)


def page_not_found(e):
    return jsonify({"error": "Resource not found", "status": 404}), 404


def internal_server_error(e):
    return jsonify({"error": "Internal server error", "status": 500}), 500


def add_static_view(app: Flask, directory: str, prefix: str, endpoint: str):
    def _view(filename):
        max_age = app.get_send_file_max_age(filename)
        return send_from_directory(directory, filename, max_age=max_age)

    app.add_url_rule(f"{prefix}/<path:filename>", endpoint=endpoint, view_func=_view)


def add_frontend_view(app: Flask, directory: str):
    def _serve_frontend(path):
        try:
            return send_from_directory(directory, path)
        except werkzeug.exceptions.NotFound:
            return send_from_directory(directory, "index.html")

    app.add_url_rule("/<path:path>", endpoint="frontend_catchall", view_func=_serve_frontend)
