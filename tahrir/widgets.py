
import model as m
import tw2.core as twc
import tw2.sqla as tws
import tw2.forms as twf


class IssuerForm(tws.DbFormPage):
    entity = m.Issuer
    class child(twf.TableForm):
        id = twf.HiddenField()
        origin = twf.TextField(validator=twc.Required)
        name = twf.TextField(validator=twc.Required)
        org = twf.TextField(validator=twc.Required)
        contact = twf.TextField(validator=twc.Required)


class SavingFileField(twf.FileField):
    validator = twf.FileValidator(extesion='.png')

    def _validate(self, value, state=None):
        try:
            super(SavingFileField, self)._validate(value, state)
            # TODO -- actually save this file
            print self.value.value
            self.value = self.value.filename
            return self.value
        except twc.ValidationError:
            sys.exit(1)
            self.value = None
            raise


class BadgeForm(tws.DbFormPage):
    entity = m.Badge
    class child(twf.TableForm):
        id = twf.HiddenField()
        name = twf.TextField(validator=twc.Required)
        image = SavingFileField
        description = twf.TextField(validator=twc.Required)
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
