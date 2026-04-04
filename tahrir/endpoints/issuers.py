from flask import g, jsonify

from . import blueprint as bp


@bp.route("/api/issuers", methods=["GET"])
def get_all_issuers():
    """Endpoint to fetch all the issuers."""

    issuers = g.tahrirdb.get_all_issuers().all()

    if not issuers:
        return jsonify([])

    return jsonify(
        {
            "issuers": [
                {
                    "id": issuer.id,
                    "origin": issuer.origin,
                    "name": issuer.name,
                    "org": issuer.org,
                    "contact": issuer.contact,
                }
                for issuer in issuers
            ]
        }
    )
