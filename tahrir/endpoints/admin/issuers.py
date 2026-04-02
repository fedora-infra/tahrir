from flask import abort, g, jsonify

from ...app import oidc
from ...utils.user import require_admin
from . import blueprint as bp


@bp.route("/api/admin/issuers/<int:issuer_id>", methods=["GET"])
@oidc.require_login
@require_admin
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
