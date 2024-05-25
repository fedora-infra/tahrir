# Copyright (c) 2019 Red Hat, Inc.

"""Test tahrir.cache."""


from tahrir.cache import str_to_bytes


def test_str_to_bytes_str():
    assert str_to_bytes("foo") == b"foo"


def test_str_to_bytes_bytes():
    assert str_to_bytes(b"foo") == b"foo"


def test_str_to_bytes_other():
    assert str_to_bytes(["list"]) == ["list"]
