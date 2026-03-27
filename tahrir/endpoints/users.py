from authlib.integrations.flask_oauth2 import current_token
from flask import abort, g, jsonify, request

from ..app import csrf, oidc
from ..utils.avatar import hash_email
from ..utils.user import create_person, get_person, get_user_badge_info, require_login
from . import blueprint as bp


@bp.route("/api/users/search/<search_string>", methods=["GET"])
def search_users_by_string(search_string: str):
    """Search endpoint that returns users matching the search string"""
    begin = request.args.get("begin", 0, type=int)
    limit = request.args.get("limit", 100, type=int)

    result = g.tahrirdb.get_persons_by_nickname(search_string, begin, limit)

    result["users"] = [
        {
            "user": {
                "id": person.id,
                "nickname": person.nickname,
                "email": person.email,
                "website": person.website,
                "bio": person.bio,
                "rank": person.rank,
                "avatar": hash_email(person.email),
                "created_on": (person.created_on.timestamp() if person.created_on else None),
            }
        }
        for person in result["users"]
    ]
    return jsonify(result)


@bp.route("/api/users/<string:user_id>", methods=["GET"])
def get_user_by_id(user_id: str):
    """Endpoint to fetch the user based on matching id."""

    user = get_person(user_id)

    if not user:
        abort(404, f"No such user {user_id!r}")

    if user.opt_out and user.email != g.oidc_user.email:
        abort(404, f"User {user_id!r} has opted out.")

    # Get badge info using utility function
    badges_info = get_user_badge_info(user)

    return jsonify(
        {
            "user": {
                "nickname": user.nickname,
                "mail": hash_email(user.avatar),
                "created_on": user.created_on if user.created_on else None,
                "opt_out": user.opt_out,
                "rank": badges_info["rank"],
            },
            **badges_info,
        }
    )


@bp.route("/api/users/opt_out", methods=["PUT"])
@require_login
def user_opt_out():
    """Endpoint to update user account settings."""

    data = request.get_json()
    if not data.get("opt_out"):
        abort(400, "No data provided")

    g.oidc_user.person.opt_out = data.get("opt_out")
    g.tahrirdb.session.commit()

    return jsonify({"message": "User updated successfully"})


@bp.route("/api/users/diff/<string:id_a>/<string:id_b>", methods=["GET"])
@require_login
def get_user_diff(id_a: str, id_b: str):
    """Endpoint to compare badges between two users."""

    user_a = get_person(id_a)
    user_b = get_person(id_b)

    if not user_a:
        abort(404, f"No such user {id_a!r}")
    if not user_b:
        abort(404, f"No such user {id_b!r}")

    if user_a.opt_out and user_a.email != g.oidc_user.email:
        abort(404, f"User {id_a!r} has opted out.")
    if user_b.opt_out and user_b.email != g.oidc_user.email:
        abort(404, f"User {id_b!r} has opted out.")

    if user_a.email != g.oidc_user.email:
        abort(401)

    # Get badge info using utility function
    user_a_info = get_user_badge_info(user_a)
    user_b_info = get_user_badge_info(user_b)

    # Get raw badge objects for diffing
    user_a_badges = [a.badge for a in user_a.assertions]
    user_b_badges = [a.badge for a in user_b.assertions]

    # Diff badges
    user_a_unique_badges = []
    user_b_unique_badges = []
    combined_badges = list(sorted(set(user_a_badges + user_b_badges), key=lambda badge: badge.id))
    shared_badges = []
    for badge in combined_badges:
        if badge in user_a_badges and badge not in user_b_badges:
            user_a_unique_badges.append(badge)
        elif badge in user_b_badges and badge not in user_a_badges:
            user_b_unique_badges.append(badge)
        elif badge in user_a_badges and badge in user_b_badges:
            shared_badges.append(badge)

    return jsonify(
        {
            "user_a": {
                "id": user_a.id,
                "nickname": user_a.nickname,
                "avatar": hash_email(user_a.avatar),
                "badges_count": len(user_a_info["badges"]),
                "percent_earned": user_a_info["percent_earned"],
                "rank": user_a_info["rank"],
                "percentile": user_a_info["percentile"],
            },
            "user_b": {
                "id": user_b.id,
                "nickname": user_b.nickname,
                "avatar": hash_email(user_b.avatar),
                "badges_count": len(user_b_info["badges"]),
                "percent_earned": user_b_info["percent_earned"],
                "rank": user_b_info["rank"],
                "percentile": user_b_info["percentile"],
            },
            "user_a_badges": user_a_info["badges"],
            "user_b_badges": user_b_info["badges"],
            "user_a_unique_badges": [
                b
                for b in user_a_info["badges"]
                if any(ub.id == b["id"] for ub in user_a_unique_badges)
            ],
            "user_b_unique_badges": [
                b
                for b in user_b_info["badges"]
                if any(ub.id == b["id"] for ub in user_b_unique_badges)
            ],
            "shared_badges": [
                b for b in user_a_info["badges"] if any(sb.id == b["id"] for sb in shared_badges)
            ],
        }
    )


@bp.route("/api/users/", methods=["POST"])
@csrf.exempt
@oidc.accept_token()
def after_login():
    """Create the person if it does not exist."""
    if not request.authorization:
        abort(403)
    current_token["access_token"] = request.authorization.token
    profile = g._oidc_auth.userinfo(token=current_token)
    create_person(profile["preferred_username"], profile["email"])
    person = g.tahrirdb.get_person(person_email=profile["email"])
    if not person:
        abort(404)
    return jsonify(person.as_dict())
