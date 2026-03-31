from datetime import date, datetime, timedelta, timezone

from flask import g, jsonify, redirect, render_template, request, url_for

from tahrir.utils.avatar import hash_email
from tahrir.utils.date_time import get_start_week, last_day_of_calendar_month
from tahrir.utils.report_range import parse_custom_report_range

from . import blueprint as bp


@bp.route("/report")
def report():
    """Render report page."""

    frame = "this week"

    start = get_start_week()
    stop = start + timedelta(days=6)

    user_to_rank = g.tahrirdb.make_leaderboard(
        start=start,
        stop=stop,
    )

    return render_template(
        "report.html",
        user_to_rank=user_to_rank,
        start_date=start,
        stop_date=stop,
        frame=frame,
    )


@bp.route("/report/<int:year>")
def report_year(year):
    """The leaderboard for a specific year."""
    frame = "year"
    start = date(year, 1, 1)
    stop = date(year, 12, 31)

    user_to_rank = g.tahrirdb.make_leaderboard(
        start=start,
        stop=stop,
    )

    return render_template(
        "report.html",
        user_to_rank=user_to_rank,
        start_date=start,
        stop_date=stop,
        frame=frame,
    )


@bp.route("/report/<int:year>/<int:month>")
def report_year_month(year, month):
    """The leaderboard for a specific month of a specific year."""
    frame = "month"

    start = date(year, month, 1)
    stop = last_day_of_calendar_month(year, month)

    user_to_rank = g.tahrirdb.make_leaderboard(
        start=start,
        stop=stop,
    )

    return render_template(
        "report.html",
        user_to_rank=user_to_rank,
        start_date=start,
        stop_date=stop,
        frame=frame,
    )


@bp.route("/report/<int:year>/<int:month>/<int:day>")
def report_year_month_day(year, month, day):
    """The leaderboard for a specific month of a specific year."""
    frame = "day"

    start = date(year, month, day)
    stop = date(year, month, day) + timedelta(days=1)

    user_to_rank = g.tahrirdb.make_leaderboard(
        start=start,
        stop=stop,
    )

    return render_template(
        "report.html",
        user_to_rank=user_to_rank,
        start_date=start,
        stop_date=stop,
        frame=frame,
    )


@bp.route("/report/<int:year>/week/<int:week>")
def report_year_week(year, week):
    """The leaderboard for a specific week of a specific year."""
    frame = "week"

    # Get the week using the number of week
    start = date(year, 1, 1) + timedelta(weeks=week - 1)

    # Get the start of the week (as January 1st might not have been a Monday)
    start = get_start_week(start.year, start.month, start.day)
    stop = start + timedelta(days=6)

    user_to_rank = g.tahrirdb.make_leaderboard(
        start=start,
        stop=stop,
    )

    return render_template(
        "report.html",
        user_to_rank=user_to_rank,
        start_date=start,
        stop_date=stop,
        frame=frame,
    )


@bp.route("/report/this/month")
def report_this_month():
    now = datetime.now(timezone.utc)
    year, month = now.year, now.month
    location = url_for("tahrir.report_year_month", year=year, month=month)
    return redirect(location)


@bp.route("/report/range")
def report_custom_range():
    """HTML leaderboard for an inclusive start/end date (query: start, end as YYYY-MM-DD)."""
    start_q = request.args.get("start")
    end_q = request.args.get("end")

    if start_q is None and end_q is None:
        start_d = get_start_week()
        end_d = start_d + timedelta(days=6)
        user_to_rank = g.tahrirdb.make_leaderboard(
            start=start_d,
            stop=end_d,
        )
        return render_template(
            "report_range.html",
            start_value=start_d.isoformat(),
            end_value=end_d.isoformat(),
            start_date=start_d,
            stop_date=end_d,
            user_to_rank=user_to_rank,
            error=None,
        )

    if not start_q or not end_q:
        return (
            render_template(
                "report_range.html",
                start_value=start_q or "",
                end_value=end_q or "",
                start_date=None,
                stop_date=None,
                user_to_rank=None,
                error="Provide both start and end dates.",
            ),
            400,
        )

    try:
        start_d, end_d = parse_custom_report_range(start_q, end_q)
    except ValueError as err:
        return (
            render_template(
                "report_range.html",
                start_value=start_q,
                end_value=end_q,
                start_date=None,
                stop_date=None,
                user_to_rank=None,
                error=str(err),
            ),
            400,
        )

    user_to_rank = g.tahrirdb.make_leaderboard(
        start=start_d,
        stop=end_d,
    )
    return render_template(
        "report_range.html",
        start_value=start_d.isoformat(),
        end_value=end_d.isoformat(),
        start_date=start_d,
        stop_date=end_d,
        user_to_rank=user_to_rank,
        error=None,
    )


@bp.route("/json/report/range")
def json_report_custom_range():
    """JSON leaderboard for an inclusive start/end date (query: start, end as YYYY-MM-DD)."""
    start_q = request.args.get("start")
    end_q = request.args.get("end")
    if not start_q or not end_q:
        return (
            jsonify({"error": "Query parameters 'start' and 'end' are required (YYYY-MM-DD)."}),
            400,
        )
    try:
        start_d, end_d = parse_custom_report_range(start_q, end_q)
    except ValueError as err:
        return jsonify({"error": str(err)}), 400

    begin = int(request.args.get("begin", 0))
    limit = int(request.args.get("limit", 200))
    user_to_rank = g.tahrirdb.make_leaderboard(
        start=start_d,
        stop=end_d,
    )
    limited_users = list(user_to_rank)[begin : begin + limit]
    data = [
        {
            "mail": user.avatar,
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
        stop = last_day_of_calendar_month(year, month)
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
