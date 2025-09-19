from flask import abort, g, jsonify, request

from . import blueprint as bp


@bp.route("/api/assertions/<string:badge_id>", methods=["GET"])
def get_assertions_by_badge(badge_id: str):
    """Endpoint to fetch all assertions for a specific badge."""

    assertions = sorted(
        g.tahrirdb.get_assertions_by_badge(badge_id), key=lambda assertion: assertion.issued_on
    )

    if assertions is False:
        return abort(404, f"No such badge {badge_id!r}")

    if not assertions:
        return jsonify([])

    # This is a very unoptimised implementation for achieving pagination.
    # The implemenation should have been there in the upstream `tahrir-api` at database level.
    begin = request.args.get("begin", 0, type=int)
    limit = request.args.get("limit", 100, type=int)

    result = []
    for assertion in assertions[begin : begin + (limit if limit < 100 else 100)]:
        assertion_data = assertion.as_dict()
        assertion_data.pop("badge", None)  # Remove unwanted fields
        assertion_data["person"] = assertion.person.as_dict()  # Add user info
        assertion_data["person"]["avatar"] = assertion.person.avatar  # Add user avatar
        result.append(assertion_data)

    return jsonify(result)
