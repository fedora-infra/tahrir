from pyramid.security import Allow
from pyramid.security import Everyone

import model as m


class AssertionApp(object):
    def __init__(self, badge):
        self.badge = badge

    def __getitem__(self, key):
        return m.Assertion.query.filter_by(
            recipient=key,
            badge=self.badge,
        ).one()


class RootApp(object):
    __name__ = None
    __parent__ = None

    def __getitem__(self, key):
        if key == 'assertions':
            return self

        badge = m.Badge.query.filter_by(id=key).one()
        return AssertionApp(badge=badge)


def get_root(request):
    return RootApp()
