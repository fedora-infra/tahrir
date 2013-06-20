import cgi
from HTMLParser import HTMLParser

class MLStripper(HTMLParser):
    def __init__(self):
        self.reset()
        self.fed = []
    def handle_data(self, d):
        self.fed.append(d)
    def get_data(self):
        return ''.join(self.fed)

def _strip_tags(html):
    s = MLStripper()
    s.feed(html)
    return s.get_data()

def strip_tags(_d):
    d = {}
    for k, v in _d.items():
        if type(v) == dict:
            d[k] = strip_tags(v)
        elif type(v) == list:
            d[k] = map(strip_tags, v)
        elif isinstance(v, cgi.FieldStorage):
            d[k] = v
        else:
            d[k] = _strip_tags(v)

    return d
