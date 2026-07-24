import sqlalchemy as sa
import tahrir_api.model as m
from flask import g, jsonify, request

from ..utils.avatar import hash_email
from ..utils.badge import (
    badge_json_generator,
    get_badge_or_404,
    organize_badges_by_tags,
    serialize_badges,
)
from . import blueprint as bp


def _serialize_assertion(assertion):
    data = assertion.as_dict()
    data.pop("badge", None)
    data["person"] = assertion.person.as_dict()
    data["person"].pop("email", None)
    data["person"]["mail"] = hash_email(assertion.person.avatar)
    data["issued_on"] = assertion.issued_on.timestamp()
    return data


@bp.route("/api/badges", methods=["GET"])
def get_all_badges():
    """Endpoint to fetch all the badges."""

    legacy = request.args.get("legacy")
    if legacy is not None:
        flag = legacy.lower() in ("true", "1")
        all_badges = [
            b for b in g.tahrirdb.get_all_badges(include_legacy=True).all() if b.legacy == flag
        ]
    else:
        all_badges = g.tahrirdb.get_all_badges().all()

    if not all_badges:
        return jsonify(
            {
                "classified": {"newest": {}, "full": {}},
                "disordered": {"newest": [], "full": []},
            }
        )

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

    origin = g.tahrirdb.get_origin_assertion_by_badge(badge_id)
    recent = g.tahrirdb.get_recent_assertion_by_badge(badge_id)
    times_awarded = g.tahrirdb.get_assertions_count_by_badge(badge_id)
    persons_count = g.tahrirdb.get_all_persons().count()
    percent_earned = (times_awarded / persons_count * 100) if persons_count else 0

    data = badge_json_generator(badge)
    data["times_awarded"] = times_awarded
    data["percent_earned"] = percent_earned
    data["first_awarded"] = origin.issued_on.timestamp() if origin else None
    data["first_awarded_person"] = origin.person.nickname if origin else None
    data["last_awarded"] = recent.issued_on.timestamp() if recent else None
    data["last_awarded_person"] = recent.person.nickname if recent else None
    data["assertions"] = {"origin": {}, "recent": {}}
    if origin:
        data["assertions"]["origin"] = _serialize_assertion(origin)
        if recent and recent.id != origin.id:
            data["assertions"]["recent"] = _serialize_assertion(recent)
        else:
            data["assertions"]["recent"] = data["assertions"]["origin"]

    return jsonify(data)


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


@bp.route("/api/badges/search/<search_string>", methods=["GET"])
def search_badges_by_string(search_string: str):
    """
    Search endpoint that returns badges matching the search string
    """

    # We need to have a function for searching badges in Tahrir API
    # Instead of doing this over here like this
    begin = request.args.get("begin", 0, type=int)
    limit = request.args.get("limit", 100, type=int)

    collection = (
        g.tahrirdb.get_all_badges()
        .filter(
            sa.func.lower(m.Badge.name).like(f"%{search_string.lower()}%")
            | sa.func.lower(m.Badge.description).like(f"%{search_string.lower()}%")
            | m.Badge.tags.any(sa.func.lower(m.Tag.name).like(f"%{search_string.lower()}%"))
        )
        .all()
    )

    # Suggested function should also include pagination feature
    result = {
        "badges": [
            {
                "id": item.id,
                "created_on": item.created_on.timestamp() if item.created_on else None,
                "criteria": item.criteria,
                "description": item.description,
                "image": item.image,
                "name": item.name,
                "tags": [tag.name for tag in item.tags],
            }
            for item in collection[begin : begin + (limit if limit < 100 else 100)]
        ],
        "castup": len(collection),
    }

    return jsonify(result)
