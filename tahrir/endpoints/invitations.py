from datetime import datetime

from flask import abort, g, jsonify, redirect, request

from ..app import csrf, oidc
from ..utils.user import _populate_access_user, get_person
from . import blueprint as bp


@bp.route("/api/invitations/<string:invitation_id>/claim", methods=["GET"])
@csrf.exempt
@oidc.accept_token()
def claim_invitation(invitation_id: str):
    """Action that awards a person a badge after scanning a qrcode."""

    if not request.authorization:
        return redirect(f"/campaign/{invitation_id}/rsvp")

    _populate_access_user()
    if not g.token_email:
        return abort(401, "Unauthorized")

    if g.token_person is None:
        return abort(403, "Forbidden")

    claim = g.tahrirdb.get_invitation(invitation_id)

    if not claim:
        return jsonify({"error": "That invitation is invalid"}), 404

    if claim.expires_on < datetime.now():
        return jsonify({"error": "That invitation has expired"}), 410

    # Check to see if the user already has the badge.
    if g.tahrirdb.assertion_exists(claim.badge_id, g.token_person.email):
        return jsonify({"error": "You already have received the badge"}), 422

    try:
        g.tahrirdb.add_assertion(claim.badge_id, g.token_person.email, datetime.now())
    except ValueError as e:
        return abort(403, str(e))

    return jsonify({"message": "You have successfully redeemed the badge"})


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
        return jsonify({})

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
