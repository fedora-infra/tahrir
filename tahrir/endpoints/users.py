import sqlalchemy as sa
import tahrir_api.model as m
from flask import g, jsonify, request

from . import blueprint as bp


@bp.route("/api/users/search/<search_string>", methods=["GET"])
def search_users_by_string(search_string: str):
    """
    Search endpoint that returns users matching the search string
    """

    # We need to have a function for searching users in Tahrir API
    # Instead of doing this over here like this
    begin = request.args.get("begin", 0, type=int)
    limit = request.args.get("limit", 100, type=int)

    collection = (
        g.tahrirdb.get_all_persons()
        .filter(
            m.Person.opt_out.is_(False)
            & sa.func.lower(m.Person.nickname).like(f"%{search_string.lower()}%")
        )
        .all()
    )

    # Suggested function should also include pagination feature
    result = {
        "users": [
            {
                "id": item.id,
                "bio": item.bio if item.bio else None,
                "created_on": item.created_on.timestamp() if item.created_on else None,
                "email": item.avatar,
                "last_login": item.last_login.timestamp() if item.last_login else None,
                "nickname": item.nickname,
                "rank": item.rank,
                "website": item.website,
            }
            for item in collection[begin : begin + (limit if limit < 100 else 100)]
        ],
        "castup": len(collection),
    }

    return jsonify(result)
