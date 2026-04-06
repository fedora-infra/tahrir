from datetime import datetime, timezone

from flask import abort, g, jsonify, request

from ...app import csrf, oidc
from ...utils.user import get_person, require_admin
from . import blueprint as bp


@bp.route("/api/admin/invitations", methods=["POST"])
@csrf.exempt
@oidc.require_login
@require_admin
def add_invitations():
    """Endpoint to add a new invitation"""

    data = request.get_json()
    if not data:
        return abort(400, "No details provided")

    created_on = data.get("created_on")
    if created_on is not None:
        try:
            created_on = datetime.fromtimestamp(created_on, tz=timezone.utc)
        except (ValueError, TypeError, OSError):
            return abort(400, "Invalid created_on timestamp")
    else:
        return abort(400, "No created_on timestamp provided")

    expires_on = data.get("expires_on")
    if expires_on is not None:
        try:
            expires_on = datetime.fromtimestamp(expires_on, tz=timezone.utc)
        except (ValueError, TypeError, OSError):
            return abort(400, "Invalid expires_on timestamp")
    else:
        return abort(400, "No expires_on timestamp provided")

    # created_by = f"{data.get('issuer_email')}@{current_app.config['TAHRIR_EMAIL_DOMAIN']}"
    created_by = f"{data.get('issuer_email')}@fedoraproject.org"
    badge_id = data.get("badge_id")

    try:
        g.tahrirdb.add_invitation(
            badge_id=badge_id,
            created_on=created_on,
            expires_on=expires_on,
            created_by_email=created_by,
        )
    except ValueError as e:
        return abort(404, str(e))

    return jsonify({"message": f"Invitation added for Badge {badge_id!r} by {created_by!r}"}), 201

@bp.route("/api/admin/invitations", methods=["DELETE"])
@csrf.exempt
@oidc.require_login
@require_admin
def remove_invitations():
    """Endpoint to remove an invitation"""

    data = request.get_json()
    if not data:
        return abort(400, "No details provided")

    result = g.tahrirdb.expire_invitation(data.get("invitation_id"))

    if not result:
        return abort(404, f"Invitation {data.get('invitation_id')!r} does not exists")

    return jsonify({"message": f"Invitation {data.get('invitation_id')!r} removed successfully"})


@csrf.exempt
@oidc.require_login
@require_admin
@bp.route("/api/admin/invitations/<string:user_id>", methods=["GET"])
def get_invitations_by_user_id(user_id: str):
    """Endpoint to search for invitations by User ID"""

    user = get_person(user_id)
    if not user:
        return abort(404, f"User {user_id!r} not found")

    invitations = g.tahrirdb.get_invitations(person_id=user.id)

    if not invitations:
        return abort(404, f"No invitations available for user {user_id!r}")

    invitations_data = {}

    for invitation in filter(lambda invitation: not invitation.expired, invitations):
        badge = invitation.badge

        if badge.id not in invitations_data:
            invitations_data[badge.id] = {
                "name": badge.name,
                "image": badge.image,
                "invitations": [],
            }

        invitations_data[badge.id]["invitations"].append(
            {
                "invitation_id": invitation.id,
                "created_on": invitation.created_on.timestamp() if invitation.created_on else None,
                "expires_on": invitation.expires_on.timestamp() if invitation.expires_on else None,
                "expired": invitation.expired,
            }
        )

    return jsonify(invitations_data)
