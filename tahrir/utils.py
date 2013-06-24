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

def generate_badge_yaml(postdict):
    return "%YAML 1.2\n"\
         "---\n"\
         "\n"\
         "# This is some metadata about the badge.\n"\
         "name:            " + postdict.get('badge-name', default="") + "\n"\
         "description:     " + postdict.get('badge-description',
                                            default="") + "\n"\
         "creator:         " + postdict.get('badge-creator',
                                            default="") + "\n"\
         "\n"\
         "# This is a link to the discussion about adopting this as\n"\
         "a for-real badge\n"\
         "discussion:      " + postdict.get('discussion', default="") + "\n"\
         "\n"\
         "# A link to the image for the badge.\n"\
         "image_url:       " + postdict.get('image', default="") + "\n"\
         "\n"\
         "# The issuer.\n"\
         "issuer_id:       " + postdict.get('issuer', default="") + "\n"\
         "\n"\
         "# We'll perform our more costly check (defined below)\n"\
         "# only when we receive messages that match this trigger.\n"\
         "trigger:\n"\
         "  topic:         " + postdict.get('trigger-topic',
                                            default="") + "\n"\
         "\n"\
         "# Once the check has been triggered, this defines what we\n"\
         "# actually check.\n"\
         "criteria:        " + postdict.get('criteria',
                                            default="") + "\n"\
         "(This section is under construction.\n"
