
import datetime
import os
import pprint
import sys
import transaction

from sqlalchemy import engine_from_config

from pyramid.paster import (
    get_appsettings,
    setup_logging,
)

from ..model import (
    DBSession,
    Issuer,
    Badge,
    Person,
    Assertion,
    DeclarativeBase,
)

def usage(argv):
    cmd = os.path.basename(argv[0])
    print('usage: %s <config_uri>\n'
          '(example: "%s development.ini")' % (cmd, cmd))
    sys.exit(1)

def main(argv=sys.argv):
    if len(argv) != 2:
        usage(argv)

    config_uri = argv[1]
    setup_logging(config_uri)
    settings = get_appsettings(config_uri, name="pyramid")
    import pprint
    pprint.pprint(settings)
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    DeclarativeBase.metadata.create_all(engine)

    return  # Skip all the following... just leaving it for posterity

    with transaction.manager:
        issuer = Issuer(
            name="Ralph Bean",
            origin="http://badges.threebean.org",
            org="threebean.org",
            contact="rbean@redhat.com",
        )
        DBSession.add(issuer)
        badge = Badge(
            name="Plus One!",
            image="/pngs/threebean-plus-one.png",
            description="""
            Got a recommendation from threebean for being awesome.
            """.strip(),
            criteria="/badges/plus-one",  # TODO -- how should this work?
            issuer=issuer,
        )
        DBSession.add(badge)
        person = Person(
            email="rbean@redhat.com",
        )
        DBSession.add(person)
        assertion = Assertion(
            badge=badge,
            person=person,
            salt=settings['tahrir.salt'],
            issued_on=datetime.datetime.now(),
        )

        DBSession.add(assertion)

        pprint.pprint(assertion.__json__())
