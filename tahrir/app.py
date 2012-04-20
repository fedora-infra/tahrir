
import model as m

class AssertionApp(object):
    def __getitem__(self, key):
        print "awesome..."
        result = m.Assertion.query.filter_by(recipient=key).one()
        print "GOT RESULT:", result
        return result


class RootApp(object):
    def __init__(self):
        self.assertion_app = AssertionApp()

    def __getitem__(self, key):
        if key == 'assertions':
            return self.assertion_app

root = RootApp()

def get_root(request):
    return root
