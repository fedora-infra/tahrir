from datetime import date, datetime, timedelta, timezone
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
