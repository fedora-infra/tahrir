from pyramid.events import (
    subscriber,
    BeforeRender,
)

from pyramid.security import (
    authenticated_userid,
    effective_principals,
)

from pyramid.settings import asbool

import tw2.jquery

import tahrir.views

from pkg_resources import get_distribution


@subscriber(BeforeRender)
def inject_globals(event):
    """Injects global variables into every template after the view
    is processed but before the template is rendered."""

    # request is available in every template, and we can just pull it
    # in like so...
    request = event['request']

    settings = request.registry.settings

    # ... and then set a couple global variables that will be available
    # in every template, so we don't have to pass them through the
    # dict returned by the view every time!
    event['title'] = settings['tahrir.title']
    event['base_url'] = settings['tahrir.base_url']
    event['theme_name'] = settings.get('tahrir.theme_name', 'tahrir')

    event['tahrir_version'] = get_distribution('tahrir').version
    event['tahrir_api_version'] = get_distribution('tahrir-api').version

    event['logged_in'] = authenticated_userid(request)
    person = request.db.get_person(event['logged_in'])
    event['logged_in_person'] = person

    event['footer'] = tahrir.views.load_docs(request, 'footer')

    event['twitter'] = asbool(settings.get('tahrir.social.twitter'))
    event['twitter_user_text'] = settings.get(
        'tahrir.social.twitter_user_text')
    event['twitter_user_hash'] = settings.get(
        'tahrir.social.twitter_user_hash')
    event['gplus'] = asbool(settings.get('tahrir.social.gplus'))

    event['auth_principals'] = effective_principals(request)

    # Cause jquery.js to be injected into the page.
    tw2.jquery.jquery_js.display()
