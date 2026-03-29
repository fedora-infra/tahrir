from flask import abort, current_app, g, jsonify, request

from ...app import csrf, oidc
from ...utils.user import require_admin
from . import blueprint as bp


@bp.route("/api/admin/authorization", methods=["POST"])
@csrf.exempt
@oidc.require_login
@require_admin
def add_authorization():
    """Endpoint to add authorization and allow someone to admin a certain badge"""

    data = request.get_json()
    if not data:
        return abort(400, "No details provided")

    required_fields = ["badge_id", "user"]
    for field in required_fields:
        if not data.get(field):
            return abort(400, f"No detail provided for {field!r}")

    # ONE SHOULD NOT FEEL THE NEED OF USING THE EMAIL ADDRESS HERE
    # THIS WORKAROUND IS TEMPORARY AND TAHRIR-API WOULD BE CHANGED TO ACCEPT JUST USERNAME
    result = g.tahrirdb.add_authorization(
        badge_id=data.get(required_fields[0]),
        person_email=f"{data.get(required_fields[1])}@{current_app.config['TAHRIR_EMAIL_DOMAIN']}",
    )

    if not result:
        return abort(400, "Failed to add authorization")
    return (
        jsonify(
            {
                "message": f"Badge {data.get(required_fields[0])!r} "
                f"authorized to {data.get(required_fields[1])!r}"
            }
        ),
        201,
    )


@bp.route("/api/admin/authorization", methods=["DELETE"])
@csrf.exempt
@oidc.require_login
@require_admin
def remove_authorization():
    """Endpoint to remove authorization and revoke someone to admin a certain badge"""

    data = request.get_json()
    if not data:
        return abort(400, "No details provided")

    required_fields = ["badge_id", "user"]
    for field in required_fields:
        if not data.get(field):
            return abort(400, f"No detail provided for {field!r}")

    # ONE SHOULD NOT FEEL THE NEED OF USING THE EMAIL ADDRESS HERE
    # THIS WORKAROUND IS TEMPORARY AND TAHRIR-API WOULD BE CHANGED TO ACCEPT JUST USERNAME
    result = g.tahrirdb.delete_authorization(
        badge_id=data.get(required_fields[0]),
        person_email=f"{data.get(required_fields[1])}@{current_app.config['TAHRIR_EMAIL_DOMAIN']}",
    )

    if not result:
        return abort(404, "Authorization not found or failed to remove")
    return (
        jsonify(
            {
                "message": f"Badge {data.get(required_fields[0])!r} "
                f"authorization revoked from {data.get(required_fields[1])!r}"
            }
        ),
        200,
    )
