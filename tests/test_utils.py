# Copyright (c) 2019 Red Hat, Inc.

"""Test tahrir.utils."""

import unittest

from tahrir import utils


class TestSingularize(unittest.TestCase):
    """Test the singularize() function."""

    def test_singularize_value_1(self):
        """Test that the trailing letter is returned when value is 1."""
        self.assertEqual(utils.singularize('cats', 1), 'cat')
