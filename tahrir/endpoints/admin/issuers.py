from flask import abort, g, jsonify, request

from ...app import csrf, oidc
from ...utils.user import need_access_root, need_access_user
from . import blueprint as bp


@bp.route("/api/admin/issuers/<int:issuer_id>", methods=["GET"])
@csrf.exempt
@oidc.accept_token()
@need_access_user
@need_access_root
def get_issuer(issuer_id: int):
    """Fetch an issuer by ID"""

    issuer = g.tahrirdb.get_issuer(issuer_id)

    if not issuer:
        return abort(404, f"Issuer {issuer_id} not found")

    return jsonify(
        {
            "id": issuer.id,
            "origin": issuer.origin,
            "name": issuer.name,
            "org": issuer.org,
            "contact": issuer.contact,
        }
    )


@bp.route("/api/admin/issuers", methods=["GET"])
@csrf.exempt
@oidc.accept_token()
@need_access_user
@need_access_root
def get_issuers():
    """Fetch all issuers"""

    issuers = g.tahrirdb.get_all_issuers()

    if issuers.count() == 0:
        return jsonify([])

    return jsonify(
        [
            {
                "id": issuer.id,
                "origin": issuer.origin,
                "name": issuer.name,
                "org": issuer.org,
                "contact": issuer.contact,
            }
            for issuer in issuers
        ]
    )


@bp.route("/api/admin/issuers", methods=["POST"])
@csrf.exempt
@oidc.accept_token()
@need_access_user
@need_access_root
def create_issuer():
    """Create a new issuer"""

    data = request.get_json()
    if not data:
        return abort(400, "No data provided")

    if not data.get("name"):
        return abort(400, "No name provided")

    if not data.get("origin"):
        return abort(400, "No origin provided")

    issuer_id = g.tahrirdb.add_issuer(
        origin=data.get("origin"),
        name=data.get("name"),
        org=data.get("org"),
        contact=data.get("contact"),
    )

    issuer = g.tahrirdb.get_issuer(issuer_id)

    return jsonify(
        {
            "id": issuer.id,
            "origin": issuer.origin,
            "name": issuer.name,
            "org": issuer.org,
            "contact": issuer.contact,
        }
    )


@bp.route("/api/admin/issuers/<int:issuer_id>", methods=["DELETE"])
@csrf.exempt
@oidc.accept_token()
@need_access_user
@need_access_root
def delete_issuer(issuer_id: int):
    """Delete an issuer"""

    issuer = g.tahrirdb.get_issuer(issuer_id)

    if not issuer:
        return abort(404, f"Issuer {issuer_id} not found")

    g.tahrirdb.delete_issuer(issuer_id)

    return jsonify(
        {
            "id": issuer.id,
            "origin": issuer.origin,
            "name": issuer.name,
            "org": issuer.org,
            "contact": issuer.contact,
        }
    )
