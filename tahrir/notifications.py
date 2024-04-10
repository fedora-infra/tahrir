import logging
import sys
import traceback

import backoff
import pyramid.threadlocal
from fedora_messaging import api as fm_api
from fedora_messaging import exceptions as fm_exceptions
from pyramid.settings import asbool

log = logging.getLogger(__name__)


def _backoff_hdlr(details):
    log.warning(f"Publishing message failed. Retrying. {traceback.format_tb(sys.exc_info()[2])}")


@backoff.on_exception(
    backoff.expo,
    (fm_exceptions.ConnectionException, fm_exceptions.PublishException),
    max_tries=3,
    on_backoff=_backoff_hdlr,
)
def _publish(message):
    fm_api.publish(message)


def callback(message):
    request = pyramid.threadlocal.get_current_request()
    settings = request.registry.settings
    if asbool(settings.get("tahrir.use_fedmsg", False)):
        log.debug(f"Publishing fedoramessage `{message}`")
        try:
            _publish(message)
        except fm_exceptions.BaseException:
            log.error(
                f"Publishing message failed. Giving up. {traceback.format_tb(sys.exc_info()[2])}"
            )
