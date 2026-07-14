from datetime import timezone

import sqlalchemy as sa
import tahrir_api.model as m
from feedgen.feed import FeedGenerator
from flask import abort, g, jsonify, url_for

from ..utils.avatar import hash_email
from . import blueprint as bp


@bp.route("/json/search/<search_query>", methods=["GET"])
def json_explore(search_query):
    """
    Global search endpoint that returns users and badges.
    Returns a dictionary containing all available users and badges.
    """

    # Get all badges
    all_badges = (
        g.tahrirdb.get_all_badges()
        .filter(
            sa.func.lower(m.Badge.name).like(f"%{search_query.lower()}%")
            | sa.func.lower(m.Badge.description).like(f"%{search_query.lower()}%")
            | m.Badge.tags.any(sa.func.lower(m.Tag.name).like(f"%{search_query.lower()}%"))
        )
        .all()
    )
    badges_data = [
        {
            "id": badge.id,
            "created_on": badge.created_on.timestamp() if badge.created_on else None,
            "description": badge.description,
            "image": badge.image,
            "name": badge.name,
            "tags": [tag.name for tag in badge.tags],
        }
        for badge in all_badges
    ]

    # Get all users (persons who haven't opted out)
    all_persons = (
        g.tahrirdb.get_all_persons()
        .filter(
            m.Person.opt_out.is_(False)
            & sa.func.lower(m.Person.nickname).like(f"%{search_query.lower()}%")
        )
        .all()
    )
    users_data = [
        {
            "id": person.id,
            "bio": person.bio if person.bio else None,
            "created_on": person.created_on.timestamp() if person.created_on else None,
            "email": hash_email(person.avatar),
            "last_login": person.last_login.timestamp() if person.last_login else None,
            "nickname": person.nickname,
            "rank": person.rank,
            "website": person.website,
        }
        for person in all_persons
    ]

    return jsonify({"users": users_data, "badges": badges_data})


@bp.route("/explore/badges/rss")
def explore_badges_rss():
    """Render rss feed for the latest badges."""

    newest_badges = sorted(
        g.tahrirdb.get_all_badges().all(), key=lambda badge: badge.created_on, reverse=True
    )[:20]

    feed = FeedGenerator()
    feed.title("Newest badges Feed")
    feed.link(href=url_for("tahrir.explore_badges_rss", _external=True), rel="self")
    feed.subtitle("Latest badges of the application")
    feed.language = "en"

    description_template = "<img src='%s' alt='%s' />%s"

    for badge in newest_badges:
        url = url_for("tahrir.badge", badge_id=badge.id, _external=True)
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

    return feed.rss_str(pretty=True), {
        "content-type": "application/rss+xml",
        "charset": "utf-8",
    }


@bp.route("/json/rarities", methods=["GET"])
@bp.route("/json/rarities/<rare>", methods=["GET"])
def json_rarities(rare=None):
    """
    Endpoint that delivers the accolade rarities from the database.
    """

    person_poll = g.tahrirdb.get_all_persons().count()
    awards_poll = dict(
        g.tahrirdb.session.query(
            m.Assertion.badge_id,
            sa.func.count(m.Assertion.id),
        )
        .group_by(m.Assertion.badge_id)
        .all()
    )

    def _rarity_data(badge):
        poll = awards_poll.get(badge.id, 0)
        rate = poll / person_poll * 100 if person_poll else 0
        return {
            "id": badge.id,
            "name": badge.name,
            "desc": badge.description,
            "shot": badge.image,
            "date": badge.created_on.timestamp(),
            "poll": poll,
            "rate": rate,
            "rare": badge.rarity.name if badge.rarity else None,
        }

    if rare:
        rarity_objc = g.tahrirdb.session.query(m.Rarity).filter_by(name=rare.upper()).first()
        if not rarity_objc:
            abort(404, "No such rarity")
        return jsonify([_rarity_data(b) for b in rarity_objc.badges])
    else:
        rarity_full = g.tahrirdb.session.query(m.Rarity).all()
        return jsonify({r.name: [_rarity_data(b) for b in r.badges] for r in rarity_full})
