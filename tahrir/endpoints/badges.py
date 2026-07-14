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

    # This is a very unoptimised implementation for achieving pagination.
    # The implementation should have been there in the upstream `tahrir-api` at database level.
    assertions = sorted(
        g.tahrirdb.get_assertions_by_badge(badge_id), key=lambda assertion: assertion.issued_on
    )

    data = badge_json_generator(badge)
    data["assertions"] = {"origin": {}, "recent": {}}
    if assertions:
        # Process first assertion
        origin_assertion_data = assertions[0].as_dict()
        origin_assertion_data.pop("badge", None)  # Remove unwanted fields
        origin_assertion_data["person"] = assertions[0].person.as_dict()  # Add user info
        origin_assertion_data["person"].pop("email", None)  # Remove email field
        origin_assertion_data["person"]["mail"] = hash_email(assertions[0].person.avatar)
        origin_assertion_data["issued_on"] = assertions[0].issued_on.timestamp()
        data["assertions"]["origin"] = origin_assertion_data

        if len(assertions) > 1:
            # Process last assertion
            recent_assertion_data = assertions[-1].as_dict()
            recent_assertion_data.pop("badge", None)  # Remove unwanted fields
            recent_assertion_data["person"] = assertions[-1].person.as_dict()  # Add user info
            recent_assertion_data["person"].pop("email", None)  # Remove email field
            recent_assertion_data["person"]["mail"] = hash_email(assertions[-1].person.avatar)
            recent_assertion_data["issued_on"] = assertions[-1].issued_on.timestamp()
            data["assertions"]["recent"] = recent_assertion_data
        else:
            data["assertions"]["recent"] = origin_assertion_data

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
