import random
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

from tahrir.utils import strip_tags, generate_badge_yaml
import widgets


@view_config(route_name='admin', renderer='admin.mak', permission='admin')
def admin(request):
    # TODO: Check if I even need this anymore... leaving for now.
    request.session['came_from'] = request.route_url('admin')

    if authenticated_userid(request):
        awarded_assertions = request.db.get_assertions_by_email(
                                 authenticated_userid(request))
    else:
        awarded_assertions = None

    # Handle any admin actions. These are done through POSTS via the
    # HTML forms on the admin panel.
    if request.POST:
        if request.POST.get('add-person'):
            # Email is a required field on the HTML form.
            # Add a Badge to the DB.
            request.db.add_person(request.POST.get('person-email'),
                                  nickname=request.POST.get(
                                            'person-nickname'),
                                  website=request.POST.get(
                                            'person-website'),
                                  bio=request.POST.get(
                                            'person-bio'))
        elif request.POST.get('add-badge'):
            # Add a Badge to the DB.
            request.db.add_badge(request.POST.get('badge-name'),
                                 request.POST.get('badge-image'),
                                 request.POST.get('badge-description'),
                                 request.POST.get('badge-criteria'),
                                 request.POST.get('badge-issuer'),
                                 request.POST.get('badge-tags'))
        elif request.POST.get('add-invitation'):
            # Add an Invitation to the DB.
            try:
                created_on = datetime.strptime(
                                request.POST.get('invitation-created'),
                                '%Y-%m-%d %H:%M')
            except ValueError:
                created_on = None # Will default to datetime.now()

            try:
                expires_on = datetime.strptime(
                                request.POST.get('invitation-expires'),
                                '%Y-%m-%d %H:%M')
            except ValueError:
                expires_on = None # Will default to datettime.now()
            request.db.add_invitation(
                    request.POST.get('invitation-badge-id'),
                    created_on=request.POST.get('invitation-created'),
                    expires_on=request.POST.get('invitation-expires'),
                    created_by=request.POST.get('invitation-issuer-id'))
        elif request.POST.get('add-issuer'):
            # Add an Issuer to the DB.
            request.db.add_issuer(
                    request.POST.get('issuer-origin'),
                    request.POST.get('issuer-name'),
                    request.POST.get('issuer-org'),
                    request.POST.get('issuer-contact'))
        elif request.POST.get('add-assertion'):
            # Add an Assertion to the DB.
            try:
                issued_on = datetime.strptime(
                                request.POST.get('assertion-issued-on'),
                                '%Y-%m-%d %H:%M')
            except ValueError:
                issued_on = None # Will default to datetime.now()
            request.db.add_assertion(
                    request.POST.get('assertion-badge-id'),
                    request.POST.get('assertion-person-email'),
                    issued_on)

    return dict(
        auth_principals=effective_principals(request),
        awarded_assertions=awarded_assertions,
    )


@view_config(route_name='home', renderer='index.mak')
def index(request):
    n = 5

    if authenticated_userid(request):
        awarded_assertions = request.db.get_assertions_by_email(
                                 authenticated_userid(request))
    else:
        awarded_assertions = None
    # set came_from so we can get back home after openid auth.
    request.session['came_from'] = request.route_url('home')

    persons_assertions = request.db.get_all_assertions().join(m.Person)
    from collections import defaultdict
    top_persons = defaultdict(int) # person: assertion count
    for item in persons_assertions:
        top_persons[item.person] += 1
    
    top_persons_sorted = sorted(sorted(top_persons,
                                key=lambda person: person.id),
                                key=top_persons.get,
                                reverse=True)
        
    # Get latest awards.
    latest_awards=request.db.get_all_assertions().order_by(
                    sa.desc(m.Assertion.issued_on)).limit(n - 1).all()

    return dict(
        auth_principals=effective_principals(request),
        latest_awards=latest_awards,
        newest_persons=request.db.get_all_persons().order_by(
                        sa.desc(m.Person.created_on)).limit(n).all(),
        top_persons=top_persons,
        top_persons_sorted=top_persons_sorted,
        awarded_assertions=awarded_assertions,
    )


@view_config(context=types.FunctionType, permission='admin')
def action(context, request):

    # Do the action
    context()

    return HTTPFound(location=request.route_url('home'))


@view_config(context=m.Invitation, name='claim')
def invitation_claim(request):
    """ Action that awards a person a badge after scanning a qrcode. """

    if request.context.expires_on < datetime.now():
        return HTTPGone("That invitation is expired.")

    if not authenticated_userid(request):
        request.session['came_from'] = request.resource_url(request.context,
                                                            request.context.id,
                                                            'claim')
        return HTTPFound(location=request.route_url('login'))

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
    return HTTPFound(location=request.route_url('home'))

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


@view_config(route_name='leaderboard', renderer='leaderboard.mak')
def leaderboard(request):
    """ Render a top users view. """
    if authenticated_userid(request):
        awarded_assertions = request.db.get_assertions_by_email(
                                authenticated_userid(request))
    else:
        awarded_assertions = None
    
    # Get top persons.
    persons_assertions = request.db.get_all_assertions().join(m.Person)
    from collections import defaultdict
    top_persons = defaultdict(int) # person: assertion count
    for item in persons_assertions:
        top_persons[item.person] += 1

    top_persons_sorted = sorted(sorted(top_persons,
                                key=lambda person: person.id),
                                key=top_persons.get,
                                reverse=True)
    
    # Get total user count.
    user_count = len(top_persons)

    if authenticated_userid(request):
        # Get rank.
        try:
            rank = top_persons_sorted.index(request.db.get_person(
                              person_email=authenticated_userid(request)
                                ))+ 1
        except ValueError:
            rank = 0
        # Get percentile.
        try:
            percentile = (float(rank) / float(user_count)) * 100
        except ZeroDivisionError:
            percentile = 0

        # Get a list of nearby competetors (5 users above the current
        # user and 5 users ranked below).
        competitors = top_persons_sorted[max(rank-6, 0):\
                                     min(rank+5, len(top_persons_sorted))]

    else:
        rank = None
        percentile = None
        competitors = None

    return dict(
            auth_principals=effective_principals(request),
            awarded_assertions=awarded_assertions,
            top_persons=top_persons,
            top_persons_sorted=top_persons_sorted,
            rank=rank,
            user_count=user_count,
            percentile=percentile,
            competitors=competitors,
            )


@view_config(route_name='explore', renderer='explore.mak')
def explore(request):
    
    # Check if a search has been done, and if so, redirect to
    # appropriate view.
    if request.POST:
        if request.POST.get('badge-search'):
            return HTTPFound(location=request.route_url('badge',
                                id=request.POST.get('badge-id')))
        elif request.POST.get('person-search'):
            return HTTPFound(location=request.route_url('user',
                                id=request.POST.get('person-nickname')))

    # Get awarded assertions.
    if authenticated_userid(request):
        awarded_assertions = request.db.get_assertions_by_email(
                                authenticated_userid(request))
    else:
        awarded_assertions = None

    # Get some random badges (for discovery).
    try:
        random_badges = random.sample(request.db.get_all_badges().all(), 5)
    except ValueError: # the sample is probably larger than the population
        random_badges = request.db.get_all_badges().all()

    # Get some random persons (for discovery).
    try:
        random_persons = random.sample(request.db.get_all_persons().all(), 5)
    except ValueError: # the sample is probably larger than the population
        random_persons = request.db.get_all_persons().all()
    
    return dict(
            auth_principals=effective_principals(request),
            awarded_assertions=awarded_assertions,
            random_badges=random_badges,
            random_persons=random_persons,
            )


@view_config(route_name='badge', renderer='badge.mak')
def badge(request):
    """Render badge info page."""
    # Get the badge to render info about.
    badge_id = request.matchdict.get('id')
    badge = request.db.get_badge(badge_id)

    # Get awarded assertions.
    if authenticated_userid(request):
        awarded_assertions = request.db.get_assertions_by_email(
                                authenticated_userid(request))
    else:
        awarded_assertions = None

    # Get badge statistics.
    times_awarded = len(request.db.get_assertions_by_badge(badge_id))
    last_awarded = request.db.get_all_assertions().filter_by(
            badge_id=badge_id).order_by(
                    sa.desc(m.Assertion.issued_on)).limit(1).one()
    last_awarded_person = request.db.get_person(
            id=last_awarded.person_id)
    
    first_awarded = request.db.get_all_assertions().filter_by(
            badge_id=badge_id).order_by(
                    sa.asc(m.Assertion.issued_on)).limit(1).one()
    first_awarded_person = request.db.get_person(
            id=first_awarded.person_id)

    if badge:
        return dict(
                badge=badge,
                auth_principals=effective_principals(request),
                awarded_assertions=awarded_assertions,
                times_awarded=times_awarded,
                last_awarded=last_awarded,
                last_awarded_person=last_awarded_person,
                first_awarded=first_awarded,
                first_awarded_person=first_awarded_person,
                )
    else:
        # TODO: Say that there was no badge found.
        return HTTPFound(location=request.route_url('home'))

@view_config(route_name='user', renderer='user.mak')
def user(request):
    """Render user info page."""
    
    # Get awarded assertions.
    if authenticated_userid(request):
        awarded_assertions = request.db.get_assertions_by_email(
                                authenticated_userid(request))
    else:
        awarded_assertions = None

    # So, here they can use their 'id' or their 'nickname'.
    # We'll try nickname first since we want to encourage that (or whatever)
    # and fall back to id if that fails.  If both fail, raise a 404.
    user_id = request.matchdict.get('id')
    user = request.db.get_person(nickname=user_id)

    if not user:
        user = request.db.get_person(id=user_id)

    if not user:
        raise HTTPNotFound("No such user %r" % user_id)

    return dict(
            user=user,
            user_badges=[a.badge for a in user.assertions],
            auth_principals=effective_principals(request),
            awarded_assertions=awarded_assertions,
            )


@view_config(route_name='builder', renderer='builder.mak')
def builder(request):
    if authenticated_userid(request):
        awarded_assertions = request.db.get_assertions_by_email(
                                 authenticated_userid(request))
    else:
        awarded_assertions = None

    # set came_from so we can get back home after openid auth.
    request.session['came_from'] = request.route_url('builder')

    # get default creator field
    default_creator = None
    user = request.db.get_person(person_email=authenticated_userid(request))
    if user:
        default_creator = user.nickname or user.email

    badge_yaml = None
    if request.POST:
        badge_yaml = generate_badge_yaml(request.POST)

    return dict(
        auth_principals=effective_principals(request),
        awarded_assertions=awarded_assertions,
        default_creator=default_creator,
        badge_yaml=badge_yaml,
    )


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
    # TODO: Can we remove the below?
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
