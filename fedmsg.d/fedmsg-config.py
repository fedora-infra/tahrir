""" This is just an example fedmsg config file to be used
during development of tahrir.
"""

import socket
hostname = socket.gethostname().split('.')[0]

config = dict(
    endpoints={
        "relay_outbound": ["tcp://127.0.0.1:4001"],
        "tahrir.%s" % hostname: [
            "tcp://127.0.0.1:5001",
            "tcp://127.0.0.1:5002",
            "tcp://127.0.0.1:5003",
            "tcp://127.0.0.1:5004",
        ],
    },

    relay_inbound="tcp://127.0.0.1:2003",
    environment="dev",
    high_water_mark=0,
    io_threads=1,
    post_init_sleep=0.2,
    irc=[],
    zmq_enabled=True,
    zmq_strict=False,

    sign_messages=False,
    validate_messages=False,
)
