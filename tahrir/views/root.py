from datetime import date, datetime, timedelta, timezone

import sqlalchemy as sa
import tahrir_api.model as m
from flask import g, render_template

from tahrir.utils.date_time import get_start_week
from tahrir.utils.docs import load_docs

from . import blueprint as bp


@bp.route("/")
def home():
    n = 5  # n is the number of items displayed in each column.

    latest_awards_query = (
        sa.select(m.Assertion)
        .join(m.Person)
        .filter(m.Person.opt_out.is_(False))
        .order_by(sa.desc(m.Assertion.issued_on))
        .limit(n)
    )
    latest_awards = g.tahrirdb.session.scalars(latest_awards_query)

    start = get_start_week()
    stop = start + timedelta(days=6)
    weekly_leaders = g.tahrirdb._make_leaderboard(
        start=start,
        stop=stop,
    )

    now = datetime.now(timezone.utc)
    start = date(now.year, now.month, 1)
    if now.month == 12:
        stop = date(now.year + 1, 1, 1) - timedelta(days=1)
    else:
        stop = date(now.year, now.month + 1, 1) - timedelta(days=1)
    monthly_leaders = g.tahrirdb._make_leaderboard(
        start=start,
        stop=stop,
    )

    return render_template(
        "index.html",
        latest_awards=latest_awards,
        weekly_leaders=weekly_leaders,
        monthly_leaders=monthly_leaders,
        n=n,
    )


@bp.route("/about")
def about():
    return render_template(
        "about.html",
        content=load_docs("about"),
    )
