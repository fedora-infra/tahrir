from flask import abort, jsonify

from ..utils.badge import badge_json_generator
from ..utils.user import get_person
from . import blueprint as bp


@bp.route("/api/authorizations/<string:user_id>", methods=["GET"])
def get_authorizations(user_id: str):
    """Endpoint to list all badge authorizations for a given user."""

    person = get_person(user_id)
    if not person:
        return abort(404, f"User {user_id!r} not found")

    authorizations_data = {}

    for authorization in person.authorizations:
        badge = authorization.badge
        if badge.id not in authorizations_data:
            authorizations_data[badge.id] = badge_json_generator(badge)

    return jsonify(authorizations_data)
