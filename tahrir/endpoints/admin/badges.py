from flask import abort, g, jsonify, request

from ...app import csrf, oidc
from ...utils.badge import convert_name_to_id
from ...utils.user import need_access_root, need_access_user
from . import blueprint as bp


@bp.route("/api/admin/badges", methods=["POST"])
@csrf.exempt
@oidc.accept_token()
@need_access_user
@need_access_root
def create_badge():
    """Endpoint to create new badge"""

    data = request.get_json()
    if not data:
        return abort(400, "No details provided")

    required_fields = ["name", "image", "description", "criteria", "issuer_id"]
    for field in required_fields:
        if not data.get(field):
            return abort(400, f"No detail provided for {field!r}")

    badge_id = convert_name_to_id(data.get("name"))

    if g.tahrirdb.badge_exists(badge_id):
        return abort(409, f"Badge {badge_id!r} already exists")

    g.tahrirdb.add_badge(
        name=data.get("name"),
        image=data.get("image"),
        desc=data.get("description"),
        criteria=data.get("criteria"),
        issuer_id=data.get("issuer_id"),
        tags=data.get("tags"),
    )

    return jsonify({"message": f"Badge {badge_id!r} created successfully"}), 201


@bp.route("/api/admin/badges/<string:badge_id>", methods=["PUT"])
@csrf.exempt
@oidc.accept_token()
@need_access_user
@need_access_root
def update_badge(badge_id):
    """Endpoint to update existing badge"""

    if not badge_id:
        return abort(400, "No badge ID provided")

    data = request.get_json()
    if not data:
        return abort(400, "No details provided")

    try:
        result = g.tahrirdb.update_badge(badge_id, **data)

        if not result:
            return abort(404, f"Badge {badge_id!r} not found")

        return jsonify({"message": f"Badge {badge_id!r} updated successfully"})

    except KeyError as e:
        return abort(400, str(e))


@bp.route("/api/admin/badges/<string:badge_id>", methods=["DELETE"])
@csrf.exempt
@oidc.accept_token()
@need_access_user
@need_access_root
def delete_badge(badge_id):
    """Endpoint to delete a badge"""

    if not badge_id:
        return abort(400, "No ID provided")

    try:
        result = g.tahrirdb.delete_badge(badge_id)
    except ValueError as e:
        return abort(403, str(e))

    if not result:
        return abort(404, f"Badge {badge_id!r} not found")

    return jsonify({"message": f"Badge {badge_id!r} deleted successfully"})
