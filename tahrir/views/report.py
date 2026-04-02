from datetime import date, datetime, timedelta, timezone

from flask import g, jsonify, redirect, request, url_for

from tahrir.utils.avatar import hash_email
from tahrir.utils.date_time import get_start_week

from . import blueprint as bp


@bp.route("/report/this/month")
def report_this_month():
    now = datetime.now(timezone.utc)
    year, month = now.year, now.month
    location = url_for("tahrir.report_year_month", year=year, month=month)
    return redirect(location)


@bp.route("/json/report")
@bp.route("/json/report/y/<int:year>")
@bp.route("/json/report/y/<int:year>/m/<int:month>")
@bp.route("/json/report/y/<int:year>/m/<int:month>/d/<int:day>")
@bp.route("/json/report/y/<int:year>/m/<int:month>/d/<int:day>/week")
def json_report_year(year=None, week=None, month=None, day=None):
    """The leaderboard."""
    begin = int(request.args.get("begin", 0))
    limit = int(request.args.get("limit", 200))
    if request.path.endswith("/week"):
        # Weekly report
        start = get_start_week(year, month, day)
        stop = start + timedelta(days=6)
    elif day is not None:
        # Daily report
        start = date(year, month, day)
        stop = start + timedelta(days=1)
    elif week is not None:
        # Weekly report
        max_week = date(year, 12, 31).isocalendar()[1]
        if 0 < week < max_week:
            start = date(year, 1, 1) + timedelta(weeks=week - 1)
            start = get_start_week(start.year, start.month, start.day)
            stop = start + timedelta(days=6)
        else:
            raise ValueError()
    elif month is not None:
        # Monthly report
        start = date(year, month, 1)
        stop = start + timedelta(days=32)
        stop = stop.replace(day=1)
        stop = stop - timedelta(days=1)
    elif year is not None:
        # Yearly report
        start = date(year, 1, 1)
        stop = date(year, 12, 31)
    else:
        # Default: Complete list
        start = None
        stop = None

    # TODO: Modify make_leaderboard to add filter
    user_to_rank = g.tahrirdb.make_leaderboard(
        start=start,
        stop=stop,
    )

    limited_users = list(user_to_rank)[begin : begin + limit]

    data = [
        {
            "mail": hash_email(user.avatar),
            "nickname": user.nickname,
            "badges": user_to_rank[user]["badges"],
            "rank": {
                "global": user.rank,
                "period": user_to_rank[user]["rank"],
            },
        }
        for user in limited_users
    ]
    return jsonify(data)
