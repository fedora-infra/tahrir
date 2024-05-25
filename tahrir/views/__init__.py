from flask import Blueprint, render_template


blueprint = Blueprint("tahrir", __name__)


def page_not_found(e):
    return render_template("404.html"), 404


def internal_server_error(e):
    return render_template("500.html"), 500
