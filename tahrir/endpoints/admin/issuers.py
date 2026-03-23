from flask import abort, g, jsonify, request

from ...app import csrf, oidc
from ...utils.issuer import get_issuer, update_issuer
from ...utils.user import require_admin
from . import blueprint as bp


@bp.route("/api/admin/issuers", methods=["POST"])
@csrf.exempt
@oidc.require_login
@require_admin
def add_issuer():
    """Endpoint to add a new issuer"""

    data = request.get_json()
    if not data:
        return abort(400, "No details provided")

    origin = data.get("origin")
    name = data.get("name")

    if not origin or not name:
        return abort(400, "Issuer 'origin' and 'name' are required")

    org = data.get("org")
    contact = data.get("contact")

    # Check if issuer already exists
    if g.tahrirdb.issuer_exists(origin, name):
        abort(409, f"Issuer with origin {origin!r} and name {name!r} already exists.")

    # Create issuer
    g.tahrirdb.add_issuer(origin, name, org, contact)

    return jsonify({"message": f"Issuer {name!r} created successfully"}), 201


@bp.route("/api/admin/issuers/<int:issuer_id>", methods=["GET"])
@oidc.require_login
@require_admin
def get_issuer_endpoint(issuer_id: int):
    """Fetch an issuer by ID"""

    issuer = get_issuer(issuer_id)

    if not issuer:
        abort(404, f"Issuer {issuer_id} not found")

    return jsonify(
        {
            "id": issuer.id,
            "origin": issuer.origin,
            "name": issuer.name,
            "org": issuer.org,
            "contact": issuer.contact,
        }
    )


@bp.route("/api/admin/issuers/<int:issuer_id>", methods=["PUT"])
@csrf.exempt
@oidc.require_login
@require_admin
def update_issuer_endpoint(issuer_id: int):
    """Update an existing issuer"""

    data = request.get_json()
    if not data:
        abort(400, "No data provided")

    issuer = update_issuer(issuer_id, data)

    if not issuer:
        abort(404, f"Issuer {issuer_id} not found")

    return jsonify({"message": f"Issuer {issuer_id} updated successfully"})
