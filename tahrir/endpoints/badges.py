from flask import g, jsonify

from ..utils.badge import (
    badge_json_generator,
    get_badge_or_404,
    organize_badges_by_tags,
    serialize_badges,
)
from . import blueprint as bp


@bp.route("/api/badges", methods=["GET"])
def get_all_badges():
    """Endpoint to fetch all the badges."""

    all_badges = g.tahrirdb.get_all_badges().all()

    if not all_badges:
        return jsonify([])

    newest_badges = sorted(all_badges, key=lambda badge: badge.created_on, reverse=True)[:40]

    serializable_all_badges = serialize_badges(all_badges)
    serializable_newest_badges = serialize_badges(newest_badges)

    serializable_all_badges_by_tag = organize_badges_by_tags(serializable_all_badges)
    serializable_newest_badges_by_tag = organize_badges_by_tags(serializable_newest_badges)

    data = {
        "classified": {
            "newest": serializable_newest_badges_by_tag,
            "full": serializable_all_badges_by_tag,
        },
        "disordered": {
            "newest": serializable_newest_badges,
            "full": serializable_all_badges,
        },
    }

    return jsonify(data)


@bp.route("/api/badges/<string:badge_id>", methods=["GET"])
def get_badge_by_id(badge_id: str):
    """Endpoint to fetch the badges based on matching id."""

    badge = get_badge_or_404(badge_id)

    return jsonify(badge_json_generator(badge))


@bp.route("/api/badges/category/<string:name>", methods=["GET"])
def get_badges_by_tags(name: str):
    """Endpoint to fetch the badges based on matching tag."""

    tag = [name.strip()]
    badges = g.tahrirdb.get_badges_from_tags(tags=tag, match_all=False)

    if not badges:
        return jsonify([])

    serializable_badges = sorted(
        serialize_badges(badges),
        key=lambda x: x["name"],
    )

    return jsonify(serializable_badges)
