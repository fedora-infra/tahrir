import cgi
from HTMLParser import HTMLParser

import math
import time
import datetime
import dateutil.relativedelta
import urllib
from hashlib import md5, sha256

import pyramid.threadlocal

libravatar = None
try:
    import libravatar
except ImportError:
    pass


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
         "name:           " + postdict.get('badge-name', default="") + "\n"\
         "description:    " + postdict.get('badge-description',
                                            default="") + "\n"\
         "creator:        " + postdict.get('badge-creator',
                                            default="") + "\n"\
         "\n"\
         "# This is a link to the discussion about adopting this as\n"\
         "a for-real badge\n"\
         "discussion:     " + postdict.get('discussion', default="") + "\n"\
         "\n"\
         "# A link to the image for the badge.\n"\
         "image_url:      " + postdict.get('image', default="") + "\n"\
         "\n"\
         "# The issuer.\n"\
         "issuer_id:      " + postdict.get('issuer', default="") + "\n"\
         "\n"\
         "# We'll perform our more costly check (defined below)\n"\
         "# only when we receive messages that match this trigger.\n"\
         "trigger:\n"\
         "  topic:        " + postdict.get('trigger-topic',
                                            default="") + "\n"\
         "\n"\
         "# Once the check has been triggered, this defines what we\n"\
         "# actually check.\n"\
         "criteria:       " + postdict.get('criteria',
                                            default="") + "\n"\
         "(This section is under construction.)"


def make_avatar_method(cache):

    @cache.cache_on_arguments()
    def _avatar_function(email, size):
        request = pyramid.threadlocal.get_current_request()
        absolute_default = request.registry.settings.get(
            'tahrir.default_avatar',
            'https://badges.fedoraproject.org/static/img/badger_avatar.png')

        query = {
            's': size,
            'd': absolute_default,
        }

        if size == 'responsive':
            # Make it big so we can downscale it as we please
            query['s'] = 312

        query = urllib.urlencode(query)

        # Use md5 for emails, and sha256 for openids.
        # We're really using openids, so...
        #hash = md5(email).hexdigest()
        hash = sha256(email).hexdigest()

        # TODO This next line is temporary and can be removed.  We do
        # libravatar ourselves here by hand to avoid pyDNS issues on epel6.
        # Once those are resolved we can use pylibravatar again.
        return "https://seccdn.libravatar.org/avatar/%s?%s" % (hash, query)

        gravatar_url = "https://secure.gravatar.com/avatar/%s?%s" % (hash, query)

        if libravatar:
            return libravatar.libravatar_url(
                email=email,
                size=size,
                default=gravatar_url,
            )
        else:
            return gravatar_url

    def avatar_method(self, size):
        # dogpile.cache can barf on unicode, so do this ourselves.
        ident = self.openid_identifier
        if isinstance(ident, unicode):
            ident = ident.encode('utf-8')
        # Call the cached workhorse function
        return _avatar_function(ident, size)

    return avatar_method


def singularize(term, value):
    """ Strip the 's' off of plural words to dumbly singularize them. """
    if value == 1:
        return term[:-1]
    else:
        return term

def make_relative_time_property(attr):

    SHORT_DENOMINATIONS = {
            'years': 'yrs',
            'months': 'mons',
            'days': 'days',
            'hours': 'hrs',
            'minutes': 'mins',
            'seconds': 'secs',
    }

    @property
    def relative_time_method(self):
        then_in_seconds = time.mktime(getattr(self, attr).timetuple())
        now_in_seconds = time.mktime(datetime.datetime.utcnow().timetuple())
        delta = now_in_seconds - then_in_seconds

        if delta > 0:
            suffix = "ago"
        else:
            suffix = "from now"

        time_strings = []
        rd = dateutil.relativedelta.relativedelta(seconds=math.fabs(delta))
        denominations = [
            'years', 'months', 'days', 'hours',
            'minutes', 'seconds']
        for denomination in denominations:
            value = getattr(rd, denomination, 0)
            if value:
                return "%d %s %s" % (
                    value,
                    singularize(SHORT_DENOMINATIONS[denomination], value),
                    suffix
                )

        return "just now"

    return relative_time_method


def make_openid_identifier_property(identifier):

    @property
    def openid_identifier(self):
        prefix, domain = identifier.split("://")
        return "http://%s.%s" % (self.nickname, domain)

    return openid_identifier
