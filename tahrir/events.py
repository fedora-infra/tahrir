from pyramid.events import (
    subscriber,
    BeforeRender,
)

from pyramid.security import (
    authenticated_userid,
)

import tw2.jquery


@subscriber(BeforeRender)
def inject_globals(event):
    """Injects global variables into every template after the view
    is processed but before the template is rendered."""

    # request is available in every template, and we can just pull it
    # in like so...
    request = event['request']

    # ... and then set a couple global variables that will be available
    # in every template, so we don't have to pass them through the
    # dict returned by the view every time!
    event['title'] = request.registry.settings['tahrir.title']
    event['base_url'] = request.registry.settings['tahrir.base_url']

    event['logged_in'] = authenticated_userid(request)
    person = request.db.get_person(event['logged_in'])
    event['logged_in_id'] = getattr(person, 'id', None)

    # Cause jquery.js to be injected into the page.
    tw2.jquery.jquery_js.display()
