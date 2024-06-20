# This file contains the default configuration values

import os


BASE_PATH = os.path.dirname(os.path.abspath(__file__))


TEMPLATES_AUTO_RELOAD = False
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = True

SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_DATABASE_URI = "sqlite:///../tahrir.db"

HEALTHZ = {
    "live": "tahrir.utils.healthz.liveness",
    "ready": "tahrir.utils.healthz.readiness",
}

OIDC_CLIENT_SECRETS = os.path.join(BASE_PATH, "..", "client_secrets.json")
# OIDC_SERVER_METADATA_URL = "https://id.fedoraproject.org/openidc/.well-known/openid-configuration"
OIDC_SCOPES = " ".join(
    [
        "openid",
        "email",
        "profile",
        "https://id.fedoraproject.org/scope/agreements",
        "https://id.fedoraproject.org/scope/groups",
    ]
)
# OIDC_CLIENT_ID = "tahrir"
# OIDC_CLIENT_SECRET = ""
OIDC_USER_CLASS = "tahrir.utils.user:User"

TAHRIR_ADMIN_GROUPS = ["sysadmin-main"]
TAHRIR_TITLE = "Fedora Badges"
_badges_path = os.path.join(BASE_PATH, "..", "fedora-badges")
TAHRIR_PNGS_PATH = os.path.join(_badges_path, "pngs")
TAHRIR_STLS_PATH = os.path.join(_badges_path, "stls")
TAHRIR_DEFAULT_ISSUER = "fedora-project"
TAHRIR_DEFAULT_AVATAR = "retro"
TAHRIR_OPENBADGES_MODAL = True
TAHRIR_DISPLAY_TAGS = ["content", "development", "community", "quality", "event", "miscellaneous"]
TAHRIR_SITEDOCS_SUBDIR = "sitedocs"
TAHRIR_USE_FEDMSG = False
TAHRIR_SOCIAL_TWITTER = True
TAHRIR_SOCIAL_TWITTER_USER_TEXT = "Check out all these #fedorabadges :trophy:"
TAHRIR_SOCIAL_TWITTER_USER_HASH = "#fedora"

# If this is true, we'll store the email from the user's FAS account, if
# not, then we'll use their FAS_USERNAME@fedoraproject.org.  For Fedora
# Infrastructure we want this to be false due to some inconsistencies between
# the fedbadges backend awarder and the tahrir frontend.  Other deployments
# may set this to true with no problem.
TAHRIR_USE_OPENID_EMAIL = False
TAHRIR_EMAIL_DOMAIN = "example.com"
TAHRIR_FAS_URL = "https://accounts.fedoraproject.org"

# Cache
CACHE = {
    "backend": "dogpile.cache.null",
    "expiration_time": 10000,
    # "arguments": {
    #     "filename": "./cache.dbm",
    # },
}

FLASK_ADMIN_FLUID_LAYOUT = True
