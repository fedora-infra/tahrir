import hashlib
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

class Assertion(DeclarativeBase):
    __tablename__ = 'assertions'
    id = Column(Integer, primary_key=True)
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
