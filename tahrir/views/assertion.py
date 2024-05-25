from flask import abort, jsonify

from tahrir.utils.badge import get_badge_or_404

from . import blueprint as bp


@bp.route("/assertions/<badge_id>/<recipient>")
def assertion(badge_id, recipient):
    """Action that awards a person a badge after scanning a qrcode."""
    badge = get_badge_or_404(badge_id)
    for assertion in badge.assertions:
        if assertion.recipient == recipient:
            break
    else:
        abort(404, f"Assertion {recipient!r} not found.")

    return jsonify(assertion.as_dict())
