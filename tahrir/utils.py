import datetime
import math
import urllib.parse
from hashlib import sha256

import dateutil.relativedelta
import dogpile.cache
import dogpile.cache.util
import pyramid.threadlocal

libravatar = None
try:
    import libravatar
except ImportError:
    pass


cache = dogpile.cache.make_region(
    key_mangler=lambda x: dogpile.cache.util.sha1_mangle_key(str_to_bytes(x))
)


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
        "# Once the check has been triggered, this defines what we\n"
        "# actually check.\n"
        "criteria:       " + postdict.get("criteria", default="") + "\n"
        "(This section is under construction.)"
    )


@cache.cache_on_arguments()
def get_avatar(email: str, size):
    request = pyramid.threadlocal.get_current_request()
    default = request.registry.settings.get("tahrir.default_avatar", "retro")

    query = {
        "s": size,
        "d": default,
    }

    if size == "responsive":
        # Make it big so we can downscale it as we please
        query["s"] = 312

    query = urllib.parse.urlencode(query)

    # Use md5 for emails, and sha256 for openids.
    # We're really using openids, so...
    # hash = md5(email).hexdigest()
    hash = sha256(email.encode("utf-8")).hexdigest()

    # TODO This next line is temporary and can be removed.  We do
    # libravatar ourselves here by hand to avoid pyDNS issues on epel6.
    # Once those are resolved we can use pylibravatar again.
    return f"https://seccdn.libravatar.org/avatar/{hash}?{query}"

    gravatar_url = f"https://secure.gravatar.com/avatar/{hash}?{query}"

    if libravatar:
        return libravatar.libravatar_url(
            email=email,
            size=size,
            default=gravatar_url,
        )
    else:
        return gravatar_url


def singularize(term, value):
    """Strip the 's' off of plural words to dumbly singularize them."""
    if value == 1:
        return term[:-1]
    else:
        return term


def relative_time(value: datetime.datetime):
    SHORT_DENOMINATIONS = {
        "years": "yrs",
        "months": "mons",
        "days": "days",
        "hours": "hrs",
        "minutes": "mins",
        "seconds": "secs",
    }
    then_in_seconds = value.timestamp()
    now_in_seconds = datetime.datetime.now(datetime.timezone.utc).timestamp()
    delta = now_in_seconds - then_in_seconds

    if delta > 0:
        suffix = "ago"
    else:
        suffix = "from now"

    # time_strings = []
    rd = dateutil.relativedelta.relativedelta(seconds=math.fabs(delta))
    denominations = ["years", "months", "days", "hours", "minutes", "seconds"]
    for denomination in denominations:
        value = getattr(rd, denomination, 0)
        if value:
            return "%d %s %s" % (
                value,
                singularize(SHORT_DENOMINATIONS[denomination], value),
                suffix,
            )

    return "just now"


def str_to_bytes(input):
    """If input is a unicode string, encodes it and returns the result.

    Otherwise just passes it through. Needed to deal with dogpile key mangling.
    """
    if isinstance(input, str):
        input = input.encode("utf-8")
    return input
