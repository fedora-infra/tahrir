
import transaction

import tw2.core as twc

from mako.template import Template as t
from pyramid.view import (
    view_config,
    forbidden_view_config,
)

from pyramid.httpexceptions import HTTPFound

from pyramid.security import (
    authenticated_userid,
    remember,
    forget,
)

import model as m
import widgets


# TODO -- really wield tw2.sqla here
@view_config(route_name='admin', renderer='admin.mak')
def admin(request):
    logged_in = authenticated_userid(request)

    if logged_in != request.registry.settings['tahrir.admin']:
        return HTTPFound(location='/')

    is_awarded = lambda a: logged_in and a.person.email == logged_in
    awarded_assertions = filter(is_awarded, m.Assertion.query.all())


    name_lookup = {
        'issuerform': widgets.IssuerForm,
        'badgeform': widgets.BadgeForm,
        'assertionform': widgets.AssertionForm,
        'personform': widgets.PersonForm,
    }

    for key in name_lookup:
        if any([k.startswith(key) for k in request.params]):
            w = name_lookup[key]

            try:
                data = w.validate(request.params)
                w.validated_request(request, data,
                                    protect_prm_tamp=False)
                return HTTPFound(location='/admin')
            except twc.ValidationError as e:
                print e.widget

    return dict(
        is_admin=True,
        logged_in=logged_in,
        awarded_assertions=awarded_assertions,
        base_url=request.registry.settings['tahrir.base_url'],
        title=request.registry.settings['tahrir.title'],
        issuer_form = widgets.IssuerForm,
        badge_form = widgets.BadgeForm,
        assertion_form = widgets.AssertionForm,
        person_form = widgets.PersonForm,
    )


@view_config(route_name='home', renderer='index.mak')
def index(request):
    logged_in = authenticated_userid(request)
    is_admin = logged_in == request.registry.settings['tahrir.admin']
    is_awarded = lambda a: logged_in and a.person.email == logged_in
    awarded_assertions = filter(is_awarded, m.Assertion.query.all())
    return dict(
        is_admin=is_admin,
        issuers=m.Issuer.query.all(),
        awarded_assertions=awarded_assertions,
        base_url=request.registry.settings['tahrir.base_url'],
        logged_in=logged_in,
        title=request.registry.settings['tahrir.title'],
    )


@view_config(context=m.Assertion, renderer='json')
def json(context, request):
    return context.__json__()


@view_config(route_name='login', renderer='login.mak')
@forbidden_view_config(renderer='login.mak')
def login(request):
    login_url = request.resource_url(request.context, 'login')
    referrer = request.url
    if referrer == login_url:
        referrer = '/' # never use the login form itself as came_from
    came_from = request.params.get('came_from', referrer)
    message = ''
    email = ''
    if 'form.submitted' in request.params:
        email = request.params['email']
        if m.Person.query.filter_by(email=email).count() == 0:
            new_user = m.Person(email=email)
            m.DBSession.add(new_user)

        # NOTE -- there is no way to fail login here :D
        # TODO -- validate the email address
        if True:
            headers = remember(request, email)
            return HTTPFound(location = came_from,
                             headers = headers)
        message = 'Failed login'

    return dict(
        title=request.registry.settings['tahrir.title'],
        message = message,
        url = request.application_url + '/login',
        came_from = came_from,
        email = email,
        )


@view_config(route_name='logout')
def logout(request):
    headers = forget(request)
    return HTTPFound(location = request.resource_url(request.context),
                     headers = headers)

