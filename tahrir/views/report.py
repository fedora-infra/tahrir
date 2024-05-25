from datetime import date, datetime, timedelta, timezone

from flask import g, redirect, render_template, url_for

from tahrir.utils.date_time import get_start_week

from . import blueprint as bp


@bp.route("/report")
def report():
    """Render report page."""

    frame = "this week"

    start = get_start_week()
    stop = start + timedelta(days=6)

    user_to_rank = g.tahrirdb._make_leaderboard(
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

    user_to_rank = g.tahrirdb._make_leaderboard(
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
    # get the last day of the month
    stop = start + timedelta(days=32)
    stop.replace(day=1)
    stop = stop - timedelta(days=1)

    user_to_rank = g.tahrirdb._make_leaderboard(
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

    user_to_rank = g.tahrirdb._make_leaderboard(
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

    user_to_rank = g.tahrirdb._make_leaderboard(
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
