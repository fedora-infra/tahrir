from functools import wraps
from urllib.parse import quote_plus

from flask import abort, current_app, g, redirect, request, session, url_for
from flask_oidc.model import User as OIDCUser

from tahrir.defaults import TAHRIR_DISPLAY_TAGS

from .badge import badge_json_generator


class User(OIDCUser):
    def __init__(self, ext):
        super().__init__(ext)
        self._person = None
        self._awarded_assertions = None

    def reset_cache(self):
        self._person = None
        self._awarded_assertions = None

    def _has_token(self):
        return session.get("oidc_auth_token") is not None

    @property
    def logged_in(self):
        return self._has_token() and self.person is not None

    @property
    def email(self):
        if not self.logged_in:
            return None
        return f"{self.name}@{current_app.config['TAHRIR_EMAIL_DOMAIN']}"

    @property
    def person(self):
        if self.name is None:
            return None
        if self._person is None:
            self._person = g.tahrirdb.get_person(nickname=self.name)
        return self._person

    @property
    def awarded_assertions(self):
        if self.name is None:
            return []
        if self._awarded_assertions is None:
            self._awarded_assertions = get_awarded_assertions(self.name)
        return self._awarded_assertions

    @property
    def is_admin(self):
        return (
            len(set(self.groups).intersection(set(current_app.config["TAHRIR_ADMIN_GROUPS"]))) > 0
        )


def on_authorized(sender, **kwargs):
    nickname = g.oidc_user.name
    if current_app.config["TAHRIR_USE_OPENID_EMAIL"]:
        email = g.oidc_user.profile["email"]
        avatar = None
    else:
        email = f"{nickname}@{current_app.config['TAHRIR_EMAIL_DOMAIN']}"
        avatar = g.oidc_user.profile["email"]

    existing = g.tahrirdb.get_person(person_email=email)
    if not existing:
        # Keep adding underscores until we get a default nickname
        # that isn't already used.
        while g.tahrirdb.get_person(nickname=nickname):
            nickname += "_"
        g.tahrirdb.add_person(email=email, nickname=nickname, avatar=avatar)
        g.oidc_user.reset_cache()

    else:
        # User exists, update the avatar
        if existing._avatar != avatar:
            existing._avatar = avatar
            g.tahrirdb.session.commit()
            g.oidc_user.reset_cache()

    # Note that they have logged in if we are installed with a newer version of
    # the db API that supports this.
    if hasattr(g.tahrirdb, "note_login"):
        g.tahrirdb.note_login(person_email=email)


def get_person(id_or_nickname):
    """Attempt to get a user by their id or nickname, returning None if
    we fail."""
    if id_or_nickname is None:
        return None

    user = g.tahrirdb.get_person(nickname=id_or_nickname)

    if user:
        return user
    else:
        try:
            # We cast user_id to an integer so that Postgres doesn't
            # get upset about comparing what is potentially a string
            # to an integer column.
            return g.tahrirdb.get_person(id=int(id_or_nickname))
        except ValueError:
            return None


def get_awarded_assertions(username):
    if username is None:
        return []
    email = f"{username}@{current_app.config['TAHRIR_EMAIL_DOMAIN']}"
    assertions = g.tahrirdb.get_assertions_by_email(email)
    if assertions is False:
        # tahrir-api returns False when the user does not exist.
        assertions = []
    return assertions


def require_login(view_func):
    """
    Use this to decorate view functions that require a user to be logged
    in. If the user is not already logged in, they will be sent to the
    Provider to log in, after which they will be returned.

    .. versionadded:: 1.0
        This was :func:`check` before.
    """

    @wraps(view_func)
    def decorated(*args, **kwargs):
        if not g.oidc_user.logged_in:
            redirect_uri = "{login}?next={here}".format(
                login=url_for("oidc_auth.login"),
                here=quote_plus(request.url),
            )
            return redirect(redirect_uri)
        return view_func(*args, **kwargs)

    return decorated


def require_admin(view_func):
    """
    Use this to decorate view functions that require a user to be logged
    in. This assumes the user is already logged-in.

    .. versionadded:: 1.0
       This was :func:`check` before.
    """

    @wraps(view_func)
    def decorated(*args, **kwargs):
        if not g.oidc_user.is_admin:
            abort(403, "Unauthorized: admins only.")
        return view_func(*args, **kwargs)

    return decorated


def get_user_badge_info(user):
    """Returns a dictionary of the user badge information with serialized badges"""

    # Get user badges
    badges = [assertion.badge for assertion in user.assertions]

    # Get total number of unique badges in the system
    total_badges = g.tahrirdb.get_all_badges().count()

    # Get percentage of badges earned by user
    percent_earned = (float(len(badges)) / float(total_badges)) * 100 if total_badges > 0 else 0

    # Get rank of user
    rank = user.rank or 0

    # Get total number of users
    user_count = g.tahrirdb.get_all_persons().count()

    # Get users standing
    percentile = round((rank / user_count) * 100, 2) if user_count > 0 else 0

    # Get user assertions
    assertions = sorted(user.assertions, key=lambda item: item.issued_on, reverse=True)

    # Initialize empty list to store serailized badges
    serialized_badges = []

    # Set the classifications of the badges
    classified = {name: [] for name in TAHRIR_DISPLAY_TAGS}

    for indx, item in enumerate(assertions):
        badge = badge_json_generator(item.badge, withasserts=False)
        serialized_badges.append({**badge})
        for name in classified.keys():
            if name in item.badge.tags:
                classified[name].append(indx)

    return {
        "badges": serialized_badges,
        "classified": classified,
        "percentile": percentile,
        "percent_earned": round(percent_earned, 2),
        "rank": rank,
        "total_badges": total_badges,
    }
