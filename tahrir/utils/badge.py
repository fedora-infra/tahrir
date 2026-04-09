import json
import os
from collections import defaultdict

from flask import abort, current_app, g

from tahrir.defaults import TAHRIR_DISPLAY_TAGS
from tahrir.utils.avatar import hash_email


ISSUER = dict(
    name="Fedora Project",
    origin="http://badges.fedoraproject.org",
    org="http://fedoraproject.org",
    contact="badges@fedoraproject.org",
)


def get_badge_or_404(badge_id):
    badge = g.tahrirdb.get_badge(badge_id)
    if not badge:
        abort(404, f"No such badge {badge_id!r}")
    return badge


def _load_rarities_data():
    """Load ``static/rarities.json`` (Fedora badge rarity metadata)."""
    path = os.path.join(current_app.static_folder, "rarities.json")
    try:
        with open(path) as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        abort(500, "Mistaken or absent rarities file")


def _badge_tags_list(badge):
    raw = badge.tags or ""
    return [item.strip() for item in raw.split(",") if item.strip() != ""]


def badge_json_generator(badge, withasserts=True):
    """Serialize a badge for the JSON API.
    When withasserts is False, returns compact data for listings.
    """
    raredata = _load_rarities_data()

    if not withasserts:
        return {
            "id": badge.id,
            "name": badge.name,
            "description": badge.description,
            "image": badge.image,
            "tags": _badge_tags_list(badge),
            "criteria": badge.criteria,
            "rarity": raredata["badges"][badge.id]["rare"],
            "issuer": badge.issuer.name,
            "created_on": badge.created_on.timestamp(),
        }

    assertions = sorted(badge.assertions, key=lambda b: b.issued_on)
    times_awarded = len(badge.assertions)
    persons_count = g.tahrirdb.get_all_persons().count()
    if persons_count == 0:
        percent_earned = 0
    else:
        percent_earned = float(times_awarded) / float(persons_count)

    if assertions:
        last_awarded = assertions[-1]
        last_awarded_person = last_awarded.person
        first_awarded = assertions[0]
        first_awarded_person = first_awarded.person
    else:
        last_awarded = None
        last_awarded_person = None
        first_awarded = None
        first_awarded_person = None

    if last_awarded:
        last_awarded = float(last_awarded.issued_on.strftime("%s"))

    if last_awarded_person:
        last_awarded_person = last_awarded_person.nickname

    if first_awarded:
        first_awarded = float(first_awarded.issued_on.strftime("%s"))

    if first_awarded_person:
        first_awarded_person = first_awarded_person.nickname

    if percent_earned:
        percent_earned *= 100

    return {
        "id": badge.id,
        "name": badge.name,
        "description": badge.description,
        "times_awarded": times_awarded,
        "last_awarded": last_awarded,
        "last_awarded_person": last_awarded_person,
        "first_awarded": first_awarded,
        "first_awarded_person": first_awarded_person,
        "percent_earned": percent_earned,
        "image": badge.image,
        "tags": _badge_tags_list(badge),
        "issuer": badge.issuer.name,
        "criteria": badge.criteria,
        "rarity": raredata["badges"][badge.id]["rare"],
        "assertions": [
            {
                "name": i.person.nickname,
                "rank": i.person.rank,
                "date": i.issued_on.timestamp(),
                "mail": hash_email(i.person.avatar),
            }
            for i in assertions
        ],
    }


def sort_badges_by_tag(badges):
    by_tag = defaultdict(list)
    uncategorized = []
    for badge in badges:
        if badge.tags:
            tags = badge.tags.strip(",").split(",")
        else:
            tags = []
        for tag in tags:
            by_tag[tag].append(badge)
        # no tag in TAHRIR_DISPLAY_TAGS => uncategorized
        if len(set(tags).intersection(set(current_app.config["TAHRIR_DISPLAY_TAGS"]))) == 0:
            uncategorized.append(badge)
    return by_tag, uncategorized


def convert_name_to_id(name):
    """
    Convert a badge name into a valid badge ID.

    :type name: string
    :param name: The badge name to convert to an ID
    """

    badge_id = name.lower().replace(" ", "-")
    bad = ['"', "'", "(", ")", "*", "&", "?"]
    replacements = dict(zip(bad, [""] * len(bad)))
    for a, b in replacements.items():
        badge_id = badge_id.replace(a, b)

    return badge_id


def generate_badge_yaml(postdict):
    return (
        "%YAML 1.2\n"
        "---\n"
        "\n"
        "# This is some metadata about the badge.\n"
        "name:           " + postdict.get("badge-name", default="") + "\n"
        "description:    " + postdict.get("badge-description", default="") + "\n"
        "creator:        " + postdict.get("badge-creator", default="") + "\n"
        "\n"
        "# This is a link to the discussion about adopting this as\n"
        "a for-real badge\n"
        "discussion:     " + postdict.get("discussion", default="") + "\n"
        "\n"
        "# A link to the image for the badge.\n"
        "image_url:      " + postdict.get("image", default="") + "\n"
        "\n"
        "# The issuer.\n"
        "issuer_id:      " + postdict.get("issuer", default="") + "\n"
        "\n"
        "# We'll perform our more costly check (defined below)\n"
        "# only when we receive messages that match this trigger.\n"
        "trigger:\n"
        "  topic:        " + postdict.get("trigger-topic", default="") + "\n"
        "\n"
        "# Award the badge under these conditions:\n"
        "condition:\n" + postdict.get("condition", default="") + "\n"
        "# If the messages matches for the user for the first time, look into previous messages"
        " to get the count:\n"
        "previous:\n" + postdict.get("previous", default="") + "\n"
        "(This section is under construction.)"
    )


def serialize_badges(badges):
    """Helper function to serialize badge objects to dictionaries."""
    return [badge_json_generator(badge, withasserts=False) for badge in badges]


def organize_badges_by_tags(serialized_badges):
    """Helper function to organize badges by tags using indices."""
    return {
        name: [indx for indx, item in enumerate(serialized_badges) if name in item["tags"]]
        for name in TAHRIR_DISPLAY_TAGS
    }
