import tahrir_api.model as m

import hashlib
import os
import shutil
import tempfile
from datetime import (
    datetime,
    timedelta,
)

import logging
log = logging.getLogger(__name__)


def scale_to_standard_size(filename):
    try:
        import magickwand.image as magick
    except Exception, e:
        log.warn(str(e))
        log.warn("Did not scale image to standard size")
        return

    img = magick.Image(filename)
    w, h = img.size
    s = min(w, h)
    wo = int(float(w - s) / 2.0)
    ho = int(float(h - s) / 2.0)

    img.crop((s, s), (wo, ho))
    img.thumbnail(256)
    handle, tempname = tempfile.mkstemp(suffix='.png')
    img.save(tempname)
    shutil.move(filename, filename + '.original')
    shutil.move(tempname, filename)
