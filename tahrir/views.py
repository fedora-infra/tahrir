
import transaction
import types

import tw2.core as twc

from mako.template import Template as t
from pyramid.view import (
    view_config,
    forbidden_view_config,
)

from pyramid.response import Response
from pyramid.httpexceptions import HTTPFound
from pyramid.security import (
    authenticated_userid,
    remember,
    forget,
)

import tahrir_api.model as m
import widgets


# TODO -- really wield tw2.sqla here
@view_config(route_name='admin', renderer='admin.mak')
def admin(request):
    logged_in = authenticated_userid(request)
    admins = [a.strip() for a in request.registry.settings['tahrir.admin'].split(',')]
    if logged_in not in admins:
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
        issuer_form=widgets.IssuerForm,
        badge_form=widgets.BadgeForm,
        assertion_form=widgets.AssertionForm,
        person_form=widgets.PersonForm,
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


@view_config(context=types.FunctionType)
def action(context, request):
    logged_in = authenticated_userid(request)

    if logged_in != request.registry.settings['tahrir.admin']:
        return HTTPFound(location='/')

    # Do the action
    context()

    return HTTPFound(location='/')


@view_config(context=unicode)
def html(context, request):
    return Response(context)


@view_config(context=m.Assertion, renderer='json')
def json(context, request):
    return context.__json__()

@view_config(context='pyramid.httpexceptions.HTTPNotFound', renderer='404.mak')
def _404(request):
    request.response.status = 404
    return dict(
            title=request.registry.settings['tahrir.title'],
            base_url=request.registry.settings['tahrir.base_url'],
            )

@view_config(context='pyramid.httpexceptions.HTTPServerError', renderer='500.mak')
def _500(request):
    request.response.status = 500
    return dict(
            title=request.registry.settings['tahrir.title'],
            base_url=request.registry.settings['tahrir.base_url'],
            )



@view_config(route_name='login', renderer='login.mak')
@forbidden_view_config(renderer='login.mak')
def login(request):
    login_url = request.resource_url(request.context, 'login')
    referrer = request.url
    if referrer == login_url:
        referrer = '/'  # never use the login form itself as came_from
    came_from = request.params.get('came_from', referrer)
    request.session['came_from'] = came_from
    return dict(
        openid_url=request.registry.settings['openid.provider'],
        title=request.registry.settings['tahrir.title'],
        url="http://" + request.registry.settings['tahrir.base_url'] + '/dologin.html',
        came_from=came_from,
        )


@view_config(route_name='logout')
def logout(request):
    headers = forget(request)
    return HTTPFound(location=request.resource_url(request.context),
                     headers=headers)

def openid_success(context, request, *args, **kwargs):
    identity = request.params['openid.identity']
    email = request.params['openid.sreg.email']
    if not identity.startswith(request.registry.settings['openid.provider']):
        request.session.flash(
        'Invalid OpenID provider. You can only use {0}.'.format(
            request.registry.settings['openid.provider']))
        return HTTPFound(location=request.application_url + '/login')
    username = identity.split("/")[-1]
    if m.Person.query.filter_by(email=email).count() == 0:
        new_user = m.Person(email=email)
        m.DBSession.add(new_user)
    headers = remember(request, email)
    came_from = request.session['came_from']
    del(request.session['came_from'])
    response = HTTPFound(location=came_from)
    response.headerlist.extend(headers)
    return response
