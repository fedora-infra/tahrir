import json
import os
from datetime import timezone

import sqlalchemy as sa
import tahrir_api.model as m
from feedgen.feed import FeedGenerator
from flask import abort, current_app, g, jsonify, url_for

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
            | sa.func.lower(m.Badge.tags).like(f"%{search_query.lower()}%")
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
            "tags": (
                [tag.strip() for tag in badge.tags.split(",") if tag.strip()] if badge.tags else []
            ),
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
    Endpoint that reads and delivers the accolade rarities
    """

    data = {}
    try:
        with open(os.path.join(current_app.static_folder, "rarities.json")) as file:
            data = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        abort(500, "Mistaken or absent rarities file")

    if rare:
        if rare.upper() in data["rarity"]:
            rslt = []
            for item in data["rarity"][rare.upper()]:
                objc = g.tahrirdb.get_badge(item)
                if objc:
                    base = {
                        "desc": objc.description,
                        "name": objc.name,
                        "shot": objc.image,
                        "date": objc.created_on.timestamp(),
                    }
                    rslt.append({"id": item, **base, **data["badges"][item]})
                else:
                    continue
            return jsonify(rslt)
        else:
            abort(404, "No such rarity")
    else:
        rslt = {
            rare: [{"id": item, **data["badges"][item]} for item in data["rarity"][rare]]
            for rare in data["rarity"]
        }
        return jsonify(rslt)
