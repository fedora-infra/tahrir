import os
from logging.config import dictConfig

import flask_talisman
from flask import Flask
from flask_cors import CORS
from flask_healthz import healthz
from flask_oidc import OpenIDConnect
from flask_oidc.signals import after_authorize
from flask_wtf.csrf import CSRFProtect

from tahrir import l10n
from tahrir.admin import admin
from tahrir.cache import cache
from tahrir.cli import tahrir_cli
from tahrir.database import db
from tahrir.endpoints import blueprint as endpoint_bp
from tahrir.endpoints.admin import blueprint as admin_bp
from tahrir.utils import import_all
from tahrir.utils.user import on_authorized
from tahrir.views import add_static_view, internal_server_error, page_not_found
from tahrir.views import blueprint as root_bp


# Forms
csrf = CSRFProtect()

# Security
oidc = OpenIDConnect()
talisman = flask_talisman.Talisman()
cors = CORS(
    resources={
        r"/api/*": {"origins": "*"},
        r"/json/*": {"origins": "*"},
        r"/pngs/*": {"origins": "*"},
        r"/stls/*": {"origins": "*"},
    }
)


REQUIRED_CONFIG = [
    "TAHRIR_PNGS_PATH",
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
    # app.before_request(oidc._before_request)
    l10n.babel.init_app(app, locale_selector=l10n.pick_locale)
    app.before_request(l10n.store_locale)
    app.jinja_env.add_extension("jinja2.ext.i18n")
    admin.init_app(app)
    csrf.init_app(app)

    # Database
    db.init_app(app)

    # Cache
    cache.configure(**app.config["CACHE"])

    # Security
    cors.init_app(app)
    # talisman.init_app(
    #     app,
    #     force_https=app.config.get("SESSION_COOKIE_SECURE", True),
    #     session_cookie_secure=app.config.get("SESSION_COOKIE_SECURE", True),
    #     frame_options=flask_talisman.DENY,
    #     referrer_policy="same-origin",
    #     content_security_policy={
    #         "default-src": ["'self'", "apps.fedoraproject.org"],
    #         "script-src": [
    #             # https://csp.withgoogle.com/docs/strict-csp.html#example
    #             "'strict-dynamic'",
    #         ],
    #         # "img-src": ["'self'", "seccdn.libravatar.org"],
    #     },
    #     content_security_policy_nonce_in=["script-src"],
    # )

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

    # CLI
    app.cli.add_command(tahrir_cli)

    return app
