import pyramid.threadlocal
from pyramid.settings import asbool

# Optional.  Emit messages to the fedmsg bus.
fedmsg = None
try:
    import fedmsg
except ImportError:
    pass


def callback(topic, msg):
    request = pyramid.threadlocal.get_current_request()
    settings = request.registry.settings
    if fedmsg and asbool(settings.get('tahrir.use_fedmsg', False)):
        fedmsg.publish(
            modname="fedbadges",
            topic=topic,
            msg=msg,
        )
