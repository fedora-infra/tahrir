from __future__ import absolute_import
import cgi

import math
import time
import datetime
import dateutil.relativedelta
import six.moves.urllib.parse
from hashlib import md5, sha256

import pyramid.threadlocal
import six

libravatar = None
try:
    import libravatar
except ImportError:
    pass


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

        query = six.moves.urllib.parse.urlencode(query)

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
        ident = str_to_bytes(self.openid_identifier)
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


def merge_dicts(dict1, dict2):
    """
    Combine two dicts, in a way that works with Python 2 and 3. In
    3.5+ you can just do z = {**x, **y}, so when we no longer care
    about compatibility before 3.5 we can replace use of this.
    """
    ret = dict1.copy()
    ret.update(dict2)
    return ret


def str_to_bytes(input):
    """If input is unicode-type (unicode on Python 2, str on Python
    3), encodes it and returns the result. Otherwise just passes it
    through. Needed to deal with dogpile key mangling.
    """
    if isinstance(input, six.text_type):
        input = input.encode('utf-8')
    return input
