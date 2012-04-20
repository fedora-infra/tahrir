from mako.template import Template as t
from pyramid.view import view_config

import model as m


@view_config(route_name='home', renderer='index.mak')
def index(request):
    return dict(
        issuers=m.Issuer.query.all(),
        title="Tahrir",  # TODO -- pull from config
    )


@view_config(context=m.Assertion, renderer='json')
def json(context, request):
    return context.__json__()
