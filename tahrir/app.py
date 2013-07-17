from pyramid.security import Allow, Deny, Everyone


class AssertionApp(object):
    __name__ = 'assertions'

    def __init__(self, badge):
        self.badge = badge

    def __getitem__(self, key):
        for assertion in self.badge.assertions:
            if assertion.recipient == key:
                assertion.__parent__ = self
                assertion.__name__ = assertion.recipient
                return assertion
        else:
            raise KeyError("Assertion %r not found." % key)


class InvitationApp(object):
    __name__ = 'invitations'

    def __init__(self, request):
        self.request = request

    def __getitem__(self, key):
        resource = self.request.db.get_invitation(key)
        resource.__parent__ = self
        resource.__name__ = resource.id
        return resource


class RootApp(object):
    __name__ = None
    __parent__ = None

    __acl__ = [
        (Allow, 'group:admins', 'admin'),
    ]

    def __init__(self, request):
        self.request = request

    def __getitem__(self, key):
        if key == 'assertions':
            return self

        if key == 'invitations':
            resource = InvitationApp(request=self.request)
            resource.__parent__ = self
            return resource

        # else

        badge = self.request.db.get_badge(key)
        if not badge:
            raise KeyError("No such badge %r" % key)
        resource = AssertionApp(badge=badge)
        resource.__parent__ = self
        return resource


def get_root(request):
    return RootApp(request=request)
