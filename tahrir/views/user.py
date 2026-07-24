from datetime import timezone
from decimal import Decimal, ROUND_UP

from feedgen.feed import FeedGenerator
from flask import abort, g, jsonify, url_for

from tahrir.utils.avatar import hash_email
from tahrir.utils.badge import badge_json_generator, sort_badges_by_tag
from tahrir.utils.user import get_person

from ..defaults import TAHRIR_DISPLAY_TAGS
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
    assertions = sorted(person.assertions, key=lambda item: item.issued_on, reverse=True)

    serialized = []
    classified = {name: [] for name in TAHRIR_DISPLAY_TAGS}

    for indx, item in enumerate(assertions):
        issued = {"issued": float(item.issued_on.strftime("%s"))}
        reason = {"reason": item.issued_for or None}
        rarity = {"rarity": item.badge.rarity.name if item.badge.rarity else None}
        badged = badge_json_generator(item.badge)
        serialized.append({**issued, **badged, **reason, **rarity})
        for name in classified.keys():
            if name in [tag.name for tag in item.badge.tags]:
                classified[name].append(indx)

    return {
        "user": person.nickname,
        "mail": hash_email(person.avatar),
        "percent_earned": user_info["percent_earned"],
        "classified": classified,
        "serialized": serialized,
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

    if not person:
        return {"error": "No such user exists."}, 404

    if person.opt_out and person.email != g.oidc_user.email:
        return {"error": "User has opted out."}, 404

    return jsonify(_user_team_json_generator(team, person))


@bp.route("/json/user/<user_id>")
def user_json(user_id):
    """Render user info JSON dump."""

    # So, here they can use their 'id' or their 'nickname'.
    # We'll try nickname first since we want to encourage that (or whatever)
    # and fall back to id if that fails. If both fail, raise a 404.
    person = get_person(user_id)

    if not person:
        return {"error": "No such user exists."}, 404

    if person.opt_out and person.email != g.oidc_user.email:
        return {"error": "User has opted out."}, 404

    return jsonify(_user_json_generator(person))
