import dogpile.cache
import dogpile.cache.util


def str_to_bytes(input):
    """If input is a unicode string, encodes it and returns the result.

    Otherwise just passes it through. Needed to deal with dogpile key mangling.
    """
    if isinstance(input, str):
        input = input.encode("utf-8")
    return input


cache = dogpile.cache.make_region(
    key_mangler=lambda x: dogpile.cache.util.sha1_mangle_key(str_to_bytes(x))
)
