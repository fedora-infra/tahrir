import hashlib
import pygments.lexers
import pygments.formatters
import simplejson

from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    Unicode,
    ForeignKey,
)

from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy.orm import (
    scoped_session,
    sessionmaker,
    relationship,
    backref,
)

from zope.sqlalchemy import ZopeTransactionExtension

DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
DeclarativeBase = declarative_base()
DeclarativeBase.query = DBSession.query_property()


class Issuer(DeclarativeBase):
    __tablename__ = 'issuers'
    id = Column(Integer, primary_key=True)
    origin = Column(Unicode(128), nullable=False)
    name = Column(Unicode(128), nullable=False, unique=True)
    org = Column(Unicode(128), nullable=False)
    contact = Column(Unicode(128), nullable=False)
    badges = relationship("Badge", backref="issuer")

    def __unicode__(self):
        return self.name

    def __json__(self):
        return dict(
            origin=self.origin,
            name=self.name,
            org=self.org,
            contact=self.contact,
        )


def badge_id_default(context):
    return context.current_parameters['name'].lower().replace(' ', '-')


class Badge(DeclarativeBase):
    __tablename__ = 'badges'
    id = Column(Unicode, primary_key=True, default=badge_id_default)
    name = Column(Unicode(128), nullable=False, unique=True)
    image = Column(Unicode(128), nullable=False)
    description = Column(Unicode(128), nullable=False)
    criteria = Column(Unicode(128), nullable=False)
    assertions = relationship("Assertion", backref="badge")
    issuer_id = Column(Integer, ForeignKey('issuers.id'), nullable=False)

    def __unicode__(self):
        return self.name

    def __json__(self):
        return dict(
            version="0.5.0",
            name=self.name,
            image="/pngs/" + self.image,
            description=self.description,
            criteria=self.criteria,
            issuer=self.issuer.__json__(),
        )


class Person(DeclarativeBase):
    __tablename__ = 'persons'
    id = Column(Integer, primary_key=True)
    email = Column(Unicode(128), nullable=False, unique=True)
    assertions = relationship("Assertion", backref="person")

    @property
    def gravatar_link(self):
        d, s = 'mm', 24
        hash = hashlib.md5(self.email).hexdigest()
        url = "http://www.gravatar.com/avatar/%s?s=%i&d=%s" % (hash, s, d)
        return url

    def __unicode__(self):
        return self.email


def recipient_default(context):
    person_id = context.current_parameters['person_id']
    person = Person.query.filter_by(id=person_id).one()
    return hashlib.sha256(
        person.email + context.current_parameters['salt']
    ).hexdigest()


def salt_default(context):
    # TODO -- some how we need to get this value from the config.  :)
    return "beefy"


def assertion_id_default(context):
    person_id = context.current_parameters['person_id']
    badge_id = context.current_parameters['badge_id']
    return "%r -> %r" % (badge_id, person_id)


class Assertion(DeclarativeBase):
    __tablename__ = 'assertions'
    id = Column(Unicode(128), primary_key=True, unique=True,
                default=assertion_id_default)
    badge_id = Column(Unicode, ForeignKey('badges.id'), nullable=False)
    person_id = Column(Integer, ForeignKey('persons.id'), nullable=False)
    salt = Column(Unicode(128), nullable=False, default=salt_default)
    issued_on = Column(DateTime)

    recipient = Column(Unicode(256), nullable=False, default=recipient_default)

    def __unicode__(self):
        return unicode(self.badge) + " <-> " + unicode(self.person)

    @property
    def _recipient(self):
        return "sha256$%s" % self.recipient

    def __json__(self):
        result = dict(
            recipient=self._recipient,
            salt=self.salt,
            badge=self.badge.__json__(),
        )

        if self.issued_on:
            result['issued_on'] = self.issued_on.strftime("%Y-%m-%d")

        return result

    # TODO -- make a "traversable" mixin that adds REST-like methods
    def __getitem__(self, key):
        if key not in ("pygments", "delete"):
            raise KeyError

        return getattr(self, "__%s__" % key)()

    def __delete__(self):
        return lambda: DBSession.delete(self)

    def __pygments__(self):
        html_args = {'full': False}
        pretty_encoder = simplejson.encoder.JSONEncoder(indent=2)
        html = pygments.highlight(
            pretty_encoder.encode(self.__json__()),
            pygments.lexers.JavascriptLexer(),
            pygments.formatters.HtmlFormatter(**html_args)
        ).strip()
        return html
