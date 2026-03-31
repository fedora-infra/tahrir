from datetime import datetime, timezone

import docutils.examples
import sqlalchemy as sa
import tahrir_api.model as m
from feedgen.feed import FeedGenerator
from flask import abort, flash, g, redirect, render_template, request, url_for

from tahrir.app import oidc
from tahrir.utils.avatar import get_avatar
from tahrir.utils.badge import get_badge_or_404

from . import blueprint as bp


@bp.route("/badge/<badge_id>")
@bp.route("/badge/<badge_id>/full", endpoint="badge_full")
def badge(badge_id):
    """Render badge info page."""
    template = (
        "badge_full.html"
        if (request.endpoint and request.endpoint.endswith("/full"))
        else "badge.html"
    )
    # Get the badge to render info about.
    badge = get_badge_or_404(badge_id)

    # Get badge statistics.
    # TODO: Perhaps abstract these statistics methods away somewhere?
    try:
        times_awarded = len(g.tahrirdb.get_assertions_by_badge(badge_id))
        last_awarded = (
            g.tahrirdb.get_all_assertions()
            .filter(sa.func.lower(m.Assertion.badge_id) == sa.func.lower(badge_id))
            .order_by(sa.desc(m.Assertion.issued_on))
            .limit(1)
            .one()
        )
        last_awarded_person = g.tahrirdb.get_person(id=last_awarded.person_id)

        first_awarded = (
            g.tahrirdb.get_all_assertions()
            .filter(sa.func.lower(m.Assertion.badge_id) == sa.func.lower(badge_id))
            .order_by(sa.asc(m.Assertion.issued_on))
            .limit(1)
            .one()
        )
        first_awarded_person = g.tahrirdb.get_person(id=first_awarded.person_id)

        percent_earned = float(times_awarded) / float(len(g.tahrirdb.get_all_persons().all()))

        # This is a list of assertions for this badge.
        badge_assertions = (
            g.tahrirdb.get_all_assertions().filter(m.Assertion.badge_id == badge.id).all()
        )
    except sa.orm.exc.NoResultFound:  # This badge has never been awarded.
        times_awarded = 0
        last_awarded = None
        last_awarded_person = None
        first_awarded = None
        first_awarded_person = None
        badge_assertions = []
        percent_earned = 0
    # Percent of people who have earned this badge

    # Get badge description HTML from RST.
    # Note: this html_body function wraps the output
    # in a <divclass="document">.
    badge_description_html = docutils.examples.html_body(badge.description)

    return render_template(
        template,
        badge=badge,
        badge_description_html=badge_description_html,
        times_awarded=times_awarded,
        last_awarded=last_awarded,
        last_awarded_person=last_awarded_person,
        first_awarded=first_awarded,
        first_awarded_person=first_awarded_person,
        badge_assertions=badge_assertions,
        percent_earned=percent_earned,
    )


@bp.route("/badge/<badge_id>/rss")
def badge_rss(badge_id):
    """Render per-badge rss."""
    badge = get_badge_or_404(badge_id)

    # this gives us the assertions sorted *earliest first*. feedgen's
    # default when adding entries is to prepend - put the new item at
    # the top of the feed. so as we iterate over this and add items to
    # the feed, we add each newer assertion to the front of the feed
    sorted_assertions = sorted(badge.assertions, key=lambda x: x.issued_on)

    feed = FeedGenerator()
    feed.title(f"Badges Feed for {badge.name}")
    feed.link(href=url_for("tahrir.badge", badge_id=badge.id, _external=True), rel="self")
    feed.subtitle(f"Latest recipients of the badge {badge.name}")
    feed.language("en")

    description_template = "<img src='%s' alt='%s' />%s"

    for assertion in sorted_assertions:
        url = url_for(
            "tahrir.user", user_id=assertion.person.nickname or assertion.person.id, _external=True
        )
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

    return feed.rss_str(pretty=True), {
        "content-type": "application/rss+xml",
        "charset": "utf-8",
    }


@bp.route("/badge/<badge_id>/stl")
def badge_stl(badge_id):
    """Render per-badge stl."""
    badge = get_badge_or_404(badge_id)

    if not badge.stl:
        abort(404, "Badge has no stl file.")

    return render_template(
        "thingiview.html",
        badge=badge,
    )


@bp.route("/tags/<tags>/<match>")
def tags(tags, match):
    """Render tag page."""
    # Get badges matching tag.
    tags = [t.strip() for t in tags.split(",")]
    match_all = match == "all"
    badges = g.tahrirdb.get_badges_from_tags(tags, match_all=match_all)
    return render_template(
        "tags.html",
        tags=tags,
        badges=badges,
    )


# delegated admin endpoints

@bp.route("/award", methods=["POST"])
@oidc.require_login
def award():
    badge_id = request.form.get("badge_id")
    badge = g.tahrirdb.get_badge(badge_id)
    if not badge:
        abort(404, f"No such badge {badge_id!r}")

    if not badge.authorized(g.oidc_user.person):
        abort(403, f"Unauthorized for {badge_id!r}")

    nickname = request.form.get("nickname")
    user = g.tahrirdb.get_person(nickname=nickname)
    if not user or user.opt_out:
        abort(404, f"No such user {nickname!r}")

    if g.tahrirdb.assertion_exists(badge.id, user.email):
        flash(f"User {user.nickname} already has the {badge.id} badge")
    else:
        g.tahrirdb.add_assertion(badge.id, user.email, None)
        flash(f"User {user.nickname} has been awarded the {badge.id} badge")

    # COMMENT

    return redirect(url_for("tahrir.badge", badge_id=badge.id))

@bp.route("/invite", methods=["POST"])
@oidc.require_login
def invite():
    agent = g.oidc_user.person
    badge_id = request.form.get("badge_id")
    badge = g.tahrirdb.get_badge(badge_id)
    if not badge:
        abort(404, f"No such badge {badge_id!r}")

    if not badge.authorized(agent):
        abort(403, f"Unauthorized for {badge_id!r}")

    try:
        fmt = "%Y-%m-%d %H:%M"
        expires_on = datetime.strptime(request.form.get("expires-on"), fmt)
    except ValueError:
        expires_on = None  # Will default to 1 hour from now

    # OK
    g.tahrirdb.add_invitation(badge.id, expires_on=expires_on, created_by_email=agent.email)

    return redirect(url_for("tahrir.user", user_id=agent.id))
