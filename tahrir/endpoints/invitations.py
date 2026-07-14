from datetime import datetime

from flask import abort, g, jsonify

from ..app import csrf, oidc
from ..utils.user import get_person, need_access_user
from . import blueprint as bp


@bp.route("/api/invitations/<string:invitation_id>/claim")
@csrf.exempt
@oidc.accept_token()
@need_access_user
def claim_invitation(invitation_id: str):
    """Action that awards a person a badge after scanning a qrcode."""

    if not g.token_email:
        return abort(401, "Unauthorized")

    claim = g.tahrirdb.get_invitation(invitation_id)

    if not claim:
        abort(404, f"That invitation {invitation_id!r} does not exists.")

    if claim.expires_on < datetime.now():
        return abort(410, f"That invitation {invitation_id!r} is expired.")

    # Check to see if the user already has the badge.
    if g.tahrirdb.assertion_exists(claim.badge_id, g.token_person.email):
        abort(422, f"You already have badge {claim.badge_id!r}")

    try:
        g.tahrirdb.add_assertion(claim.badge_id, g.token_person.email, datetime.now())
    except ValueError as e:
        return abort(403, str(e))

    return jsonify({"message": f"You have earned badge {claim.badge_id!r}"})


@bp.route("/api/invitations/<string:user_id>", methods=["GET"])
def get_invitations(user_id: str):
    """Endpoint to list all invitations created by a given user."""

    # TODO - Modify the endpoint to require authentication
    # TODO - Remove the user_id path parameter requirement
    person = get_person(user_id)
    if not person:
        return abort(404, f"User {user_id!r} not found")

    invitations = g.tahrirdb.get_invitations(person_id=person.id)

    if not invitations:
        return abort(404, "No invitations available")

    invitations_data = {}

    for invitation in invitations:
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
