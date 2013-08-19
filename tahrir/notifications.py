# Optional.  Emit messages to the fedmsg bus.
fedmsg = None
try:
    import fedmsg
except ImportError:
    pass


def callback(topic, msg):
    if fedmsg:
        fedmsg.publish(
            modname="fedbadges",
            topic=topic,
            msg=msg,
        )
