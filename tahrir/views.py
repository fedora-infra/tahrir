import transaction
import types
import sqlalchemy as sa
import velruse
import json as _json
import StringIO
import qrcode as qrcode_module
from datetime import datetime

from mako.template import Template as t
from pyramid.view import (
    view_config,
    forbidden_view_config,
)

from pyramid.response import Response
from pyramid.httpexceptions import HTTPFound, HTTPGone, HTTPNotFound
from pyramid.security import (
    authenticated_userid,
    effective_principals,
    remember,
    forget,
)

from tahrir_api.dbapi import TahrirDatabase
import tahrir_api.model as m

from tahrir.utils import strip_tags
import widgets


@view_config(route_name='admin', renderer='admin.mak', permission='admin')
def admin(request):
    # TODO: Check if I even need this anymore... leaving for now.
    request.session['came_from'] = '/admin'

    if authenticated_userid(request):
        awarded_assertions = request.db.get_assertions_by_email(
                                 authenticated_userid(request))
    else:
        awarded_assertions = None

    return dict(
        auth_principals=effective_principals(request),
        awarded_assertions=awarded_assertions,
    )


@view_config(route_name='home', renderer='index.mak')
def index(request):
    if authenticated_userid(request):
        awarded_assertions = request.db.get_assertions_by_email(
                                 authenticated_userid(request))
    else:
        awarded_assertions = None
    # set came_from so we can get back home after openid auth.
    request.session['came_from'] = '/'

    persons_assertions = request.db.get_all_assertions().join(m.Person)
    from collections import defaultdict
    top_persons = defaultdict(int) # person: assertion count
    for item in persons_assertions:
        top_persons[item.person] += 1
        
    # Get latest awards.
    latest_awards=request.db.get_all_assertions().order_by(
                    sa.asc(m.Assertion.issued_on)).limit(10).all()

    # Get badge images and put them in a dict.
    badge_images = dict() # badge_id: image URL
    for item in latest_awards:
        badge_images[item.badge_id] = request.db.get_badge(
                                            item.badge_id).image

    return dict(
        auth_principals=effective_principals(request),
        latest_awards=latest_awards,
        newest_persons=request.db.get_all_persons().order_by(
                        sa.asc(m.Person.id)).limit(10).all(),
        top_persons=top_persons,
        badge_images=badge_images,
        awarded_assertions=awarded_assertions,
    )


@view_config(context=types.FunctionType)
def action(context, request):
    if 'group:admins' not in effective_principals(request):
        return HTTPFound(location='/')

    # Do the action
    context()

    return HTTPFound(location='/')


@view_config(context=m.Invitation, name='claim')
def invitation_claim(request):
    """ Action that awards a person a badge after scanning a qrcode. """

    if request.context.expires_on < datetime.now():
        return HTTPGone("That invitation is expired.")

    if not authenticated_userid(request):
        request.session['came_from'] = '/invitations/{}/claim'.format(
                request.context.id)
        return HTTPFound(location='/login')

    person = request.db.get_person_by_email(
                    authenticated_userid(request)).one()
    
    # Check to see if the user already has the badge.
    if request.context.badge_id == request.db.get_assertions_by_email(
                        authenticated_userid(request)).filter_by(
                        person_id=person.id,
                        badge_id=request.context.badge_id).one().badge_id:
        # TODO: Flash a message explaining that they already have the badge
        return HTTPFound(location='/')

    request.db.add_assertion(request.context.badge_id,
                     person.id,
                     datetime.now())

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
    badge_id = request.matchdict.get('id')
    badge = request.db.get_badge(badge_id)
    if authenticated_userid(request):
        awarded_assertions = request.db.get_assertions_by_email(
                                authenticated_userid(request))
    else:
        awarded_assertions = None
    if badge:
        return dict(
                badge=badge,
                auth_principals=effective_principals(request),
                awarded_assertions=awarded_assertions,
                )
    else:
        # TODO: Say that there was no badge found.
        return HTTPFound(location=request.route_url('home'))

@view_config(route_name='user', renderer='user.mak')
def user(request):
    """Render user info page."""

    # I am so sorry for these next three lines. See get_person_email()
    # in Tahrir API for a better explanation.
    user_id = request.matchdict.get('id')
    user_email = request.db.get_person_email(user_id)
    user = request.db.get_person(user_email)

    if not user:
        raise HTTPNotFound("No such user %r" % user_id)


    if authenticated_userid(request):
        awarded_assertions = request.db.get_assertions_by_email(
                                 authenticated_userid(request))
    else:
        awarded_assertions = None

    user_assertions = request.db.get_assertions_by_email(user_email)
    user_badges = [request.db.get_badge(x.badge_id) \
                    for x in user_assertions]

    if user:
        return dict(
                user=user,
                user_badges=user_badges,
                auth_principals=effective_principals(request),
                awarded_assertions=awarded_assertions,
                )
    else:
        # TODO: Say that there was no user found.
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
    return dict()

@view_config(context='pyramid.httpexceptions.HTTPServerError', renderer='500.mak')
def _500(request):
    request.response.status = 500
    return dict()


@view_config(route_name='login', renderer='login.mak')
@forbidden_view_config(renderer='login.mak')
def login(request):
    settings = request.registry.settings
    ident = "openid_identifier=" + settings.get('tahrir.openid_identifier')
    url = velruse.login_url(request, 'openid') + "?" + ident
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
    settings = request.registry.settings

    nickname = context.profile['preferredUsername']

    if context.profile['emails']:
        email = context.profile['emails'][0]
    else:
        ident = settings.get('tahrir.openid_identifier')
        domain = '.'.join(ident.split('.')[:-2])
        email = nickname + "@" + domain

    if not request.db.get_person(email):
        request.db.add_person(email=email, nickname=nickname)

    headers = remember(request, email)
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
