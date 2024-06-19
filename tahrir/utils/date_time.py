import math
from datetime import date, datetime, timedelta, timezone

import dateutil.relativedelta


def get_start_week(year=None, month=None, day=None):
    """For a given date, retrieve the day the week started

    For any missing parameters (ie: None), use the value of the current
    day.

    Arguments:
        year (int): year to consider when searching a week.
        month (int): month to consider when searching a week.
        day (int): day to consider when searching a week.

    Returns:
        A Date of the day the week started either based on the
            current utc date or based on the information.

    """
    now = datetime.now(timezone.utc)
    if not year:
        year = now.year
    if not month:
        month = now.month
    if not day:
        day = now.day
    week_day = date(year, month, day)
    week_start = week_day - timedelta(days=week_day.weekday())
    return week_start


def singularize(term, value):
    """Strip the 's' off of plural words to dumbly singularize them."""
    if value == 1:
        return term[:-1]
    else:
        return term


def relative_time(value: datetime):
    SHORT_DENOMINATIONS = {
        "years": "yrs",
        "months": "mons",
        "days": "days",
        "hours": "hrs",
        "minutes": "mins",
        "seconds": "secs",
    }
    then_in_seconds = value.timestamp()
    now_in_seconds = datetime.now(timezone.utc).timestamp()
    delta = now_in_seconds - then_in_seconds

    if delta > 0:
        suffix = "ago"
    else:
        suffix = "from now"

    # time_strings = []
    rd = dateutil.relativedelta.relativedelta(seconds=math.fabs(delta))
    denominations = ["years", "months", "days", "hours", "minutes", "seconds"]
    for denomination in denominations:
        value = getattr(rd, denomination, 0)
        if value:
            return "%d %s %s" % (
                value,
                singularize(SHORT_DENOMINATIONS[denomination], value),
                suffix,
            )

    return "just now"
