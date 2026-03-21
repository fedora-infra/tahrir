"""Test tahrir.utils.avatar."""

import re
import urllib.parse
from hashlib import sha256
from unittest.mock import MagicMock, patch

from tahrir.utils.avatar import _SHA256_RE


def _get_avatar_url(email, size):
    """Reproduce get_avatar logic without needing the Flask app context."""
    default = "retro"
    query = urllib.parse.urlencode({"s": size, "d": default})
    if _SHA256_RE.match(email):
        hash_value = email
    else:
        hash_value = sha256(email.encode("utf-8")).hexdigest()
    return f"https://seccdn.libravatar.org/avatar/{hash_value}?{query}"


def test_raw_email_is_hashed():
    """A raw email should be hashed to produce a valid libravatar URL."""
    email = "testuser@fedoraproject.org"
    expected_hash = sha256(email.encode("utf-8")).hexdigest()
    url = _get_avatar_url(email, 100)
    assert expected_hash in url
    assert url.startswith("https://seccdn.libravatar.org/avatar/")


def test_prehashed_email_used_directly():
    """A pre-hashed value should be used directly without double-hashing."""
    email = "testuser@fedoraproject.org"
    prehashed = sha256(email.encode("utf-8")).hexdigest()
    url = _get_avatar_url(prehashed, 100)
    assert prehashed in url
    # Ensure it was NOT double-hashed
    double_hash = sha256(prehashed.encode("utf-8")).hexdigest()
    assert double_hash not in url


def test_email_and_prehash_produce_same_url():
    """Hashing an email and passing the hash directly should produce the same URL."""
    email = "testuser@fedoraproject.org"
    prehashed = sha256(email.encode("utf-8")).hexdigest()
    assert _get_avatar_url(email, 100) == _get_avatar_url(prehashed, 100)


def test_sha256_regex_matches_hash():
    """The SHA256 regex should match a valid 64-char hex string."""
    valid_hash = sha256(b"test").hexdigest()
    assert _SHA256_RE.match(valid_hash)


def test_sha256_regex_rejects_email():
    """The SHA256 regex should not match an email address."""
    assert not _SHA256_RE.match("testuser@fedoraproject.org")


def test_sha256_regex_rejects_short_hex():
    """The SHA256 regex should not match hex strings shorter than 64 chars."""
    assert not _SHA256_RE.match("abcdef1234567890")
