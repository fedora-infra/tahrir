import tahrir_api.model as m
from flask import g


def get_issuer(issuer_id):
    """Fetch issuer by ID, return None if not found."""
    if issuer_id is None:
        return None

    try:
        issuer = g.tahrirdb.session.query(m.Issuer).filter(m.Issuer.id == int(issuer_id)).first()
        return issuer
    except ValueError:
        return None


def update_issuer(issuer_id, data):
    """Update issuer fields, return updated issuer or None if not found."""
    issuer = get_issuer(issuer_id)

    if not issuer:
        return None

    if "origin" in data:
        issuer.origin = data["origin"]

    if "name" in data:
        issuer.name = data["name"]

    if "org" in data:
        issuer.org = data["org"]

    if "contact" in data:
        issuer.contact = data["contact"]

    g.tahrirdb.session.commit()
    return issuer
