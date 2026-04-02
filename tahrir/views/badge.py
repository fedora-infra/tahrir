from datetime import datetime, timezone

from feedgen.feed import FeedGenerator
from flask import abort, flash, g, redirect, request, url_for

from tahrir.utils.avatar import get_avatar
from tahrir.utils.badge import get_badge_or_404

from . import blueprint as bp


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


# delegated admin endpoints


@bp.route("/award", methods=["POST"])
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

    return redirect(url_for("tahrir.badge", badge_id=badge.id))


@bp.route("/invite", methods=["POST"])
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

    return redirect(url_for("tahrir.home"))
