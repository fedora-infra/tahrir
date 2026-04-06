from datetime import datetime, timezone

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

    required_fields = ["badge_id", "username"]
    for field in required_fields:
        if not data.get(field):
            return abort(400, f"No detail provided for {field!r}")

    badge_id = data.get("badge_id")
    username = data.get("username")

    # TODO: Modularize this to variable
    person_email = f"{username}@fedoraproject.org"

    issued_on = data.get("issued_on")
    if issued_on is not None:
        try:
            issued_on = datetime.fromtimestamp(issued_on, tz=timezone.utc)
        except (ValueError, TypeError, OSError):
            return abort(400, "Invalid issued_on timestamp")

    # Check if assertion already exists
    if g.tahrirdb.assertion_exists(badge_id, person_email):
        return abort(409, f"User {person_email!r} already has badge {badge_id!r}")

    result = g.tahrirdb.add_assertion(
        badge_id=badge_id,
        person_email=person_email,
        issued_on=issued_on,
        issued_for=data.get("issued_for"),
    )

    if not result:
        return abort(400, "Failed to create assertion")

    return jsonify({"message": f"Badge {badge_id!r} awarded to {person_email!r}"}), 201


@bp.route("/api/admin/assertions", methods=["DELETE"])
@csrf.exempt
@oidc.require_login
@require_admin
def remove_assertion():
    """Endpoint to remove an assertion (retract awarded badge)."""

    data = request.get_json()
    if not data:
        return abort(400, "No details provided")

    required_fields = ["badge_id", "username"]
    for field in required_fields:
        if not data.get(field):
            return abort(400, f"No detail provided for {field!r}")

    badge_id = data.get("badge_id")
    username = data.get("username")

    # TODO: Modularize this to variable
    person_email = f"{username}@fedoraproject.org"

    result = g.tahrirdb.remove_assertion(
        badge_id=badge_id,
        person_email=person_email,
    )

    if not result:
        return abort(404, f"Badge {badge_id!r} or User {person_email!r} or Assertion not found")

    return jsonify({"message": f"Badge {badge_id!r} retracted from {person_email!r}"})
