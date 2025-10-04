from flask import abort, g, jsonify, request

from ...app import csrf, oidc
from ...utils.user import require_admin
from . import blueprint as bp


@bp.route("/api/admin/users", methods=["POST"])
@csrf.exempt
@oidc.require_login
@require_admin
def add_user():
    """Endpoint to add a new user"""

    data = request.get_json()
    if not data:
        return abort(400, "No details provided")

    if not data.get("email"):
        return abort(400, "No email id is provided")

    if g.tahrirdb.person_exists(email=data.get("email")):
        abort(409, f"Person with email {data.get('email')!r} already exists.")

    g.tahrirdb.add_person(
        email=data.get("email"),
        nickname=data.get("nickname"),
        website=data.get("website"),
        bio=data.get("bio"),
        avatar=data.get("avatar"),
    )

    return jsonify({"message": f"User {data.get('email')!r} added successfully"}), 201
