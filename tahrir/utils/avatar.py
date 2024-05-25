import urllib.parse
from hashlib import sha256

from flask import current_app

from tahrir.cache import cache


libravatar = None
try:
    import libravatar
except ImportError:
    pass


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


def as_avatar(value, size):
    return get_avatar(value, size=size)
