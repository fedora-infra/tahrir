from datetime import date, timedelta

from flask import g, jsonify, request

from ..utils.avatar import hash_email
from . import blueprint as bp


@bp.route("/api/rankings", methods=["GET"])
@bp.route("/api/rankings/y/<int:year>", methods=["GET"])
@bp.route("/api/rankings/y/<int:year>/m/<int:month>", methods=["GET"])
@bp.route("/api/rankings/y/<int:year>/m/<int:month>/d/<int:day>", methods=["GET"])
@bp.route("/api/rankings/y/<int:year>/m/<int:month>/d/<int:day>/week", methods=["GET"])
def get_rankings(year=None, month=None, day=None):
    begin = request.args.get("begin", 0, type=int)
    limit = request.args.get("limit", 200, type=int)

    if request.path.endswith("/week"):
        week_day = date(year, month, day)
        start = week_day - timedelta(days=week_day.weekday())
        stop = start + timedelta(days=6)
    elif day is not None:
        start = date(year, month, day)
        stop = start + timedelta(days=1)
    elif month is not None:
        start = date(year, month, 1)
        stop = start + timedelta(days=32)
        stop = stop.replace(day=1) - timedelta(days=1)
    elif year is not None:
        start = date(year, 1, 1)
        stop = date(year, 12, 31)
    else:
        start = None
        stop = None

    user_to_rank = g.tahrirdb.make_leaderboard(start=start, stop=stop)
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
