from datetime import datetime

from flask import abort, g, jsonify

from ..app import csrf, oidc
from . import blueprint as bp


@csrf.exempt
@oidc.require_login
@bp.route("/api/invitations/<string:invitation_id>/claim")
def claim_invitation(invitation_id: str):
    """Action that awards a person a badge after scanning a qrcode."""

    email = g.oidc_user.email
    if not email:
        return abort(401, "Unauthorized")

    claim = g.tahrirdb.get_invitation(invitation_id)

    if not claim:
        abort(404, f"That invitation {invitation_id!r} does not exists.")

    if claim.expires_on < datetime.now():
        return abort(410, f"That invitation {invitation_id!r} is expired.")

    # Check to see if the user already has the badge.
    if g.tahrirdb.assertion_exists(claim.badge_id, g.oidc_user.person.email):
        abort(422, f"You already have badge {claim.badge_id!r}")

    g.tahrirdb.add_assertion(claim.badge_id, g.oidc_user.person.email, datetime.now())

    return jsonify({"message": f"You have earned badge {claim.badge_id!r}"})
