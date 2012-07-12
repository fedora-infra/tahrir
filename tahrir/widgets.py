
import tahrir_api.model as m
import tw2.core as twc
import tw2.sqla as tws
import tw2.forms as twf

import hashlib
import os
import shutil
import tempfile

import logging
log = logging.getLogger(__name__)


class IssuerForm(tws.DbFormPage):
    entity = m.Issuer

    class child(twf.TableForm):
        id = twf.HiddenField()
        origin = twf.TextField(validator=twc.Required)
        name = twf.TextField(validator=twc.Required)
        org = twf.TextField(validator=twc.Required)
        contact = twf.TextField(validator=twc.Required)

def scale_to_standard_size(filename):
    try:
        import magickwand.image as magick
    except Exception, e:
        log.warn(str(e))
        log.warn("Did not scale image to standard size")

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



class SavingFileField(twf.FileField):
    validator = twf.FileValidator(extesion='.png', required=True)

    png_dir = None

    def _save_file(self, filename, value):
        if not self.png_dir:
            raise twc.ValidationError("Image saving is misconfigured.")

        filename = os.path.sep.join([self.png_dir, filename])
        log.info("Writing image to %s" % filename)

        with open(filename, 'wb') as f:
            f.write(value)

        scale_to_standard_size(filename)

        return True

    def _validate(self, value, state=None):
        try:
            super(SavingFileField, self)._validate(value, state)
            filename = hashlib.md5(self.value.filename).hexdigest() + ".png"
            self._save_file(filename, self.value.value)
            self.value = filename
            return self.value
        except twc.ValidationError:
            self.value = None
            raise


class BadgeForm(tws.DbFormPage):
    entity = m.Badge

    class child(twf.TableForm):
        id = twf.HiddenField()
        name = twf.TextField(validator=twc.Required)
        image = SavingFileField
        description = twf.TextArea(
            rows=5,
            cols=25,
            validator=twc.LengthValidator(max=128, min=1),
        )
        criteria = twf.TextField(validator=twc.Required)
        issuer = tws.DbRadioButtonList(entity=m.Issuer)


class AssertionForm(tws.DbFormPage):
    entity = m.Assertion

    class child(twf.TableForm):
        id = twf.HiddenField()
        badge = tws.DbRadioButtonList(entity=m.Badge)
        person = tws.DbRadioButtonList(entity=m.Person)


class PersonForm(tws.DbFormPage):
    entity = m.Person

    class child(twf.TableForm):
        id = twf.HiddenField()
        email = twf.TextField(validator=twc.Required)
