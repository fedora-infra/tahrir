from flask import abort, g, jsonify, request

from ...app import csrf, oidc
from ...utils.user import require_admin
from . import blueprint as bp


@bp.route("/api/admin/assertions", methods=["POST"])
@csrf.exempt
@oidc.require_login
@require_admin
def create_assertion():
    """Endpoint to create a new assertion (award badge)."""

    data = request.get_json()
    if not data:
        return abort(400, "No details provided")

    required_fields = ["badge_id", "person_email"]
    for field in required_fields:
        if not data.get(field):
            return abort(400, f"No detail provided for {field!r}")

    badge_id = data.get("badge_id")
    person_email = data.get("person_email")

    # Check if assertion already exists
    if g.tahrirdb.assertion_exists(badge_id, person_email):
        return abort(409, f"User {person_email!r} already has badge {badge_id!r}")

    result = g.tahrirdb.add_assertion(
        badge_id=badge_id,
        person_email=person_email,
        issued_on=data.get("issued_on"),
        issued_for=data.get("issued_for"),
    )

    if not result:
        return abort(400, "Failed to create assertion")

    return jsonify({"message": f"Badge {badge_id!r} awarded to {person_email!r}"}), 201
