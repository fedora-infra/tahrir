from datetime import datetime, timezone
from io import BytesIO

import qrcode as qrcode_module
from flask import abort, flash, g, redirect, request, session, url_for

from . import blueprint as bp


@bp.route("/invitations/<claim_id>/claim")
def invitation_claim(claim_id):
    """Action that awards a person a badge after scanning a qrcode."""
    claim = g.tahrirdb.get_invitation(claim_id)
    if claim.expires_on < datetime.now():
        return abort(410, "That invitation is expired.")

    email = g.oidc_user.email
    if not email:
        session["came_from"] = request.url
        return redirect(url_for("oidc_auth.login"))

    # Check to see if the user already has the badge.
    if g.tahrirdb.assertion_exists(claim.badge_id, g.oidc_user.person.email):
        flash(f"You already have {claim.badge_id} badge")
    else:
        g.tahrirdb.add_assertion(
            claim.badge_id, g.oidc_user.person.email, datetime.now(timezone.utc)
        )
        flash(f"You have earned {claim.badge_id} badge")

    # TODO -- return them to a page that auto-exports their badges.
    return redirect(url_for("tahrir.home"))


@bp.route("/invitations/<claim_id>/qrcode")
def invitation_qrcode(claim_id):
    """Returns a raw dummy qrcode through to the user."""
    claim = g.tahrirdb.get_invitation(claim_id)
    if claim.expires_on < datetime.now():
        return abort(410, "That invitation is expired.")

    target = url_for("tahrir.invitation_claim", claim_id=claim_id, _external=True)
    img = qrcode_module.make(target)
    bytestream = BytesIO()
    img.save(bytestream)
    return bytestream.getvalue(), {
        "content-type": "image/png",
    }
