"""Some authentication-related utilities."""

import typing

from authlib.oauth2.rfc6750 import InvalidTokenError
from pyramid.httpexceptions import HTTPFound
from pyramid.security import remember
from pyramid.settings import asbool

if typing.TYPE_CHECKING:  # pragma: no cover
    import pyramid.request.Request  # noqa: 401
    import pyramid.response.Response  # noqa: 401


def get_and_store_user(request, access_token, response):
    settings = request.registry.settings
    userinfo = request.registry.oidc.fedora.userinfo(token={"access_token": access_token})
    if "error" in userinfo:
        raise InvalidTokenError(description=userinfo["error_description"])

    nickname = userinfo["nickname"]
    if asbool(settings.get("tahrir.use_openid_email")):
        email = userinfo["email"]
        avatar = None
    else:
        email = nickname + settings.get("tahrir.email_domain")
        avatar = userinfo["email"]

    # Keep adding underscores until we get a default nickname
    # that isn't already used.
    while request.db.get_person(nickname=nickname):
        nickname += "_"

    existing = request.db.get_person(person_email=email)
    if not existing:
        request.db.add_person(email=email, nickname=nickname, avatar=avatar)
    elif existing._avatar != avatar:
        existing._avatar = avatar
        request.db.session.commit()

    # Note that they have logged in if we are installed with a newer version of
    # the db API that supports this.
    if hasattr(request.db, "note_login"):
        request.db.note_login(person_email=email)

    headers = remember(request, email)
    # response = HTTPFound(location=request.session.get('came_from', '/'))
    response.headerlist.extend(headers)
    return response


def get_final_redirect(request: "pyramid.request.Request"):
    """Get the URL that the user should be redirected to after logging in.

    Args:
        request (pyramid.request.Request): the current request.

    Returns:
        HTTPFound: An HTTP 302 response redirecting to the right URL.
    """
    came_from = request.session.get("came_from", request.route_path("home"))
    request.session.pop("came_from", None)

    # Mitigate "Covert Redirect"
    if not came_from.startswith(request.host_url):
        came_from = request.route_path("home")
    # Don't redirect endlessly to the login view
    if came_from.startswith(request.route_url("login")):
        came_from = request.route_path("home")

    return HTTPFound(location=came_from)
