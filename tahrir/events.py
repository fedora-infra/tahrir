from pkg_resources import get_distribution
from pyramid.events import (
    BeforeRender,
    subscriber,
)
from pyramid.settings import asbool

import tahrir.views


@subscriber(BeforeRender)
def inject_globals(event):
    """Injects global variables into every template after the view
    is processed but before the template is rendered."""

    # request is available in every template, and we can just pull it
    # in like so...
    request = event["request"]

    settings = request.registry.settings

    # ... and then set a couple global variables that will be available
    # in every template, so we don't have to pass them through the
    # dict returned by the view every time!
    event["title"] = settings["tahrir.title"]
    event["base_url"] = settings["tahrir.base_url"]
    event["theme_name"] = settings.get("tahrir.theme_name", "tahrir")

    event["tahrir_version"] = get_distribution("tahrir").version
    event["tahrir_api_version"] = get_distribution("tahrir-api").version

    event["logged_in"] = request.authenticated_userid
    person = request.db.get_person(event["logged_in"])
    event["logged_in_person"] = person

    event["footer"] = tahrir.views.load_docs(request, "footer")

    event["twitter"] = asbool(settings.get("tahrir.social.twitter"))
    event["twitter_user_text"] = settings.get("tahrir.social.twitter_user_text")
    event["twitter_user_hash"] = settings.get("tahrir.social.twitter_user_hash")

    event["auth_principals"] = request.effective_principals
