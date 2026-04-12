from flask import abort, g, jsonify, request

from ..utils.avatar import hash_email
from . import blueprint as bp


@bp.route("/api/assertions", methods=["GET"])
def get_recent_assertions():
    """Endpoint to fetch all recent assertions across all badges."""

    begin = request.args.get("begin", 0, type=int)
    limit = min(request.args.get("limit", 40, type=int), 40)

    all_assertions = list(g.tahrirdb.get_all_assertions())
    assertions = all_assertions[begin:begin + limit]
    if not assertions:
        return jsonify([])

    result = []
    for item in assertions:
        item_data = item.as_dict()
        item_data["person"] = item.person.as_dict()
        item_data["person"].pop("email", None)
        item_data["person"]["mail"] = hash_email(item.person.avatar)
        item_data["issued_on"] = item.issued_on.timestamp()
        item_data["badge"]["id"] = item.badge.id
        result.append(item_data)

    return jsonify(result)


@bp.route("/api/assertions/<string:badge_id>", methods=["GET"])
def get_assertions_by_badge(badge_id: str):
    """Endpoint to fetch all assertions for a specific badge."""

    assertions = g.tahrirdb.get_assertions_by_badge(badge_id)

    if assertions is False:
        return abort(404, f"No such badge {badge_id!r}")

    if not assertions:
        return jsonify([])

    assertions = sorted(assertions, key=lambda assertion: assertion.issued_on)

    # This is a very unoptimised implementation for achieving pagination.
    # The implementation should have been there in the upstream `tahrir-api` at database level.
    begin = request.args.get("begin", 0, type=int)
    limit = request.args.get("limit", 100, type=int)

    result = []
    for assertion in assertions[begin : begin + (limit if limit < 100 else 100)]:
        assertion_data = assertion.as_dict()
        assertion_data.pop("badge", None)  # Remove unwanted fields
        assertion_data["person"] = assertion.person.as_dict()  # Add user info
        assertion_data["person"].pop("email", None)  # Remove email field
        assertion_data["person"]["mail"] = hash_email(assertion.person.avatar)  # Add user avatar
        assertion_data["issued_on"] = assertion.issued_on.timestamp()
        result.append(assertion_data)

    return jsonify(result)
