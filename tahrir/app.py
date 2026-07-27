import os
from logging.config import dictConfig

from flask import Flask
from flask_babel import Babel
from flask_cors import CORS
from flask_healthz import healthz
from flask_oidc import OpenIDConnect
from flask_oidc.signals import after_authorize
from flask_wtf.csrf import CSRFProtect

from tahrir.admin import admin
from tahrir.cache import cache
from tahrir.cli import tahrir_cli
from tahrir.database import db
from tahrir.endpoints import blueprint as endpoint_bp
from tahrir.endpoints.admin import blueprint as admin_bp
from tahrir.utils import import_all
from tahrir.utils.user import on_authorized
from tahrir.views import add_frontend_view, add_static_view, internal_server_error, page_not_found
from tahrir.views import blueprint as root_bp

# Forms
csrf = CSRFProtect()

# Security
oidc = OpenIDConnect()
cors = CORS(
    resources={
        r"/api/*": {"origins": "*", "allow_headers": ["Authorization", "Content-Type"]},
        r"/json/*": {"origins": "*"},
        r"/pngs/*": {"origins": "*"},
        r"/stls/*": {"origins": "*"},
    }
)


REQUIRED_CONFIG = [
    "TAHRIR_PNGS_PATH",
    "TAHRIR_OWNER_GROUPS",
    "TAHRIR_ADMIN_GROUPS",
    "TAHRIR_TITLE",
]


def create_app(config=None):
    """See https://flask.palletsprojects.com/en/1.1.x/patterns/appfactories/"""

    app = Flask(__name__)

    # Load default configuration
    app.config.from_object("tahrir.defaults")

    # Load the optional configuration file
    if "FLASK_CONFIG" in os.environ:
        app.config.from_envvar("FLASK_CONFIG")

    # Load the config passed as argument
    app.config.update(config or {})

    # Validate config
    for key in REQUIRED_CONFIG:
        if key not in app.config:
            raise ValueError(f"{key} required in settings.")

    if app.config.get("TEMPLATES_AUTO_RELOAD"):
        app.jinja_env.auto_reload = True

    # Logging
    if app.config.get("LOGGING"):
        dictConfig(app.config["LOGGING"])

    # Extensions
    oidc.init_app(app, prefix="/oidc")
    Babel(app)
    admin.init_app(app)
    csrf.init_app(app)

    # Database
    db.init_app(app)

    # Cache
    cache.configure(**app.config["CACHE"])

    # Security
    cors.init_app(app)

    # Authentication callback
    after_authorize.connect(on_authorized)

    # Register views
    import_all("tahrir.views")
    app.register_blueprint(root_bp)

    import_all("tahrir.endpoints")
    app.register_blueprint(endpoint_bp)

    import_all("tahrir.endpoints.admin")
    app.register_blueprint(admin_bp)

    app.register_blueprint(healthz, url_prefix="/healthz")
    # Error handlers
    app.register_error_handler(404, page_not_found)
    app.register_error_handler(500, internal_server_error)

    # Static files
    add_static_view(app, app.config["TAHRIR_PNGS_PATH"], prefix="/pngs", endpoint="pngs")
    if app.config.get("TAHRIR_STLS_PATH"):
        add_static_view(app, app.config["TAHRIR_STLS_PATH"], prefix="/stls", endpoint="stls")

    # Frontend SPA
    if frontend_path := app.config.get("TAHRIR_FRONTEND_PATH"):
        add_frontend_view(app, frontend_path)

    # CLI
    app.cli.add_command(tahrir_cli)

    return app
