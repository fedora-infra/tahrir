
import transaction
import types
import velruse
import json as _json
import StringIO
import qrcode as qrcode_module
from datetime import datetime

import tw2.core as twc

from mako.template import Template as t
from pyramid.view import (
    view_config,
    forbidden_view_config,
)

from pyramid.response import Response
from pyramid.httpexceptions import HTTPFound, HTTPGone
from pyramid.security import (
    authenticated_userid,
    remember,
    forget,
)

from tahrir.utils import strip_tags
import tahrir_api.model as m
import widgets


# TODO -- this should be in some lib, not "views"
# TODO -- even better, it should be using pyramid's __acl__ machinery.
def is_admin(request, user):
    admins = map(
        str.strip,
        request.registry.settings['tahrir.admin'].split(','),
    )
    return user in admins



# TODO -- really wield tw2.sqla here
@view_config(route_name='admin', renderer='admin.mak')
def admin(request):
    logged_in = authenticated_userid(request)

    if not is_admin(request, logged_in):
        # TODO: It would be good to set came_from in the login
        # processing view, but due to how redirection is structured,
        # it will be a bit difficult to determine the _actual_
        # last real page the user came from, so we will just set
        # came_from here for now.
        request.session['came_from'] = '/admin'
        return HTTPFound(location='/login')

    is_awarded = lambda a: logged_in and a.person.email == logged_in
    awarded_assertions = filter(is_awarded, m.Assertion.query.all())

    name_lookup = {
        'issuerform': widgets.IssuerForm,
        'badgeform': widgets.BadgeForm,
        'invitationform': widgets.InvitationForm,
        'assertionform': widgets.AssertionForm,
        'personform': widgets.PersonForm,
    }

    for key in name_lookup:
        if any([k.startswith(key) for k in request.params]):
            w = name_lookup[key]

            try:
                params = strip_tags(request.params)
                data = w.validate(params)
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
        invitation_form=widgets.InvitationForm,
    )


@view_config(route_name='home', renderer='index.mak')
def index(request):
    logged_in = authenticated_userid(request)
    is_awarded = lambda a: logged_in and a.person.email == logged_in
    awarded_assertions = filter(is_awarded, m.Assertion.query.all())
    # set came_from so we can get back home after openid auth.
    request.session['came_from'] = '/'
    return dict(
        is_admin=is_admin(request, logged_in),
        issuers=m.Issuer.query.all(),
        awarded_assertions=awarded_assertions,
        base_url=request.registry.settings['tahrir.base_url'],
        logged_in=logged_in,
        title=request.registry.settings['tahrir.title'],
    )


@view_config(context=types.FunctionType)
def action(context, request):
    logged_in = authenticated_userid(request)

    if not is_admin(request, logged_in):
        return HTTPFound(location='/')

    # Do the action
    context()

    return HTTPFound(location='/')


@view_config(context=m.Invitation, name='claim')
def invitation_claim(request):
    """ Action that awards a person a badge after scanning a qrcode. """

    if request.context.expires_on < datetime.now():
        return HTTPGone("That invitation is expired.")

    logged_in = authenticated_userid(request)
    person = m.Person.query.filter_by(email=logged_in).one()
    
    request.session['came_from'] = '/claim'

    # TODO -- check to see if they already have this badge

    assertion = m.Assertion(
        badge_id=request.context.badge_id,
        person_id=person.id,
        issued_on=datetime.now(),
    )
    m.DBSession.add(assertion)

    # TODO -- return them to a page that auto-exports their badges.

    return HTTPFound(location='/')

@view_config(context=m.Invitation, name='qrcode')
def invitation_qrcode(request):
    """ Returns a raw dummy qrcode through to the user. """

    if request.context.expires_on < datetime.now():
        return HTTPGone("That invitation is expired.")

    target = request.resource_url(request.context, 'claim')
    img = qrcode_module.make(target)
    stringstream = StringIO.StringIO()
    img.save(stringstream)
    return Response(
        body=stringstream.getvalue(),
        content_type='image/png',
    )


@view_config(route_name='badge', renderer='badge.mak')
def badge(request):
    """Render badge info page."""
    logged_in = authenticated_userid(request)
    badge_id = request.matchdict.get('id')
    badge_query = m.Badge.query.filter_by(id=badge_id)
    is_awarded = lambda a: logged_in and a.person.email == logged_in
    awarded_assertions = filter(is_awarded, m.Assertion.query.all())
    if badge_query.count() > 0:
        badge = badge_query[0]
        return dict(
                badge=badge,
                title=request.registry.settings['tahrir.title'] + " | " + badge.name + " badge",
                logged_in=logged_in,
                is_admin=is_admin(request, logged_in),
                awarded_assertions=awarded_assertions,
                )
    else:
        return HTTPFound(location=request.route_url('home'))

@view_config(route_name='user', renderer='user.mak')
def user(request):
    """Render user info page."""
    logged_in = authenticated_userid(request)
    user_id = request.matchdict.get('id')
    user_query = m.Person.query.filter_by(id=user_id)
    is_awarded = lambda a: logged_in and a.person.email == logged_in
    awarded_assertions = filter(is_awarded, m.Assertion.query.all())
    if user_query.count() > 0:
        user = user_query[0]
        return dict(
                user=user,
                title=request.registry.settings['tahrir.title'] + " | " + user.email + "'s profile",
                logged_in=logged_in,
                is_admin=is_admin(request, logged_in),
                awarded_assertions=awarded_assertions,
                )
    else:
        return HTTPFound(location=request.route_url('home'))


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
    identifier = "openid_identifier=https://id.fedoraproject.org"
    url = velruse.login_url(request, 'openid') + "?" + identifier
    """
    login_url = request.resource_url(request.context, 'login')
    referrer = request.url
    if referrer is login_url:
        referrer = '/' # never use login form as came_from
    came_from = request.params.get('came_from', referrer)
    request.session['came_from'] = came_from
    """
    return HTTPFound(location=url)


@view_config(context='velruse.AuthenticationComplete')
def login_complete_view(request):
    context = request.context
    if context.profile['emails']:
        email = context.profile['emails'][0]
    else:
        email = context.profile['preferredUsername'] + "@fedoraproject.org"

    if m.Person.query.filter_by(email=email).count() == 0:
        new_user = m.Person(email=email)
        m.DBSession.add(new_user)

    headers = remember(request, email)
    # TODO -- don't hardcode the '/'
    response = HTTPFound(location=request.session['came_from'])
    response.headerlist.extend(headers)
    return response


@view_config(context='velruse.AuthenticationDenied', renderer='json')
def login_denied_view(request):
    # TODO -- this can be made fancier, yes?
    return {'result': 'denied'}


@view_config(route_name='logout')
def logout(request):
    headers = forget(request)
    return HTTPFound(location=request.resource_url(request.context),
                     headers=headers)
