from datetime import timezone

from feedgen.feed import FeedGenerator
from flask import url_for

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
