import random
from datetime import date, timedelta, timezone

import sqlalchemy as sa
import tahrir_api.model as m
from feedgen.feed import FeedGenerator
from flask import g, redirect, render_template, request, url_for

from ..utils.badge import sort_badges_by_tag
from . import blueprint as bp


@bp.route("/explore", methods=["GET", "POST"])
def explore():
    # Check if a search has been done, and if so, show
    # search results.
    search_query = None
    search_results = dict()  # name: link
    if request.method == "POST":
        if request.form.get("badge-search"):
            # badge-query is a required field on the template form.
            search_query = request.form.get("badge-query")
            matching_results = (
                g.tahrirdb.get_all_badges()
                .filter(
                    sa.func.lower(m.Badge.name).like("%" + search_query + "%")
                    | sa.func.lower(m.Badge.description).like("%" + search_query + "%")
                    | sa.func.lower(m.Badge.tags).like("%" + search_query + "%")
                )
                .all()
            )
            for r in matching_results:
                search_results[r.name] = url_for("tahrir.badge", badge_id=r.id)
        elif request.form.get("person-search"):
            # person-query is a required field on the template form.
            search_query = request.form.get("person-query")
            matching_results = (
                g.tahrirdb.get_all_persons()
                .filter(
                    (m.Person.nickname.like("%" + search_query + "%"))
                    & (m.Person.opt_out.is_(False))
                )
                .all()
            )
            for r in matching_results:
                search_results[r.nickname] = url_for("tahrir.user", user_id=r.nickname)
        elif request.form.get("tag-search"):
            # tag-query is a required field on the template form.
            search_query = request.form.get("tag-query")
            if request.form.get("tag-match-all"):
                return redirect(url_for("tahrir.tags", tags=search_query, match="all"))
            else:
                return redirect(url_for("tahrir.tags", tags=search_query, match="any"))

    # Get some random badges (for discovery).
    try:
        random_badges = random.sample(g.tahrirdb.get_all_badges().all(), 5)
    except ValueError:  # the sample is probably larger than the population
        random_badges = g.tahrirdb.get_all_badges().all()

    # Get some random persons (for discovery).
    try:
        random_persons = random.sample(
            g.tahrirdb.get_all_persons().filter(m.Person.opt_out.is_(False)).all(), 5
        )
    except ValueError:  # the sample is probably larger than the population
        random_persons = g.tahrirdb.get_all_persons().filter(m.Person.opt_out.is_(False)).all()

    return render_template(
        "explore.html",
        random_badges=random_badges,
        random_persons=random_persons,
        search_results=search_results,
        search_query=search_query,
        example_date=date.today() - timedelta(days=31),
    )


@bp.route("/explore/badges")
def explore_badges():
    all_badges = g.tahrirdb.get_all_badges().all()
    newest_badges = sorted(all_badges, key=lambda badge: badge.created_on, reverse=True)[:20]

    all_badges_by_tag, all_uncategorized = sort_badges_by_tag(all_badges)
    newest_badges_by_tag, newest_uncategorized = sort_badges_by_tag(newest_badges)

    return render_template(
        "explore_badges.html",
        all_badges=all_badges,
        all_badges_by_tag=all_badges_by_tag,
        all_uncategorized=all_uncategorized,
        newest_badges_by_tag=newest_badges_by_tag,
        newest_uncategorized=newest_uncategorized,
        newest_badges=newest_badges,
    )


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
