"""This module sets up OpenID Connect authentication"""

from authlib import __version__ as authlib_version
from packaging.version import parse as parse_version

from .constants import SCOPES
from .fedora import FedoraApp


if parse_version(authlib_version) >= parse_version("1.0.0"):
    from .oauth_1 import OAuth
else:
    from .oauth_015 import OAuth


def includeme(config):
    """Set up the authentication."""
    oauth = OAuth()
    oauth.register(
        "fedora",
        client_kwargs={
            'scope': SCOPES,
            'token_endpoint_auth_method': 'client_secret_post',
        },
        client_cls=FedoraApp,
    )
    config.registry.oidc = oauth

    config.add_route('logout', '/logout')
    config.add_view('tahrir.auth.views.logout', route_name='logout')
    config.add_route('login', '/login')
    config.add_view('tahrir.auth.views.login_oidc', route_name='login')
    config.add_route('oidc_authorize', '/oidc/authorize')
    config.add_view('tahrir.auth.views.authorize_oidc', route_name='oidc_authorize')

