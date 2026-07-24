from collections import defaultdict

from flask import abort, current_app, g

from tahrir.defaults import TAHRIR_DISPLAY_TAGS

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


def _badge_tags_list(badge):
    return [tag.name for tag in badge.tags]


def badge_json_generator(badge):
    """Serialize a badge for the JSON API."""
    return {
        "id": badge.id,
        "name": badge.name,
        "description": badge.description,
        "image": badge.image,
        "tags": _badge_tags_list(badge),
        "criteria": badge.criteria,
        "rarity": badge.rarity.name if badge.rarity else None,
        "legacy": badge.legacy,
        "issuer": badge.issuer.name,
        "created_on": badge.created_on.timestamp(),
    }


def sort_badges_by_tag(badges):
    by_tag = defaultdict(list)
    uncategorized = []
    for badge in badges:
        tags = [tag.name for tag in badge.tags]
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
    replacements = dict(zip(bad, [""] * len(bad), strict=False))
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
    return [badge_json_generator(badge) for badge in badges]


def organize_badges_by_tags(serialized_badges):
    """Helper function to organize badges by tags using indices."""
    return {
        name: [indx for indx, item in enumerate(serialized_badges) if name in item["tags"]]
        for name in TAHRIR_DISPLAY_TAGS
    }
