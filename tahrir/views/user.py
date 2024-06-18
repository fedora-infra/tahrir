from datetime import datetime, timezone
from decimal import Decimal, ROUND_UP

from feedgen.feed import FeedGenerator
from flask import abort, g, jsonify, render_template, request, url_for

from tahrir.utils.avatar import get_avatar
from tahrir.utils.badge import badge_json_generator, sort_badges_by_tag
from tahrir.utils.user import get_person

from . import blueprint as bp


def _get_user_badge_info(person):
    """Returns a dictionary of the user badge information"""

    # Get user badges.
    user_badges = [a.badge for a in person.assertions]

    # Sort user badges by id.
    user_badges = sorted(user_badges, key=lambda badge: badge.id)

    # Get total number of unique badges in the system.
    count_total_badges = g.tahrirdb.get_all_badges().count()

    # Get percentage of badges earned.
    try:
        percent_earned = (float(len(user_badges)) / float(count_total_badges)) * 100
    except ZeroDivisionError:
        percent_earned = 0

    # Get rank. (same code found in leaderboard view function)
    rank = person.rank or 0
    user_count = g.tahrirdb.get_all_persons().count()

    try:
        percentile = (
            Decimal(float(rank) / float(user_count)).quantize(Decimal(".0001"), rounding=ROUND_UP)
            * 100
        )
    except ZeroDivisionError:
        percentile = 0

    badges_by_tag, uncategorized_badges = sort_badges_by_tag(user_badges)

    return dict(
        user_badges=user_badges,
        count_total_badges=count_total_badges,
        percent_earned=percent_earned,
        rank=rank,
        user_count=user_count,
        percentile=percentile,
        badges_by_tag=badges_by_tag,
        uncategorized_badges=uncategorized_badges,
    )


@bp.route("/user/<user_id>", methods=["GET", "POST"])
def user(user_id):
    """Render user info page."""

    person = get_person(user_id)

    try:
        history_limit = int(request.args.get("history_limit", 10))
    except ValueError as e:
        abort(400, f"Wrong value for the 'history_limit' parameter: {e}")

    if not person:
        abort(404, f"No such user {user_id!r}")

    if person.opt_out and person.email != g.oidc_user.email:
        abort(404, f"User {user_id!r} has opted out.")

    if request.method == "POST":
        # Authz check
        if g.oidc_user.email != person.email:
            abort(403, "Unauthorized")

        if g.oidc_user.person is None:
            abort(404, f"Person with email {g.oidc_user.email} not found")

        if request.form.get("deactivate-account"):
            g.oidc_user.person.opt_out = True
        elif request.form.get("reactivate-account"):
            g.oidc_user.person.opt_out = False

    # Get invitations the user has created.
    invitations = [
        i for i in g.tahrirdb.get_invitations(person.id) if i.expires_on > datetime.now()
    ]

    user_info = dict(
        user=person,
        invitations=invitations,
        history_limit=history_limit,
    )

    user_info.update(_get_user_badge_info(person))

    return render_template("user.html", **user_info)


@bp.route("/user/<user_id>/rss")
def user_rss(user_id):
    """Render per-user rss."""

    person = get_person(user_id)

    if not person:
        abort(404, f"No such user {user_id!r}")

    if person.opt_out and person.email != g.oidc_user.email:
        abort(404, f"User {user_id!r} has opted out.")

    # this gives us the assertions sorted *earliest first*. feedgen's
    # default when adding entries is to prepend - put the new item at
    # the top of the feed. so as we iterate over this and add items to
    # the feed, we add each newer assertion to the front of the feed
    sorted_assertions = sorted(person.assertions, key=lambda x: x.issued_on)

    feed = FeedGenerator()
    feed.title(f"Badges Feed for {person.nickname}")
    feed.link(
        href=url_for("tahrir.user", user_id=person.nickname or person.id, _external=True),
        rel="self",
    )
    feed.subtitle(f"The latest Fedora Badges obtained by {person.nickname}")
    feed.language("en")

    description_template = "<img src='%s' alt='%s'/>%s -- %s"

    for assertion in sorted_assertions:
        entry = feed.add_entry()
        entry.title(assertion.badge.name)
        entry.link(href=url_for("tahrir.badge", badge_id=assertion.badge.id, _external=True))
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

    return feed.rss_str(pretty=True), {
        "content-type": "application/rss+xml",
        "charset": "utf-8",
    }


def _user_json_generator(person):
    """Generates a json of user data"""
    user_info = _get_user_badge_info(person)

    assertions = []
    for assertion in person.assertions:
        issued = {"issued": float(assertion.issued_on.strftime("%s"))}
        _badged = badge_json_generator(assertion.badge, withasserts=False)
        assertions.append({**issued, **_badged})

    return {
        "user": person.nickname,
        "avatar": get_avatar(person.avatar, int(request.args.get("size", 100))),
        "percent_earned": user_info["percent_earned"],
        "assertions": assertions,
        "percentile": str(user_info["percentile"]),
        "rank": user_info["rank"],
        "user_count": user_info["user_count"],
    }


def _user_team_json_generator(team, person):
    """Generate the json of team data"""
    team_id = team.id
    badges = g.tahrirdb.get_badges_from_team(team_id)
    badges_count = len(badges)

    series = g.tahrirdb.get_series_from_team(team_id)
    assertions = person.assertions
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


@bp.route("/user/<user_id>/team/<int:team_id>/json")
def user_team_json(user_id, team_id):
    """Render user team info as JSON dump."""

    person = get_person(user_id)
    team = g.tahrirdb.get_team(team_id=team_id)

    if not user:
        return {"error": "No such user exists."}, 404

    if person.opt_out and person.email != g.oidc_user.email:
        return {"error": "User has opted out."}, 404

    return jsonify(_user_team_json_generator(team, person))


@bp.route("/user/<user_id>/json")
def user_json(user_id):
    """Render user info JSON dump."""

    # So, here they can use their 'id' or their 'nickname'.
    # We'll try nickname first since we want to encourage that (or whatever)
    # and fall back to id if that fails.  If both fail, raise a 404.
    person = get_person(user_id)

    if not person:
        return {"error": "No such user exists."}, 404

    if person.opt_out and person.email != g.oidc_user.email:
        return {"error": "User has opted out."}, 404

    return jsonify(_user_json_generator(person))


@bp.route("/diff/<id_a>/<id_b>")
def diff(id_a, id_b):
    """Render user diff page."""

    user_a = get_person(id_a)
    user_b = get_person(id_b)

    if not user_a:
        raise abort(404, f"No such user {id_a!r}")
    if not user_b:
        raise abort(404, f"No such user {id_b!r}")

    if user_a.opt_out and user_a.email != g.oidc_user.email:
        raise abort(404, f"User {id_a!r} has opted out.")
    if user_b.opt_out and user_b.email != g.oidc_user.email:
        raise abort(404, f"User {id_b!r} has opted out.")

    # Get user badges.
    user_a_badges = [a.badge for a in user_a.assertions]
    user_b_badges = [a.badge for a in user_b.assertions]

    # Sort user badges by id.
    user_a_badges = sorted(user_a_badges, key=lambda badge: badge.id)
    user_b_badges = sorted(user_b_badges, key=lambda badge: badge.id)

    # Get total number of unique badges in the system.
    count_total_badges = len(g.tahrirdb.get_all_badges().all())

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
    user_count = g.tahrirdb.get_all_persons().count()

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

    return render_template(
        "diff.html",
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


@bp.route("/_w/assertion/<int:person_id>/<badge_id>")
def assertion_widget(person_id, badge_id):
    user = g.tahrirdb.get_person(id=person_id)
    if not user:
        abort(404, f"No such person {person_id!r}")

    def get_assertion():
        for assertion in user.assertions:
            if assertion.badge.id == badge_id:
                return assertion
        abort(404, "User does not have that badge")

    return render_template("assertion_widget.html", assertion=get_assertion())
