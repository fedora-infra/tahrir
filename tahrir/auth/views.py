"""Views related to authentication."""

import typing

from authlib.integrations.base_client import OAuthError
from pyramid.httpexceptions import HTTPFound, HTTPUnauthorized
from pyramid.security import forget

from .utils import get_and_store_user, get_final_redirect

if typing.TYPE_CHECKING:  # pragma: no cover
    import pyramid.request.Request  # noqa: 401
    import pyramid.response.Response  # noqa: 401


def logout(request: "pyramid.request.Request") -> HTTPFound:
    """
    Log out the user.

    Args:
        request: The current request, which is used to remove the user's
            authentication cookies.
    Returns:
        A 302 redirect to the home page.
    """
    headers = forget(request)
    return HTTPFound(location=request.route_url("home"), headers=headers)


def login_oidc(request: "pyramid.request.Request"):
    """Send the user to the OpenID Connect provider to log in.

    Args:
        request (pyramid.request.Request): The Pyramid request.

    Returns:
        pyramid.response.Response: A redirect to the OIDC provider's login frame.
    """
    provider = request.registry.oidc.create_client("fedora")
    redirect_uri = request.route_url("oidc_authorize")
    return provider.authorize_redirect(request, redirect_uri)


def authorize_oidc(request: "pyramid.request.Request"):
    """Verify the response from the OpenID Connect provider and log the user in.

    Args:
        request (pyramid.request.Request): The Pyramid request.

    Returns:
        pyramid.response.Response: A redirection to the previously visited page.
    """
    try:
        token = request.registry.oidc.fedora.authorize_access_token(request)
    except OAuthError as e:
        raise HTTPUnauthorized(f"Authentication failed: {e.description}") from e
    response = get_final_redirect(request)
    get_and_store_user(request, token["access_token"], response)
    return response
