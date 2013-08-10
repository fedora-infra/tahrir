import random
import transaction
import types
import sqlalchemy as sa
import velruse
import json as _json
import StringIO
import qrcode as qrcode_module
import docutils.examples
from datetime import datetime

from mako.template import Template as t
from pyramid.view import (
    view_config,
    forbidden_view_config,
)

from pyramid.response import Response
from pyramid.httpexceptions import (
    HTTPFound,
    HTTPGone,
    HTTPNotFound,
    HTTPForbidden,
)

from pyramid.security import (
    authenticated_userid,
    effective_principals,
    remember,
    forget,
)
from pyramid.settings import asbool

from tahrir_api.dbapi import TahrirDatabase
import tahrir_api.model as m

from tahrir.utils import strip_tags, generate_badge_yaml
import widgets

from moksha.wsgi.widgets.api import get_moksha_socket, LiveWidget

# Optional.  Emit messages to the fedmsg bus.
fedmsg = None
try:
    import fedmsg
except ImportError:
    pass

def _get_user(request, id_or_nickname):
    '''Attempt to get a user by their id or nickname, returning None if
       we fail.'''
    user = request.db.get_person(nickname=id_or_nickname)

    if user:
        return user
    else:
        try:
            # We cast user_id to an integer so that Postgres doesn't
            # get upset about comparing what is potentially a string
            # to an integer column.
            return request.db.get_person(id=int(id_or_nickname))
        except TypeError:
            return None

@view_config(route_name='admin', renderer='admin.mak', permission='admin')
def admin(request):

    settings = request.registry.settings

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
                    created_on=created_on,
                    expires_on=expires_on,
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

            if fedmsg and settings.get('tahrir.use_fedmsg', False):
                person = request.db.get_person(
                    person_email=request.POST.get('assertion-person-email'))
                badge = request.db.get_badge(
                    badge_id=request.POST.get('assertion-badge-id'))

                fedmsg.publish(
                    modname="fedbadges", topic="badge.award",
                    msg=dict(
                        badge=dict(
                            name=badge.name,
                            description=badge.description,
                            image_url=badge.image,
                        ),
                        user=dict(
                            username=person.nickname,
                            badges_user_id=person.id
                        ),
                    ))

    return dict(
        auth_principals=effective_principals(request),
        awarded_assertions=awarded_assertions,
    )


@view_config(route_name='home', renderer='index.mak')
def index(request):

    n = 5 # n is the number of items displayed in each column.

    if authenticated_userid(request):
        awarded_assertions = request.db.get_assertions_by_email(
                                 authenticated_userid(request))
    else:
        awarded_assertions = None
    # set came_from so we can get back home after openid auth.
    request.session['came_from'] = request.route_url('home')

    persons_assertions = request.db.get_all_assertions().join(
                            m.Person).filter(
                            m.Person.opt_out == False)
    from collections import defaultdict
    top_persons = defaultdict(int) # person: assertion count
    for item in persons_assertions:
        top_persons[item.person] += 1

    top_persons_sorted = sorted(sorted(top_persons,
                                key=lambda person: person.id),
                                key=top_persons.get,
                                reverse=True)
    # Limit the sorted top persons to the top 10% and then take
    # a random sample of 5 persons from that pool.
    num_users_at_top = max(int(len(top_persons_sorted) * 0.1),
                           min(len(top_persons_sorted), 5))
    # This is not actually a sample yet, but it's about to be...
    top_persons_sample = top_persons_sorted[:num_users_at_top]
    try:
        top_persons_sample = random.sample(top_persons_sample, 5)
    except ValueError:
        # The sample is probably larger than the num of top users,
        # so let's just take all the users in the top 10%, in a
        # random order.
        random.shuffle(top_persons_sample)

    # Get latest awards.
    latest_awards = persons_assertions.order_by(
                    sa.desc(m.Assertion.issued_on)).limit(n).all()

    # Register our websocket handler callback
    if asbool(request.registry.settings['tahrir.use_websockets']):
        socket = make_websocket_handler(request.registry.settings)
        socket.display()

    return dict(
        auth_principals=effective_principals(request),
        latest_awards=latest_awards,
        newest_persons=request.db.get_all_persons().filter(
                        m.Person.opt_out == False).order_by(
                        sa.desc(m.Person.created_on)).limit(n).all(),
        top_persons=top_persons,
        top_persons_sample=top_persons_sample,
        awarded_assertions=awarded_assertions,
        moksha_socket=get_moksha_socket(request.registry.settings),
    )


@view_config(context=types.FunctionType, permission='admin')
def action(context, request):

    # Do the action
    context()

    return HTTPFound(location=request.route_url('home'))


@view_config(context=m.Invitation, name='claim')
def invitation_claim(request):
    """ Action that awards a person a badge after scanning a qrcode. """

    settings = request.registry.settings

    if request.context.expires_on < datetime.now():
        return HTTPGone("That invitation is expired.")

    if not authenticated_userid(request):
        request.session['came_from'] = request.resource_url(
                request.context, 'claim')
        return HTTPFound(location=request.route_url('login'))

    person = request.db.get_person(person_email=authenticated_userid(request))

    # Check to see if the user already has the badge.
    if request.context.badge in [a.badge for a in person.assertions]:
        # TODO: Flash a message explaining that they already have the badge
        return HTTPFound(location=request.route_url('home'))

    result = request.db.add_assertion(request.context.badge_id,
                                      person.email,
                                      datetime.now())

    if fedmsg and settings.get('tahrir.use_fedmsg', False):
        badge = request.context.badge
        fedmsg.publish(
            modname="fedbadges", topic="badge.award",
            msg=dict(
                badge=dict(
                    name=badge.name,
                    description=badge.description,
                    image_url=badge.image,
                ),
                user=dict(
                    username=person.nickname,
                    badges_user_id=person.id
                ),
            ))

    # TODO -- return them to a page that auto-exports their badges.
    # TODO -- flash and tell them they got the badge
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
    persons_assertions = request.db.get_all_assertions().join(m.Person).filter(
        m.Person.opt_out == False)
    from collections import defaultdict
    top_persons = defaultdict(int) # person: assertion count
    for item in persons_assertions:
        top_persons[item.person] += 1

    # top_persons and top_persons_sorted contain all persons, ordered
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
                                person_email=authenticated_userid(
                                             request))) + 1
        except ValueError:
            rank = 0
        # Get percentile.
        try:
            percentile = (float(rank) / float(user_count)) * 100
        except ZeroDivisionError:
            percentile = 0

        # Get a list of nearby competetors (5 users above the current
        # user and 5 users ranked below).
        competitors = top_persons_sorted[max(rank - 3, 0):\
                                     min(rank + 2, len(top_persons_sorted))]

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

@view_config(route_name='leaderboard_json', renderer='json')
@view_config(route_name='rank_json', renderer='json')
def leaderboard_json(request):
    """ Render a top-users JSON dump. """

    user = _get_user(request, request.matchdict.get('id'))

    # Get top persons.
    persons_assertions = request.db.get_all_assertions().join(m.Person).filter(
        m.Person.opt_out == False)[:25]
    from collections import defaultdict
    top_persons = defaultdict(int) # person: assertion count
    for item in persons_assertions:
        top_persons[item.person] += 1

    # top_persons and top_persons_sorted contain all persons, ordered
    top_persons_sorted = sorted(sorted(top_persons,
                                key=lambda person: person.id),
                                key=top_persons.get,
                                reverse=True)

    if user:
        idx = top_persons_sorted.index(user)
        top_persons_sorted = top_persons_sorted[(idx - 2):(idx + 2)]
        rank = idx
    else:
        rank = None

    # Get total user count.
    user_count = len(top_persons_sorted)

    ret = dict(
        top_persons_sorted=[_user_json_generator(request, user) for user in top_persons_sorted],
        user_count=user_count,
    )

    # Rather than sending `rank: null` when we're showing the global
    # leaderboard (as opposed to a user's rank), just omit the field.
    # But if the field exists, it means we looked up (and found) a user, and we
    # can include it in the result.
    if rank:
        ret['rank'] = rank

    return ret

@view_config(route_name='explore', renderer='explore.mak')
def explore(request):

    # Check if a search has been done, and if so, show
    # search results.
    search_results = dict() # name: link
    if request.POST:
        if request.POST.get('badge-search'):
            # badge-query is a required field on the template form.
            badge_query = request.POST.get('badge-query')
            matching_results = request.db.get_all_badges().filter(
                    sa.func.lower(m.Badge.name).like('%' + badge_query
                                    + '%') |
                    sa.func.lower(m.Badge.description).like('%' +
                                    badge_query +
                                    '%') |
                    sa.func.lower(m.Badge.tags).like('%' +
                                    badge_query
                                    + '%')).all()
            for r in matching_results:
                search_results[r.name] = request.route_url('badge', id=r.id)
        elif request.POST.get('person-search'):
            # person-query is a required field on the template form.
            person_query = request.POST.get('person-query')
            matching_results = request.db.get_all_persons().filter(
                    ((m.Person.nickname.like('%' + person_query
                            + '%')) |
                    (m.Person.bio.like('%' + person_query
                            + '%'))) &
                    (m.Person.opt_out == False)).all()
            for r in matching_results:
                search_results[r.nickname] = request.route_url(
                        'user', id=r.nickname)
        elif request.POST.get('tag-search'):
            # tag-query is a required field on the template form.
            tag_query = request.POST.get('tag-query')
            if request.POST.get('tag-match-all'):
                return HTTPFound(location=request.route_url(
                                 'tags', tags=tag_query, match='all'))
            else:
                return HTTPFound(location=request.route_url(
                                 'tags', tags=tag_query, match='any'))


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
        random_persons = random.sample(request.db.get_all_persons().filter(
                m.Person.opt_out == False).all(), 5)
    except ValueError: # the sample is probably larger than the population
        random_persons = request.db.get_all_persons().filter(
                m.Person.opt_out == False).all()

    return dict(
            auth_principals=effective_principals(request),
            awarded_assertions=awarded_assertions,
            random_badges=random_badges,
            random_persons=random_persons,
            search_results=search_results,
            )


@view_config(route_name='badge', renderer='badge.mak')
def badge(request):
    """Render badge info page."""
    # Get the badge to render info about.
    badge_id = request.matchdict.get('id')
    badge = request.db.get_badge(badge_id)

    # if the badge isn't found, raise a 404
    if not badge:
        raise HTTPNotFound("No such badge %r" % badge_id)

    # Get awarded assertions.
    if authenticated_userid(request):
        awarded_assertions = request.db.get_assertions_by_email(
                                authenticated_userid(request))
    else:
        awarded_assertions = None

    # Get badge statistics.
    # TODO: Perhaps abstract these statistics methods away somewhere?
    try:
        times_awarded = len(request.db.get_assertions_by_badge(badge_id))
        last_awarded = request.db.get_all_assertions().filter(
                sa.func.lower(m.Assertion.badge_id) == \
                        sa.func.lower(badge_id)).order_by(
                                sa.desc(m.Assertion.issued_on)).limit(1).one()
        last_awarded_person = request.db.get_person(
                id=last_awarded.person_id)

        first_awarded = request.db.get_all_assertions().filter(
                sa.func.lower(m.Assertion.badge_id) == \
                        sa.func.lower(badge_id)).order_by(
                                sa.asc(m.Assertion.issued_on)).limit(1).one()
        first_awarded_person = request.db.get_person(
                id=first_awarded.person_id)

        percent_earned = float(times_awarded) / \
                         float(len(request.db.get_all_persons().all()))
    except sa.orm.exc.NoResultFound: # This badge has never been awarded.
        times_awarded = 0
        last_awarded = None
        last_awarded_person = None
        first_awarded = None
        first_awarded_person = None
        percent_earned = 0
    # Percent of people who have earned this badge

    # Get badge description HTML from RST.
    # Note: this html_body function wraps the output
    # in a <divclass="document">.
    badge_description_html = docutils.examples.html_body(badge.description)

    return dict(
            badge=badge,
            badge_description_html=badge_description_html,
            auth_principals=effective_principals(request),
            awarded_assertions=awarded_assertions,
            times_awarded=times_awarded,
            last_awarded=last_awarded,
            last_awarded_person=last_awarded_person,
            first_awarded=first_awarded,
            first_awarded_person=first_awarded_person,
            percent_earned=percent_earned,
            )

def _badge_json_generator(request, badge_id, badge):
    try:
        times_awarded = len(request.db.get_assertions_by_badge(badge_id))

        last_awarded = request.db.get_all_assertions().filter(
                sa.func.lower(m.Assertion.badge_id) == \
                    sa.func.lower(badge_id)).order_by(
                        sa.desc(m.Assertion.issued_on)).limit(1).one()

        last_awarded_person = request.db.get_person(
                id=last_awarded.person_id)

        first_awarded = request.db.get_all_assertions().filter(
                sa.func.lower(m.Assertion.badge_id) == \
                    sa.func.lower(badge_id)).order_by(
                        sa.asc(m.Assertion.issued_on)).limit(1).one()

        first_awarded_person = request.db.get_person(
                id=first_awarded.person_id)

        percent_earned = float(times_awarded) / \
                         float(len(request.db.get_all_persons().all()))

    except sa.orm.exc.NoResultFound: # This badge has never been awarded.
        times_awarded = 0
        last_awarded = None
        last_awarded_person = None
        first_awarded = None
        first_awarded_person = None
        percent_earned = 0

    if last_awarded:
        last_awarded = float(last_awarded.issued_on.strftime('%s'))

    if last_awarded_person:
        last_awarded_person = last_awarded_person.nickname

    if first_awarded:
        first_awarded = float(first_awarded.issued_on.strftime('%s'))

    if first_awarded_person:
        first_awarded_person = first_awarded_person.nickname

    if percent_earned:
        percent_earned *= 100

    return {
        'id': badge.id,
        'name': badge.name,
        'description': badge.description,
        'times_awarded': times_awarded,
        'last_awarded': last_awarded,
        'last_awarded_person': last_awarded_person,
        'first_awarded': first_awarded,
        'first_awarded_person': first_awarded_person,
        'percent_earned': percent_earned,
        'image': badge.image
    }

@view_config(route_name='badge_json', renderer='json')
def badge_json(request):
    """Render badge JSON dump."""
    # Get the badge to render info about.
    badge_id = request.matchdict.get('id')
    badge = request.db.get_badge(badge_id)

    # if the badge isn't found, raise a 404
    if not badge:
        request.response.status = '404 Not Found'
        return {"error": "No such badge exists."}

    return _badge_json_generator(request, badge_id, badge)


@view_config(route_name='user', renderer='user.mak')
def user(request):
    """Render user info page."""

    # Grab a boolean out of the config
    settings = request.registry.settings
    allow_changenick = asbool(settings.get('tahrir.allow_changenick', True))

    # Get awarded assertions.
    if authenticated_userid(request):
        awarded_assertions = request.db.get_assertions_by_email(
                                authenticated_userid(request))
    else:
        awarded_assertions = None

    user = _get_user(request, request.matchdict.get('id'))

    if not user:
        raise HTTPNotFound("No such user %r" % user_id)

    if user.opt_out == True and user.email != authenticated_userid(request):
        raise HTTPNotFound("User %r has opted out." % user_id)

    if request.POST:

        # Authz check
        if authenticated_userid(request) != user.email:
            raise HTTPForbidden("Unauthorized")

        person = request.db.get_all_persons().filter_by(
                    email=authenticated_userid(request)).one()

        if request.POST.get('change-nickname') and allow_changenick:
            new_nick = request.POST.get('new-nickname')
            person.nickname = new_nick

            # The user's nickname has changed, so let's go to the new URL.
            return HTTPFound(location=request.route_url('user', id=new_nick))
        elif request.POST.get('deactivate-account'):
            person.opt_out = True
        elif request.POST.get('reactivate-account'):
            person.opt_out = False

    # Get user badges.
    user_badges = [a.badge for a in user.assertions]

    # Sort user badges by id.
    user_badges = sorted(user_badges, key=lambda badge: badge.id)

    # Get total number of unique badges in the system.
    count_total_badges = len(request.db.get_all_badges().all())

    # Get percentage of badges earned.
    try:
        percent_earned = (float(len(user_badges)) / \
                          float(count_total_badges)) * 100
    except ZeroDivisionError:
        percent_earned = 0

    # Get invitations the user has created.
    invitations = [i for i in request.db.get_invitations(user.id)\
                   if i.expires_on > datetime.now()]

    return dict(
            user=user,
            user_badges=user_badges,
            invitations=invitations,
            percent_earned=percent_earned,
            auth_principals=effective_principals(request),
            awarded_assertions=awarded_assertions,
            allow_changenick=allow_changenick,
            )

def _user_json_generator(request, user):
    awarded_assertions = request.db.get_assertions_by_email(user.email)

    # Get user badges.
    user_badges = [a.badge for a in user.assertions]

    # Sort user badges by id.
    user_badges = sorted(user_badges, key=lambda badge: badge.id)

    # Get total number of unique badges in the system.
    count_total_badges = len(request.db.get_all_badges().all())

    # Get percentage of badges earned.
    try:
        percent_earned = (float(len(user_badges)) / \
                          float(count_total_badges)) * 100
    except ZeroDivisionError:
        percent_earned = 0


    assertions = []
    for assertion in awarded_assertions:
        assertions.append(
            dict(
                {'issued': float(assertion.issued_on.strftime('%s'))}.items() + \
                _badge_json_generator(request, assertion.badge.id, assertion.badge).items()))

    return {
        'user': user.nickname,
        'avatar': user.avatar_url(int(request.GET.get('size', 100))),
        'percent_earned': percent_earned,
        'assertions': assertions
    }

@view_config(route_name='user_json', renderer='json')
def user_json(request):
    """Render user info JSON dump."""

    # So, here they can use their 'id' or their 'nickname'.
    # We'll try nickname first since we want to encourage that (or whatever)
    # and fall back to id if that fails.  If both fail, raise a 404.
    user = _get_user(request, request.matchdict.get('id'))

    if not user:
        request.response.status = '404 Not Found'
        return {"error": "No such user exists."}

    if user.opt_out == True and user.email != authenticated_userid(request):
        request.response.status = '404 Not Found'
        return {"error": "User has opted out."}

    return _user_json_generator(request, user)

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


@view_config(route_name='tags', renderer='tags.mak')
def tags(request):
    """Render tag page."""

    # Get awarded assertions.
    if authenticated_userid(request):
        awarded_assertions = request.db.get_assertions_by_email(
                                authenticated_userid(request))
    else:
        awarded_assertions = None

    # Get badges matching tag.
    tags = [t.strip() for t in request.matchdict.get('tags').split(',')]
    if request.matchdict.get('match') == 'all':
        badges = request.db.get_badges_from_tags(tags, match_all=True)
    else:
        badges = request.db.get_badges_from_tags(tags, match_all=False)

    return dict(
            tags=tags,
            badges=badges,
            auth_principals=effective_principals(request),
            awarded_assertions=awarded_assertions,
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


@view_config(context='pyramid.httpexceptions.HTTPServerError',
             renderer='500.mak')
def _500(request):
    request.response.status = 500
    return dict()


@view_config(route_name='login', renderer='login.mak')
@forbidden_view_config(renderer='login.mak')
def login(request):
    settings = request.registry.settings
    ident = "openid_identifier=" + settings.get('tahrir.openid_identifier')
    url = velruse.login_url(request, 'openid') + "?" + ident
    return HTTPFound(location=url)


@view_config(context='velruse.AuthenticationComplete')
def login_complete_view(request):
    context = request.context
    settings = request.registry.settings

    nickname = context.profile['preferredUsername']

    if asbool(settings.get('tahrir.use_openid_email')) \
       and context.profile['emails']:
        email = context.profile['emails'][0]
    else:
        ident = settings.get('tahrir.openid_identifier')
        domain = '.'.join(ident.split('.')[-2:])
        if domain.endswith('/'):
            domain = domain[:-1]
        email = nickname + "@" + domain

    # Keep adding underscores until we get a default nickname
    # that isn't already used.
    while request.db.get_person(nickname=nickname):
        nickname += '_'

    if not request.db.get_person(person_email=email):
        request.db.add_person(email=email, nickname=nickname)

    headers = remember(request, email)
    response = HTTPFound(location=request.session.get('came_from', '/'))
    response.headerlist.extend(headers)
    return response


@view_config(context='velruse.AuthenticationDenied', renderer='json')
def login_denied_view(request):
    # HAAACK -- if login fails, just try again.
    return HTTPFound(location=request.route_url('login'))



@view_config(route_name='logout')
def logout(request):
    headers = forget(request)
    return HTTPFound(location=request.resource_url(request.context),
                     headers=headers)


@view_config(route_name='assertion_widget',
             renderer='assertion_widget.mak')
def assertion_widget(request):
    person_id = request.matchdict.get('person')
    badge_id = request.matchdict.get('badge')
    user = request.db.get_person(id=person_id)
    if not user:
        raise HTTPNotFound("No such person %r" % person_id)

    def get_assertion():
        for assertion in user.assertions:
            if assertion.badge.id == badge_id:
                return assertion
        raise HTTPNotFound("User does not have that badge")

    assertion = get_assertion()
    return dict(assertion=assertion)


def make_websocket_handler(settings):
    """ Add a js snippet that listens over websockets to fedmsg.

    It animates the "latest awards" pane on the frontpage.
    """

    class WebsocketHandler(LiveWidget):
        topic = settings.get("tahrir.websocket.topic")
        onmessage = """
        (function(json){
            // TODO -- put the DOM manipulation stuff here.
            var user = json.msg.user.badges_user_id;
            var badge = json.msg.badge.badge_id;
            $.ajax({
                url: "%s/_w/assertion/" + user + "/" + badge,
                dataType: "html",
                success: function (html) {
                    $("#latest-awards").prepend(html);
                    $("#latest-awards > div:first-child").hide();
                    $("#latest-awards > div:first-child").slideDown("slow");
                    $("#latest-awards > div:last-child").slideUp('slow', complete=function() {
                        $("#latest-awards > div:last-child").remove();
                    });
                }
            });
        })(json);
        """ % settings['tahrir.base_url']
        backend = "websocket"

        # Don't actually produce anything when you call .display() on this widget.
        inline_engine_name = "mako"
        template = ""

    return WebsocketHandler
