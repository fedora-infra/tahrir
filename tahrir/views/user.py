from datetime import timezone

from feedgen.feed import FeedGenerator
from flask import abort, g, url_for

from tahrir.utils.user import get_person

from . import blueprint as bp

FEED_CURB = 50


@bp.route("/rss/users/<user_id>")
def user_rss(user_id):
    """Render per-user rss."""

    person = get_person(user_id)

    if not person:
        abort(404, f"No such user {user_id!r}")

    if person.opt_out and person.email != g.oidc_user.email:
        abort(404, f"User {user_id!r} has opted out.")

    recent = sorted(person.assertions, key=lambda x: x.issued_on, reverse=True)[:FEED_CURB]

    feed = FeedGenerator()
    feed.title(f"Badges Feed for {person.nickname}")
    feed.link(
        href=url_for("tahrir.user", user_id=person.nickname or person.id, _external=True),
        rel="self",
    )
    feed.subtitle(f"The latest Fedora Badges obtained by {person.nickname}")
    feed.language("en")

    description_template = "<img src='%s' alt='%s'/>%s -- %s"

    for assertion in reversed(recent):
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
