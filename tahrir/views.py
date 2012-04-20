from mako.template import Template as t
from pyramid.view import view_config

import os;
SEP = os.path.sep

import model as m

@view_config(route_name='home', renderer='index.mak')
def index(request):
    return dict(
        issuers=m.Issuer.query.all(),
        title="Tahrir",  # TODO -- pull from config
    )

#http://stackoverflow.com/questions/4633320/is-there-a-better-way-to-switch-between-html-and-json-output-in-pyramid
#@view_config(context=m.DeclarativeBase, name='json', xhr=True)
#def json(request):
#    return request.context.__json__()
