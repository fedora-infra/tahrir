import urllib.parse
from hashlib import sha256

from flask import current_app

from tahrir.cache import cache


@cache.cache_on_arguments()
def get_avatar(email: str, size):
    default = current_app.config["TAHRIR_DEFAULT_AVATAR"]

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

    return f"https://seccdn.libravatar.org/avatar/{hash}?{query}"


def as_avatar(value, size):
    return get_avatar(value, size=size)
