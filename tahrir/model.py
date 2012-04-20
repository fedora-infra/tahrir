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
    name = Column(Unicode(128), nullable=False)
    org = Column(Unicode(128), nullable=False)
    contact = Column(Unicode(128), nullable=False)
    badges = relationship("Badge", backref="issuer")

    def __json__(self):
        return dict(
            origin=self.origin,
            name=self.name,
            org=self.org,
            contact=self.contact,
        )


class Badge(DeclarativeBase):
    __tablename__ = 'badges'
    id = Column(Unicode, primary_key=True)
    name = Column(Unicode(128), nullable=False)
    image = Column(Unicode(128), nullable=False)
    description = Column(Unicode(128), nullable=False)
    criteria = Column(Unicode(128), nullable=False)
    assertions = relationship("Assertion", backref="badge")
    issuer_id = Column(Integer, ForeignKey('issuers.id'))

    def __init__(self, *args, **kw):
        super(Badge, self).__init__(*args, **kw)
        self.id = self.name.lower().replace(' ', '-')

    def __json__(self):
        return dict(
            version="0.5.0",
            name=self.name,
            image=self.image,
            description=self.description,
            criteria=self.criteria,
            issuer=self.issuer.__json__(),
        )


class Person(DeclarativeBase):
    __tablename__ = 'persons'
    id = Column(Integer, primary_key=True)
    email = Column(Unicode(128), nullable=False)
    assertions = relationship("Assertion", backref="person")


class Assertion(DeclarativeBase):
    __tablename__ = 'assertions'
    id = Column(Integer, primary_key=True)
    badge_id = Column(Integer, ForeignKey('badges.id'))
    person_id = Column(Integer, ForeignKey('persons.id'))
    salt = Column(Unicode(128), nullable=False)
    issued_on = Column(DateTime)

    recipient = Column(Unicode(256))

    def __init__(self, *args, **kw):
        super(Assertion, self).__init__(*args, **kw)
        self.recipient = \
                hashlib.sha256(self.person.email + self.salt).hexdigest()

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
