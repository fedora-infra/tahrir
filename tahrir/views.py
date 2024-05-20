import codecs
import os
import random
import types
from datetime import date, datetime, timedelta, timezone
from decimal import ROUND_UP, Decimal
from io import BytesIO

import docutils.examples
import markupsafe
import qrcode as qrcode_module
import sqlalchemy as sa
import tahrir_api.model as m
from feedgen.feed import FeedGenerator
from pyramid.httpexceptions import (
    HTTPForbidden,
    HTTPFound,
    HTTPGone,
    HTTPMethodNotAllowed,
    HTTPNotFound,
)
from pyramid.response import Response
from pyramid.view import view_config
from tahrir_api.utils import convert_name_to_id

from tahrir.utils import generate_badge_yaml, get_avatar


def _get_user(request, id_or_nickname):
    """Attempt to get a user by their id or nickname, returning None if
    we fail."""
    user = request.db.get_person(nickname=id_or_nickname)

    if user:
        return user
    else:
        try:
            # We cast user_id to an integer so that Postgres doesn't
            # get upset about comparing what is potentially a string
            # to an integer column.
            return request.db.get_person(id=int(id_or_nickname))
        except ValueError:
            return None


def _get_team(request, team_id):
    """Get team for the given team_id"""
    team = request.db.get_team(team_id=team_id)

    return team


def _get_user_badge_info(request, user):
    """Returns a dictionary of the user badge information"""

    # Get user badges.
    user_badges = [a.badge for a in user.assertions]

    # Sort user badges by id.
    user_badges = sorted(user_badges, key=lambda badge: badge.id)

    # Get total number of unique badges in the system.
    count_total_badges = request.db.get_all_badges().count()

    # Get percentage of badges earned.
    try:
        percent_earned = (float(len(user_badges)) / float(count_total_badges)) * 100
    except ZeroDivisionError:
        percent_earned = 0

    # Get rank. (same code found in leaderboard view function)
    rank = user.rank or 0
    user_count = request.db.session.query(m.Person).filter(m.Person.opt_out.is_(False)).count()

    try:
        percentile = (
            Decimal(float(rank) / float(user_count)).quantize(Decimal(".0001"), rounding=ROUND_UP)
            * 100
        )
    except ZeroDivisionError:
        percentile = 0

    return dict(
        user_badges=user_badges,
        count_total_badges=count_total_badges,
        percent_earned=percent_earned,
        rank=rank,
        user_count=user_count,
        percentile=percentile,
    )


@view_config(route_name="award", renderer="string")
def award(request):
    if not request.POST:
        return HTTPMethodNotAllowed()

    token = request.session.get_csrf_token()
    if token != request.POST["csrf_token"]:
        raise HTTPForbidden("CSRF token did not match")

    agent = request.db.get_person(request.authenticated_userid)
    if not agent:
        raise HTTPForbidden()

    badge_id = request.POST.get("badge_id")
    badge = request.db.get_badge(badge_id)
    if not badge:
        raise HTTPNotFound(f"No such badge {badge_id!r}")

    if not badge.authorized(agent):
        raise HTTPForbidden(f"Unauthorized for {badge_id!r}")

    nickname = request.POST.get("nickname")
    user = request.db.get_person(nickname=nickname)
    if not user:
        raise HTTPNotFound(f"No such user {nickname!r}")

    if user.opt_out:
        raise HTTPNotFound(f"No such user {nickname!r}")

    # OK
    request.db.add_assertion(badge.id, user.email, None)

    return HTTPFound(location=request.route_url("badge_rss", id=badge.id))


@view_config(route_name="invite", renderer="string")
def invite(request):
    if not request.POST:
        return HTTPMethodNotAllowed()

    token = request.session.get_csrf_token()
    if token != request.POST["csrf_token"]:
        raise HTTPForbidden("CSRF token did not match")

    agent = request.db.get_person(request.authenticated_userid)
    if not agent:
        raise HTTPForbidden()

    badge_id = request.POST.get("badge_id")
    badge = request.db.get_badge(badge_id)
    if not badge:
        raise HTTPNotFound(f"No such badge {badge_id!r}")

    if not badge.authorized(agent):
        raise HTTPForbidden(f"Unauthorized for {badge_id!r}")

    try:
        fmt = "%Y-%m-%d %H:%M"
        expires_on = datetime.strptime(request.POST.get("expires-on"), fmt)
    except ValueError:
        expires_on = None  # Will default to 1 hour from now

    # OK
    request.db.add_invitation(badge.id, expires_on=expires_on, created_by_email=agent.email)

    return HTTPFound(location=request.route_url("user", id=agent.id))


@view_config(route_name="add_tag", renderer="string", permission="admin")
def add_tag(request):
    if not request.POST:
        return HTTPMethodNotAllowed()

    token = request.session.get_csrf_token()
    if token != request.POST["csrf_token"]:
        raise HTTPForbidden("CSRF token did not match")

    agent = request.db.get_person(request.authenticated_userid)
    if not agent:
        raise HTTPForbidden()

    badge_id = request.POST.get("badge_id")
    badge = request.db.get_badge(badge_id)
    if not badge:
        raise HTTPNotFound(f"No such badge {badge_id!r}")

    tags = request.POST.get("tags", "")
    new_tags = [tag.strip() for tag in tags.strip().split(",") if tag.strip()]
    originals = [tag.strip() for tag in badge.tags.split(",") if tag.strip()]
    badge.tags = ",".join(set(originals + new_tags)) + ","
    request.db.session.flush()

    return HTTPFound(location=request.route_url("badge", id=badge.id))


@view_config(route_name="admin", renderer="admin.mak", permission="admin")
def admin(request):
    # settings = request.registry.settings

    # TODO: Check if I even need this anymore... leaving for now.
    request.session["came_from"] = request.route_url("admin")

    if request.authenticated_userid:
        awarded_assertions = request.db.get_assertions_by_email(request.authenticated_userid)
    else:
        awarded_assertions = None

    # Handle any admin actions. These are done through POSTS via the
    # HTML forms on the admin panel.
    if request.POST:
        token = request.session.get_csrf_token()
        if token != request.POST["csrf_token"]:
            raise HTTPForbidden("CSRF token did not match")

        if request.POST.get("add-team"):
            team_name = request.POST.get("team-name")
            team_id = convert_name_to_id(team_name)
            if not request.db.team_exists(team_id=team_id):
                request.db.create_team(name=team_name)
                request.session.flash(f"You created a team with name {team_name}")
            else:
                request.session.flash(f"Team with name {team_name} already exists.")

        elif request.POST.get("add-series"):
            data = request.POST
            series_name = data.get("series-name")
            series_id = convert_name_to_id(series_name)
            if not request.db.series_exists(series_id):
                description = data.get("series-description")
                tags = data.get("series-tags")
                team_id = data.get("series-team-id")

                request.db.create_series(
                    series_id=series_id,
                    name=series_name,
                    desc=description,
                    tags=tags,
                    team_id=team_id,
                )
                request.session.flash(f"You created a series with name {series_name}")
            else:
                request.session.flash(f"Series with name {series_name} already exists.")

        elif request.POST.get("add-milestone"):
            data = request.POST
            series_id = data.get("milestone-series-id")
            badge_id = data.get("milestone-badge-id")
            if not request.db.milestone_exists_for_badge_series(badge_id, series_id):
                position = data.get("milestone-position")
                request.db.create_milestone(
                    position=position, series_id=series_id, badge_id=badge_id
                )
                request.session.flash(
                    f"You add badge {badge_id} as milestone in series {series_id}"
                )
            else:
                request.session.flash(
                    f"Badge {badge_id} already added as milestone in series {series_id}"
                )

        elif request.POST.get("add-person"):
            # Email is a required field on the HTML form.
            # Add a Badge to the DB.
            email = request.POST.get("person-email")
            if not request.db.person_exists(email=email):
                request.db.add_person(
                    email,
                    nickname=request.POST.get("person-nickname"),
                )
                request.session.flash(
                    "You added a person with email {}".format(request.POST.get("person-email"))
                )
            else:
                request.session.flash(f"Person with email {email} already exists.")
        elif request.POST.get("add-badge"):
            name = request.POST.get("badge-name")
            idx = convert_name_to_id(name)
            if not request.db.badge_exists(idx):
                # Add a Badge to the DB.
                request.db.add_badge(
                    name,
                    request.POST.get("badge-image"),
                    request.POST.get("badge-description"),
                    request.POST.get("badge-criteria"),
                    request.POST.get("badge-issuer"),
                    request.POST.get("badge-tags"),
                )
                request.session.flash(f"You added a badge with name {name}")
            else:
                request.session.flash(f"Badge with id {idx} already exists.")

        elif request.POST.get("add-invitation"):
            # Add an Invitation to the DB.
            try:
                created_on = datetime.strptime(
                    request.POST.get("invitation-created"), "%Y-%m-%d %H:%M"
                )
            except ValueError:
                created_on = None  # Will default to datetime.now(timezone.utc)

            try:
                expires_on = datetime.strptime(
                    request.POST.get("invitation-expires"), "%Y-%m-%d %H:%M"
                )
            except ValueError:
                expires_on = None  # Will default to datettime.now(timezone.utc)

            try:
                request.db.add_invitation(
                    request.POST.get("invitation-badge-id"),
                    created_on=created_on,
                    expires_on=expires_on,
                    created_by_email=request.POST.get("invitation-issuer-email"),
                )
            except ValueError as e:
                request.session.flash(str(e))
            else:
                request.session.flash(
                    "You added an invitation for badge {}".format(
                        request.POST.get("invitation-badge-id")
                    )
                )
        elif request.POST.get("add-issuer"):
            origin = request.POST.get("issuer-origin")
            name = request.POST.get("issuer-name")
            if not request.db.issuer_exists(origin, name):
                # Add an Issuer to the DB.
                request.db.add_issuer(
                    origin, name, request.POST.get("issuer-org"), request.POST.get("issuer-contact")
                )
                request.session.flash(
                    "You added an issuer with the name {}".format(request.POST.get("issuer-name"))
                )
            else:
                request.session.flash(
                    f"Issuer with origin {origin} and name {name} already exists."
                )

        elif request.POST.get("add-assertion"):
            idx = request.POST.get("assertion-badge-id")
            email = request.POST.get("assertion-person-email")
            if not request.db.assertion_exists(idx, email):
                # Add an Assertion to the DB.
                try:
                    issued_on = datetime.strptime(
                        request.POST.get("assertion-issued-on"), "%Y-%m-%d %H:%M"
                    )
                except ValueError:
                    issued_on = None  # Will default to datetime.now(timezone.utc)

                request.db.add_assertion(
                    request.POST.get("assertion-badge-id"),
                    request.POST.get("assertion-person-email"),
                    issued_on,
                )
                request.session.flash(
                    f"You awarded {request.POST.get('assertion-badge-id')} "
                    f"to {request.POST.get('assertion-person-email')}"
                )
            else:
                request.session.flash(f"User with email {email} already has badge {idx}.")

        elif request.POST.get("add-authorization"):
            idx = request.POST.get("authorization-badge-id")
            email = request.POST.get("authorization-person-email")

            if not request.db.authorization_exists(idx, email):
                request.db.add_authorization(idx, email)
                request.session.flash(f"You authorized {email} to issue {idx}")
            else:
                request.session.flash(f"{email} is already authorized to issue {idx}.")

    return dict(
        auth_principals=request.effective_principals,
        awarded_assertions=awarded_assertions,
        issuers=request.db.get_all_issuers().all(),
    )


@view_config(route_name="heartbeat", renderer="string")
def heartbeat(request):
    # A NOOP for haproxy httpchk to ping
    n = request.db.get_all_badges().count()
    return "OK: (%i badges in the system)" % n


@view_config(route_name="home", renderer="index.mak")
def index(request):

    n = 5  # n is the number of items displayed in each column.

    # set came_from so we can get back home after openid auth.
    request.session["came_from"] = request.route_url("home")

    latest_awards = (
        request.db.get_all_assertions()
        .join(m.Person)
        .filter(m.Person.opt_out.is_(False))
        .order_by(sa.desc(m.Assertion.issued_on))
        .limit(n)
        .all()
    )

    start = get_start_week()
    stop = start + timedelta(days=6)
    weekly_leaders = request.db._make_leaderboard(
        start=start,
        stop=stop,
    )

    now = datetime.now(timezone.utc)
    start = date(now.year, now.month, 1)
    if now.month == 12:
        stop = date(now.year + 1, 1, 1) - timedelta(days=1)
    else:
        stop = date(now.year, now.month + 1, 1) - timedelta(days=1)
    monthly_leaders = request.db._make_leaderboard(
        start=start,
        stop=stop,
    )

    return dict(
        auth_principals=request.effective_principals,
        latest_awards=latest_awards,
        weekly_leaders=weekly_leaders,
        monthly_leaders=monthly_leaders,
        n=n,
    )


@view_config(context=types.FunctionType, permission="admin")
def action(context, request):

    # Do the action
    context()

    return HTTPFound(location=request.route_url("home"))


@view_config(context=m.Invitation, name="claim")
def invitation_claim(request):
    """Action that awards a person a badge after scanning a qrcode."""

    # settings = request.registry.settings

    if request.context.expires_on < datetime.now():
        return HTTPGone("That invitation is expired.")

    if not request.authenticated_userid:
        request.session["came_from"] = request.resource_url(request.context, "claim")
        return HTTPFound(location=request.route_url("login"))

    person = request.db.get_person(person_email=request.authenticated_userid)

    # Check to see if the user already has the badge.
    if request.context.badge in [a.badge for a in person.assertions]:
        request.session.flash("You already have " + request.context.badge_id + " badge")
        return HTTPFound(location=request.route_url("home"))

    request.db.add_assertion(request.context.badge_id, person.email, datetime.now(timezone.utc))

    # TODO -- return them to a page that auto-exports their badges.
    request.session.flash("You have earned " + request.context.badge_id + " badge")
    return HTTPFound(location=request.route_url("home"))


@view_config(context=m.Invitation, name="qrcode")
def invitation_qrcode(request):
    """Returns a raw dummy qrcode through to the user."""

    if request.context.expires_on < datetime.now():
        return HTTPGone("That invitation is expired.")

    target = request.resource_url(request.context, "claim")
    img = qrcode_module.make(target)
    bytestream = BytesIO()
    img.save(bytestream)
    return Response(
        body=bytestream.getvalue(),
        content_type="image/png",
    )


@view_config(route_name="leaderboard", renderer="leaderboard.mak")
def leaderboard(request):
    """Render a top users view."""

    user, awarded_assertions = None, None

    if request.authenticated_userid:
        user = request.db.get_person(person_email=request.authenticated_userid)

    query = (
        request.db.session.query(m.Person)
        .order_by(
            m.Person.rank,
            m.Person.created_on,
        )
        .filter(m.Person.opt_out.is_(False))
    )

    leaderboard = query.filter(m.Person.rank.isnot(None)).all()
    # Get total user count.
    user_count = len(leaderboard)
    leaderboard.extend(query.filter(m.Person.rank.is_(None)).all())

    user_to_rank = request.db._make_leaderboard()

    if user:
        awarded_assertions = user.assertions
        rank = user.rank or 0
        idx = rank - 1

        # Handle the case of leaderboard[-2:2] which will be [] always.
        if idx < 2:
            idx = 2

        competitors = leaderboard[(idx - 2) : (idx + 3)]

        try:
            percentile = (float(rank) / float(user_count)) * 100
        except ZeroDivisionError:
            percentile = 0
    else:
        awarded_assertions = None
        rank = None
        competitors = None
        percentile = None

    return dict(
        auth_principals=request.effective_principals,
        awarded_assertions=awarded_assertions,
        top_persons_sorted=leaderboard,
        rank=rank,
        user_count=user_count,
        percentile=percentile,
        competitors=competitors,
        user_to_rank=user_to_rank,
    )


@view_config(route_name="leaderboard_json", renderer="json")
@view_config(route_name="rank_json", renderer="json")
def leaderboard_json(request):
    """Render a top-users JSON dump."""

    limit = int(request.params.get("limit", 25))
    user_id = request.matchdict.get("id")
    user = None
    if user_id:
        user = _get_user(request, user_id)

    query = (
        request.db.session.query(m.Person)
        .order_by(
            m.Person.rank,
            m.Person.created_on,
        )
        .filter(m.Person.opt_out.is_(False))
    )

    leaderboard = query.filter(m.Person.rank.isnot(None)).all()
    # Get total user count.
    # user_count = len(leaderboard)
    leaderboard.extend(query.filter(m.Person.rank.is_(None)).all())

    user_to_rank = request.db._make_leaderboard()

    if user:
        rank = user.rank or 0
        idx = rank - 1

        # Handle the case of leaderboard[-2:2] which will be [] always.
        if idx < 2:
            idx = 2

        leaderboard = leaderboard[(idx - 2) : (idx + 3)]
    else:
        leaderboard = leaderboard[:limit]

    ret = [
        {**user_to_rank[p], **{"nickname": p.nickname}} for p in leaderboard if p in user_to_rank
    ]

    return {"leaderboard": ret}


@view_config(route_name="about", renderer="about.mak")
def about(request):
    return dict(content=load_docs(request, "about"), auth_principals=request.effective_principals)


@view_config(route_name="explore", renderer="explore.mak")
def explore(request):

    # Check if a search has been done, and if so, show
    # search results.
    search_query = None
    search_results = dict()  # name: link
    if request.POST:
        token = request.session.get_csrf_token()
        if token != request.POST["csrf_token"]:
            raise HTTPForbidden("CSRF token did not match")

        if request.POST.get("badge-search"):
            # badge-query is a required field on the template form.
            search_query = request.POST.get("badge-query")
            matching_results = (
                request.db.get_all_badges()
                .filter(
                    sa.func.lower(m.Badge.name).like("%" + search_query + "%")
                    | sa.func.lower(m.Badge.description).like("%" + search_query + "%")
                    | sa.func.lower(m.Badge.tags).like("%" + search_query + "%")
                )
                .all()
            )
            for r in matching_results:
                search_results[r.name] = request.route_url("badge", id=r.id)
        elif request.POST.get("person-search"):
            # person-query is a required field on the template form.
            search_query = request.POST.get("person-query")
            matching_results = (
                request.db.get_all_persons()
                .filter(
                    (m.Person.nickname.like("%" + search_query + "%"))
                    & (m.Person.opt_out.is_(False))
                )
                .all()
            )
            for r in matching_results:
                search_results[r.nickname] = request.route_url("user", id=r.nickname)
        elif request.POST.get("tag-search"):
            # tag-query is a required field on the template form.
            search_query = request.POST.get("tag-query")
            if request.POST.get("tag-match-all"):
                return HTTPFound(location=request.route_url("tags", tags=search_query, match="all"))
            else:
                return HTTPFound(location=request.route_url("tags", tags=search_query, match="any"))

    # Get awarded assertions.
    if request.authenticated_userid:
        awarded_assertions = request.db.get_assertions_by_email(request.authenticated_userid)
    else:
        awarded_assertions = None

    # Get some random badges (for discovery).
    try:
        random_badges = random.sample(request.db.get_all_badges().all(), 5)
    except ValueError:  # the sample is probably larger than the population
        random_badges = request.db.get_all_badges().all()

    # Get some random persons (for discovery).
    try:
        random_persons = random.sample(
            request.db.get_all_persons().filter(m.Person.opt_out.is_(False)).all(), 5
        )
    except ValueError:  # the sample is probably larger than the population
        random_persons = request.db.get_all_persons().filter(m.Person.opt_out.is_(False)).all()

    return dict(
        auth_principals=request.effective_principals,
        awarded_assertions=awarded_assertions,
        random_badges=random_badges,
        random_persons=random_persons,
        search_results=search_results,
        search_query=search_query,
    )


@view_config(route_name="explore_badges", renderer="explore_badges.mak")
def explore_badges(request):

    all_badges = request.db.get_all_badges().all()

    newest_badges = sorted(
        request.db.get_all_badges().all(), key=lambda badge: badge.created_on, reverse=True
    )[:20]

    # Get awarded assertions.
    if request.authenticated_userid:
        awarded_assertions = request.db.get_assertions_by_email(request.authenticated_userid)
    else:
        awarded_assertions = None

    return dict(
        all_badges=all_badges,
        newest_badges=newest_badges,
        auth_principals=request.effective_principals,
        awarded_assertions=awarded_assertions,
    )


@view_config(route_name="explore_badges_rss")
def explore_badges_rss(request):
    """Render rss feed for the latest badges."""

    newest_badges = sorted(
        request.db.get_all_badges().all(), key=lambda badge: badge.created_on, reverse=True
    )[:20]

    feed = FeedGenerator()
    feed.title("Newest badges Feed")
    feed.link(href=request.route_url("explore_badges_rss"), rel="self")
    feed.subtitle("Latest badges of the application")
    feed.language = "en"

    description_template = "<img src='%s' alt='%s' />%s"

    for badge in newest_badges:
        url = request.route_url("badge", id=badge.id)
        entry = feed.add_entry()
        entry.title(f"New badge: {badge.name} !")
        entry.link(href=url)
        pubdate = badge.created_on.replace(tzinfo=timezone.utc)
        entry.published(pubdate)
        entry.description(
            description_template
            % (
                badge.image,
                badge.name,
                badge.description,
            )
        )

    return Response(
        body=feed.rss_str(pretty=True),
        content_type="application/rss+xml",
        charset="utf-8",
    )


@view_config(route_name="badge_full", renderer="badge_full.mak")
@view_config(route_name="badge", renderer="badge.mak")
def badge(request):
    """Render badge info page."""
    # Get the badge to render info about.
    badge_id = request.matchdict.get("id")
    badge = request.db.get_badge(badge_id)

    # if the badge isn't found, raise a 404
    if not badge:
        raise HTTPNotFound(f"No such badge {badge_id!r}")

    # Get awarded assertions.
    if request.authenticated_userid:
        awarded_assertions = request.db.get_assertions_by_email(request.authenticated_userid)
    else:
        awarded_assertions = []

    # Get badge statistics.
    # TODO: Perhaps abstract these statistics methods away somewhere?
    try:
        times_awarded = len(request.db.get_assertions_by_badge(badge_id))
        last_awarded = (
            request.db.get_all_assertions()
            .filter(sa.func.lower(m.Assertion.badge_id) == sa.func.lower(badge_id))
            .order_by(sa.desc(m.Assertion.issued_on))
            .limit(1)
            .one()
        )
        last_awarded_person = request.db.get_person(id=last_awarded.person_id)

        first_awarded = (
            request.db.get_all_assertions()
            .filter(sa.func.lower(m.Assertion.badge_id) == sa.func.lower(badge_id))
            .order_by(sa.asc(m.Assertion.issued_on))
            .limit(1)
            .one()
        )
        first_awarded_person = request.db.get_person(id=first_awarded.person_id)

        percent_earned = float(times_awarded) / float(len(request.db.get_all_persons().all()))

        # This is a list of assertions for this badge.
        badge_assertions = (
            request.db.get_all_assertions().filter(m.Assertion.badge_id == badge.id).all()
        )
    except sa.orm.exc.NoResultFound:  # This badge has never been awarded.
        times_awarded = 0
        last_awarded = None
        last_awarded_person = None
        first_awarded = None
        first_awarded_person = None
        badge_assertions = None
        percent_earned = 0
    # Percent of people who have earned this badge

    # Get badge description HTML from RST.
    # Note: this html_body function wraps the output
    # in a <divclass="document">.
    badge_description_html = docutils.examples.html_body(badge.description)

    return dict(
        badge=badge,
        badge_description_html=badge_description_html,
        auth_principals=request.effective_principals,
        awarded_assertions=awarded_assertions,
        times_awarded=times_awarded,
        last_awarded=last_awarded,
        last_awarded_person=last_awarded_person,
        first_awarded=first_awarded,
        first_awarded_person=first_awarded_person,
        badge_assertions=badge_assertions,
        percent_earned=percent_earned,
    )


def _badge_json_generator(request, badge, withasserts=True):
    if not withasserts:
        return {
            "id": badge.id,
            "name": badge.name,
            "description": badge.description,
            "image": badge.image,
            "tags": badge.tags,
        }

    try:
        # Fixme -- not sure if this works -- need to check it out.
        assertions = sorted(badge.assertions, key=lambda b: b.issued_on)

        times_awarded = len(badge.assertions)

        percent_earned = float(times_awarded) / float(request.db.get_all_persons().count())

        if assertions:
            last_awarded = assertions[-1]
            last_awarded_person = last_awarded.person

            first_awarded = assertions[0]
            first_awarded_person = first_awarded.person
        else:
            last_awarded = None
            last_awarded_person = None
            first_awarded = None
            first_awarded_person = None

    except sa.orm.exc.NoResultFound:  # This badge has never been awarded.
        times_awarded = 0
        last_awarded = None
        last_awarded_person = None
        first_awarded = None
        first_awarded_person = None
        percent_earned = 0

    if last_awarded:
        last_awarded = float(last_awarded.issued_on.strftime("%s"))

    if last_awarded_person:
        last_awarded_person = last_awarded_person.nickname

    if first_awarded:
        first_awarded = float(first_awarded.issued_on.strftime("%s"))

    if first_awarded_person:
        first_awarded_person = first_awarded_person.nickname

    if percent_earned:
        percent_earned *= 100

    return {
        "id": badge.id,
        "name": badge.name,
        "description": badge.description,
        "times_awarded": times_awarded,
        "last_awarded": last_awarded,
        "last_awarded_person": last_awarded_person,
        "first_awarded": first_awarded,
        "first_awarded_person": first_awarded_person,
        "percent_earned": percent_earned,
        "image": badge.image,
        "tags": badge.tags,
    }


@view_config(route_name="badge_json", renderer="json")
def badge_json(request):
    """Render badge JSON dump."""
    # Get the badge to render info about.
    badge_id = request.matchdict.get("id")
    badge = request.db.get_badge(badge_id)

    # if the badge isn't found, raise a 404
    if not badge:
        request.response.status = "404 Not Found"
        return {"error": "No such badge exists."}

    return _badge_json_generator(request, badge)


@view_config(route_name="badge_rss")
def badge_rss(request):
    """Render per-badge rss."""

    badge_id = request.matchdict.get("id")
    badge = request.db.get_badge(badge_id)

    if not badge:
        raise HTTPNotFound(f"No such badge {badge_id!r}")

    # this gives us the assertions sorted *earliest first*. feedgen's
    # default when adding entries is to prepend - put the new item at
    # the top of the feed. so as we iterate over this and add items to
    # the feed, we add each newer assertion to the front of the feed
    sorted_assertions = sorted(badge.assertions, key=lambda x: x.issued_on)

    feed = FeedGenerator()
    feed.title(f"Badges Feed for {badge.name}")
    feed.link(href=request.route_url("badge", id=badge.id), rel="self")
    feed.subtitle(f"Latest recipients of the badge {badge.name}")
    feed.language("en")

    description_template = "<img src='%s' alt='%s' />%s"

    for assertion in sorted_assertions:
        url = request.route_url("user", id=assertion.person.nickname or assertion.person.id)
        entry = feed.add_entry()
        entry.title(assertion.person.nickname)
        entry.link(href=url)
        pubdate = assertion.issued_on.replace(tzinfo=timezone.utc)
        entry.published(pubdate)
        entry.description(
            description_template
            % (
                get_avatar(assertion.person.avatar, 128),
                assertion.person.nickname,
                assertion.person.nickname,
            )
        )

    return Response(
        body=feed.rss_str(pretty=True),
        content_type="application/rss+xml",
        charset="utf-8",
    )


@view_config(route_name="badge_stl", renderer="thingiview.mak")
def badge_stl(request):
    """Render per-badge stl."""

    badge_id = request.matchdict.get("id")
    badge = request.db.get_badge(badge_id)

    if not badge:
        raise HTTPNotFound(f"No such badge {badge_id!r}")

    if not badge.stl:
        raise HTTPNotFound("Badge has no stl file.")

    return dict(
        badge=badge,
        auth_principals=request.effective_principals,
    )


@view_config(route_name="user_rss")
def user_rss(request):
    """Render per-user rss."""

    user_id = request.matchdict.get("id")
    user = _get_user(request, user_id)

    if not user:
        raise HTTPNotFound(f"No such user {user_id!r}")

    if user.opt_out and user.email != request.authenticated_userid:
        raise HTTPNotFound(f"User {user_id!r} has opted out.")

    # this gives us the assertions sorted *earliest first*. feedgen's
    # default when adding entries is to prepend - put the new item at
    # the top of the feed. so as we iterate over this and add items to
    # the feed, we add each newer assertion to the front of the feed
    sorted_assertions = sorted(user.assertions, key=lambda x: x.issued_on)

    feed = FeedGenerator()
    feed.title(f"Badges Feed for {user.nickname}")
    feed.link(href=request.route_url("user", id=user.nickname or user.id), rel="self")
    feed.subtitle(f"The latest Fedora Badges obtained by {user.nickname}")
    feed.language("en")

    description_template = "<img src='%s' alt='%s'/>%s -- %s"

    for assertion in sorted_assertions:
        entry = feed.add_entry()
        entry.title(assertion.badge.name)
        entry.link(href=request.route_url("badge", id=assertion.badge.id))
        pubdate = assertion.issued_on.replace(tzinfo=timezone.utc)
        entry.published(pubdate)
        entry.description(
            description_template
            % (
                assertion.badge.image,
                assertion.badge.name,
                assertion.badge.name,
                assertion.badge.description,
            )
        )

    return Response(
        body=feed.rss_str(pretty=True),
        content_type="application/rss+xml",
        charset="utf-8",
    )


@view_config(route_name="user", renderer="user.mak")
def user(request):
    """Render user info page."""

    # Grab a boolean out of the config
    # settings = request.registry.settings

    # Get awarded assertions.
    if request.authenticated_userid:
        awarded_assertions = request.db.get_assertions_by_email(request.authenticated_userid)
    else:
        awarded_assertions = None

    user_id = request.matchdict.get("id")
    user = _get_user(request, user_id)

    history_limit = int(request.params.get("history_limit", 10))

    if not user:
        raise HTTPNotFound(f"No such user {user_id!r}")

    if user.opt_out and user.email != request.authenticated_userid:
        raise HTTPNotFound(f"User {user_id!r} has opted out.")

    if request.POST:

        token = request.session.get_csrf_token()
        if token != request.POST["csrf_token"]:
            raise HTTPForbidden("CSRF token did not match")

        # Authz check
        if request.authenticated_userid != user.email:
            raise HTTPForbidden("Unauthorized")

        person = request.db.get_person(person_email=request.authenticated_userid)
        if person is None:
            raise HTTPNotFound(f"Person with email {request.authenticated_userid} not found")

        if request.POST.get("deactivate-account"):
            person.opt_out = True
        elif request.POST.get("reactivate-account"):
            person.opt_out = False

    # Get invitations the user has created.
    invitations = [i for i in request.db.get_invitations(user.id) if i.expires_on > datetime.now()]

    user_info = dict(
        user=user,
        invitations=invitations,
        auth_principals=request.effective_principals,
        awarded_assertions=awarded_assertions,
        history_limit=history_limit,
    )

    user_info.update(_get_user_badge_info(request, user))

    return user_info


def _user_json_generator(request, user):
    """Generates a json of user data"""
    user_info = _get_user_badge_info(request, user)

    assertions = []
    for assertion in user.assertions:
        issued = {"issued": float(assertion.issued_on.strftime("%s"))}
        _badged = _badge_json_generator(request, assertion.badge, withasserts=False)
        assertions.append({**issued, **_badged})

    return {
        "user": user.nickname,
        "avatar": get_avatar(user.avatar, int(request.GET.get("size", 100))),
        "percent_earned": user_info["percent_earned"],
        "assertions": assertions,
        "percentile": str(user_info["percentile"]),
        "rank": user_info["rank"],
        "user_count": user_info["user_count"],
    }


def _user_team_json_generator(request, team, user):
    """Generate the json of team data"""
    team_id = team.id
    badges = request.db.get_badges_from_team(team_id)
    badges_count = len(badges)

    series = request.db.get_series_from_team(team_id)
    assertions = user.assertions
    assertion_ids = set([assertion.badge_id for assertion in assertions])

    series_info = []
    for elem in series:
        milestones_info = []
        milestones = elem.milestone
        for milestone in milestones:
            milestones_info.append(
                {
                    "milestone": milestone.as_dict(),
                    "series": elem.as_dict(),
                    "is_awarded": milestone.badge_id in assertion_ids,
                }
            )
        series_info.append(milestones_info)

    return {"badges_count": badges_count, "series_info": series_info}


@view_config(route_name="diff", renderer="diff.mak")
def diff(request):
    """Render user diff page."""

    # Get awarded assertions.
    if request.authenticated_userid:
        awarded_assertions = request.db.get_assertions_by_email(request.authenticated_userid)
    else:
        awarded_assertions = None

    user_a_id = request.matchdict.get("id_a")
    user_b_id = request.matchdict.get("id_b")
    user_a = _get_user(request, user_a_id)
    user_b = _get_user(request, user_b_id)

    if not user_a:
        raise HTTPNotFound(f"No such user {user_a_id!r}")
    if not user_b:
        raise HTTPNotFound(f"No such user {user_b_id!r}")

    if user_a.opt_out and user_a.email != request.authenticated_userid:
        raise HTTPNotFound(f"User {user_a_id!r} has opted out.")
    if user_b.opt_out and user_b.email != request.authenticated_userid:
        raise HTTPNotFound(f"User {user_b_id!r} has opted out.")

    # Get user badges.
    user_a_badges = [a.badge for a in user_a.assertions]
    user_b_badges = [a.badge for a in user_b.assertions]

    # Sort user badges by id.
    user_a_badges = sorted(user_a_badges, key=lambda badge: badge.id)
    user_b_badges = sorted(user_b_badges, key=lambda badge: badge.id)

    # Get total number of unique badges in the system.
    count_total_badges = len(request.db.get_all_badges().all())

    # Get percentage of badges earned.
    try:
        user_a_percent_earned = (float(len(user_a_badges)) / float(count_total_badges)) * 100
    except ZeroDivisionError:
        user_a_percent_earned = 0
    try:
        user_b_percent_earned = (float(len(user_b_badges)) / float(count_total_badges)) * 100
    except ZeroDivisionError:
        user_b_percent_earned = 0

    # Get rank. (same code found in leaderboard view function)
    user_a_rank = user_a.rank
    user_b_rank = user_b.rank
    user_count = request.db.session.query(m.Person).filter(m.Person.opt_out.is_(False)).count()

    try:
        user_a_percentile = (float(user_a_rank) / float(user_count)) * 100
    except ZeroDivisionError:
        user_a_percentile = 0
    try:
        user_b_percentile = (float(user_b_rank) / float(user_count)) * 100
    except ZeroDivisionError:
        user_b_percentile = 0

    # Diff badges.
    user_a_unique_badges = []
    user_b_unique_badges = []
    combined_badges = list(sorted(set(user_a_badges + user_b_badges), key=lambda badge: badge.id))
    shared_badges = []
    for badge in combined_badges:
        if badge in user_a_badges and badge not in user_b_badges:
            user_a_unique_badges.append(badge)
        elif badge in user_b_badges and badge not in user_a_badges:
            user_b_unique_badges.append(badge)
        elif badge in user_a_badges and badge in user_b_badges:
            shared_badges.append(badge)

    return dict(
        auth_principals=request.effective_principals,
        awarded_assertions=awarded_assertions,
        user_count=user_count,
        user_a=user_a,
        user_b=user_b,
        user_a_badges=user_a_badges,
        user_b_badges=user_b_badges,
        user_a_unique_badges=user_a_unique_badges,
        user_b_unique_badges=user_b_unique_badges,
        shared_badges=shared_badges,
        user_a_percent_earned=user_a_percent_earned,
        user_b_percent_earned=user_b_percent_earned,
        user_a_rank=user_a_rank,
        user_b_rank=user_b_rank,
        user_a_percentile=user_a_percentile,
        user_b_percentile=user_b_percentile,
    )


@view_config(route_name="user_team_json", renderer="json")
def user_team_json(request):
    """Render user team info as JSON dump."""

    user = _get_user(request, request.matchdict.get("id"))
    team = _get_team(request, request.matchdict.get("team_id"))

    if not user:
        request.response.status = "404 Not Found"
        return {"error": "No such user exists."}

    if user.opt_out and user.email != request.authenticated_userid:
        request.response.status = "404 Not Found"
        return {"error": "User has opted out."}

    return _user_team_json_generator(request, team, user)


@view_config(route_name="user_json", renderer="json")
def user_json(request):
    """Render user info JSON dump."""

    # So, here they can use their 'id' or their 'nickname'.
    # We'll try nickname first since we want to encourage that (or whatever)
    # and fall back to id if that fails.  If both fail, raise a 404.
    user = _get_user(request, request.matchdict.get("id"))

    if not user:
        request.response.status = "404 Not Found"
        return {"error": "No such user exists."}

    if user.opt_out and user.email != request.authenticated_userid:
        request.response.status = "404 Not Found"
        return {"error": "User has opted out."}

    return _user_json_generator(request, user)


@view_config(route_name="builder", renderer="builder.mak")
def builder(request):
    if request.authenticated_userid:
        awarded_assertions = request.db.get_assertions_by_email(request.authenticated_userid)
    else:
        awarded_assertions = None

    # set came_from so we can get back home after openid auth.
    request.session["came_from"] = request.route_url("builder")

    # get default creator field
    default_creator = None
    user = request.db.get_person(person_email=request.authenticated_userid)
    if user:
        default_creator = user.nickname or user.email

    badge_yaml = None
    if request.POST:
        token = request.session.get_csrf_token()
        if token != request.POST["csrf_token"]:
            raise HTTPForbidden("CSRF token did not match")
        badge_yaml = generate_badge_yaml(request.POST)

    return dict(
        auth_principals=request.effective_principals,
        awarded_assertions=awarded_assertions,
        default_creator=default_creator,
        badge_yaml=badge_yaml,
    )


@view_config(route_name="tags", renderer="tags.mak")
def tags(request):
    """Render tag page."""

    # Get awarded assertions.
    if request.authenticated_userid:
        awarded_assertions = request.db.get_assertions_by_email(request.authenticated_userid)
    else:
        awarded_assertions = None

    # Get badges matching tag.
    tags = [t.strip() for t in request.matchdict.get("tags").split(",")]
    if request.matchdict.get("match") == "all":
        badges = request.db.get_badges_from_tags(tags, match_all=True)
    else:
        badges = request.db.get_badges_from_tags(tags, match_all=False)

    return dict(
        tags=tags,
        badges=badges,
        auth_principals=request.effective_principals,
        awarded_assertions=awarded_assertions,
    )


@view_config(route_name="report", renderer="report.mak")
def report(request):
    """Render report page."""

    frame = "this week"

    start = get_start_week()
    stop = start + timedelta(days=6)

    user_to_rank = request.db._make_leaderboard(
        start=start,
        stop=stop,
    )

    return dict(
        auth_principals=request.effective_principals,
        user_to_rank=user_to_rank,
        start_date=start,
        stop_date=stop,
        frame=frame,
    )


@view_config(route_name="report_year", renderer="report.mak")
def report_year(request):
    """The leaderboard for a specific year."""

    frame = "year"

    ## TODO: how to make sure this doesn't break?
    year = int(request.matchdict.get("year"))

    start = date(year, 1, 1)
    stop = date(year, 12, 31)

    user_to_rank = request.db._make_leaderboard(
        start=start,
        stop=stop,
    )

    return dict(
        auth_principals=request.effective_principals,
        user_to_rank=user_to_rank,
        start_date=start,
        stop_date=stop,
        frame=frame,
    )


@view_config(route_name="report_year_month", renderer="report.mak")
def report_year_month(request):
    """The leaderboard for a specific month of a specific year."""

    frame = "month"

    ## TODO: how to make sure this doesn't break?
    year = int(request.matchdict.get("year"))
    month = int(request.matchdict.get("month"))

    now = datetime.now(timezone.utc)
    start = date(year, month, 1)
    if now.month == 12:
        stop = date(year + 1, 1, 1) - timedelta(days=1)
    else:
        stop = date(year, month + 1, 1) - timedelta(days=1)

    user_to_rank = request.db._make_leaderboard(
        start=start,
        stop=stop,
    )

    return dict(
        auth_principals=request.effective_principals,
        user_to_rank=user_to_rank,
        start_date=start,
        stop_date=stop,
        frame=frame,
    )


@view_config(route_name="report_year_month_day", renderer="report.mak")
def report_year_month_day(request):
    """The leaderboard for a specific month of a specific year."""

    frame = "day"

    ## TODO: how to make sure this doesn't break?
    year = int(request.matchdict.get("year"))
    month = int(request.matchdict.get("month"))
    day = int(request.matchdict.get("day"))

    start = date(year, month, day)
    stop = date(year, month, day) + timedelta(days=1)

    user_to_rank = request.db._make_leaderboard(
        start=start,
        stop=stop,
    )

    return dict(
        auth_principals=request.effective_principals,
        user_to_rank=user_to_rank,
        start_date=start,
        stop_date=stop,
        frame=frame,
    )


@view_config(route_name="report_year_week", renderer="report.mak")
def report_year_week(request):
    """The leaderboard for a specific week of a specific year."""

    frame = "week"

    ## TODO: how to make sure this doesn't break?
    year = int(request.matchdict.get("year"))
    week = int(request.matchdict.get("weeknumber"))

    # Get the week using the number of week
    start = date(year, 1, 1) + timedelta(weeks=week - 1)

    # Get the start of the week (as January 1st might not have been a Monday)
    start = get_start_week(start.year, start.month, start.day)
    stop = start + timedelta(days=6)

    user_to_rank = request.db._make_leaderboard(
        start=start,
        stop=stop,
    )

    return dict(
        auth_principals=request.effective_principals,
        user_to_rank=user_to_rank,
        start_date=start,
        stop_date=stop,
        frame=frame,
    )


@view_config(route_name="report_this_month")
def report_this_month(request):
    now = datetime.now(timezone.utc)
    year, month = now.year, now.month
    location = request.route_url("report_year_month", year=year, month=month)
    return HTTPFound(location=location)


@view_config(route_name="award_from_csv", permission="admin")
def award_from_csv(request):
    token = request.session.get_csrf_token()
    if token != request.POST["csrf_token"]:
        raise HTTPForbidden("CSRF token did not match")

    csv_file = request.POST["csv-file"].file
    successful_awards = 0
    """TODO: We need some validation here, and flash
    a message whether the awards were successful or not.
    This should be added at the same time that flash
    messages are added to the admin panel."""
    awards = dict()  # str(badge_id) : str(person_email)
    for line in csv_file:
        values = line.split(",")
        """Through the following if statement, it doesn't matter
        if the line has been entered as "email, badge" or
        "badge, email". The awards dict will be normalized
        to be "badge, email". This code assumes that one of the
        two values will be a valid email address."""
        if values[0].find("@") == -1:
            # If there is no @ sign in the first value, it is the badge id.
            awards[values[1].strip()] = values[0].strip()
        else:
            # If there is an @ sign in the first value, it is the email.
            awards[values[0].strip()] = values[1].strip()

    for email, badge_id in awards.items():
        # First, if the person doesn't exist, we automatically
        # create the person in this special case.
        if not request.db.person_exists(email=email):
            request.db.add_person(email)
        # Second, if the badge exists and the person has yet
        # to be awarded it, give it to them.
        if request.db.badge_exists(badge_id):
            if not request.db.assertion_exists(badge_id, email):
                # The None will default to datetime.now().
                request.db.add_assertion(badge_id, email, None)
                successful_awards += 1

    request.session.flash(f"Successfully awarded {successful_awards} badges.")
    return HTTPFound(location=request.route_url("admin"))


@view_config(context=str)
def html(context, request):
    return Response(context)


@view_config(context=m.Assertion, renderer="json")
def json(context, request):
    return context.as_dict()


@view_config(context="pyramid.httpexceptions.HTTPNotFound", renderer="404.mak")
def _404(request):
    request.response.status = 404
    return dict()


@view_config(context="pyramid.httpexceptions.HTTPServerError", renderer="500.mak")
def _500(request):
    request.response.status = 500
    return dict()


@view_config(route_name="assertion_widget", renderer="assertion_widget.mak")
def assertion_widget(request):
    person_id = request.matchdict.get("person")
    badge_id = request.matchdict.get("badge")
    user = request.db.get_person(id=person_id)
    if not user:
        raise HTTPNotFound(f"No such person {person_id!r}")

    def get_assertion():
        for assertion in user.assertions:
            if assertion.badge.id == badge_id:
                return assertion
        raise HTTPNotFound("User does not have that badge")

    assertion = get_assertion()
    return dict(assertion=assertion)


def modify_rst(rst):
    """Downgrade some of our rst directives if docutils is too old."""

    try:
        # The rst features we need were introduced in this version
        minimum = [0, 9]
        version = [int(elem) for elem in docutils.__version__.split(".")]

        # If we're at or later than that version, no need to downgrade
        if version >= minimum:
            return rst
    except Exception:
        # If there was some error parsing or comparing versions, run the
        # substitutions just to be safe.
        pass

    # Otherwise, make code-blocks into just literal blocks.
    substitutions = {
        ".. code-block:: javascript": "::",
    }
    for old, new in substitutions.items():
        rst = rst.replace(old, new)

    return rst


def modify_html(html):
    """Perform style substitutions where docutils doesn't do what we want."""

    substitutions = {
        '<tt class="docutils literal">': "<code>",
        "</tt>": "</code>",
    }
    for old, new in substitutions.items():
        html = html.replace(old, new)

    return html


def _load_docs(directory, endpoint):
    """Utility to load an RST file and turn it into fancy HTML."""

    fname = os.path.join(directory, endpoint + ".rst")
    with codecs.open(fname, "r", "utf-8") as f:
        rst = f.read()

    rst = modify_rst(rst)

    api_docs = docutils.examples.html_body(rst)

    api_docs = modify_html(api_docs)

    api_docs = markupsafe.Markup(api_docs)
    return api_docs


htmldocs = {}


def load_docs(request, key):
    possible_keys = ["about", "footer"]

    # Load from disk only once on first request.
    if not htmldocs:
        here = os.path.dirname(os.path.abspath(__file__))
        dflt = os.path.join(here, "sitedocs")
        directory = request.registry.settings.get("tahrir.sitedocs_dir", dflt)
        for k in possible_keys:
            htmldocs[k] = _load_docs(directory, k)

    if key not in htmldocs:
        raise KeyError(f"{key!r} is not permitted.")

    return htmldocs[key]


def get_start_week(year=None, month=None, day=None):
    """For a given date, retrieve the day the week started.
    For any missing parameters (ie: None), use the value of the current
    day.

    :kwarg year: year to consider when searching a week.
    :kwarg month: month to consider when searching a week.
    :kwarg day: day to consider when searching a week.
    :return a Date of the day the week started either based on the
        current utc date or based on the information.
    """
    now = datetime.now(timezone.utc)
    if not year:
        year = now.year
    if not month:
        month = now.month
    if not day:
        day = now.day
    week_day = date(year, month, day)
    week_start = week_day - timedelta(days=week_day.weekday())
    return week_start
