import os
import ConfigParser

import dogpile.cache
import dogpile.cache.util

from pyramid.config import Configurator

from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from pyramid.session import UnencryptedCookieSessionFactoryConfig
from pyramid.settings import asbool

from .app import get_root
from .utils import (
    make_avatar_method,
    make_relative_time_property,
    make_openid_identifier_property,
)

from tahrir_api.dbapi import TahrirDatabase
import tahrir_api.model

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from zope.sqlalchemy import ZopeTransactionExtension


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """

    cache = dogpile.cache.make_region(
        key_mangler=dogpile.cache.util.sha1_mangle_key)
    tahrir_api.model.Person.avatar_url = make_avatar_method(cache)

    identifier = settings.get('tahrir.openid_identifier')
    tahrir_api.model.Person.openid_identifier =\
            make_openid_identifier_property(identifier)

    tahrir_api.model.Person.created_on_rel =\
            make_relative_time_property('created_on')
    tahrir_api.model.Assertion.created_on_rel =\
            make_relative_time_property('created_on')
    tahrir_api.model.Assertion.issued_on_rel =\
            make_relative_time_property('issued_on')

    session_cls = scoped_session(sessionmaker(
        extension=ZopeTransactionExtension(),
        bind=create_engine(settings['sqlalchemy.url']),
    ))

    def get_db(request):
        """ Database retrieval function to be added to the request for
            calling anywhere.
        """
        session = session_cls()
        return TahrirDatabase(session=session, autocommit=False)

    required_keys = [
        'tahrir.pngs.uri',
        'tahrir.admin',
        'tahrir.title',
        'tahrir.base_url',
    ]

    # validate the config
    for key in required_keys:
        if key not in settings:
            raise ValueError("%s required in settings." % key)

    # Make data dir if it doesn't already exist.
    settings['tahrir.pngs.uri'] = os.path.abspath(settings['tahrir.pngs.uri'])
    if not os.path.exists(settings['tahrir.pngs.uri']):
        os.makedirs(settings['tahrir.pngs.uri'])

    # Load secret stuff from secret.ini.
    try:
        default_path = os.path.abspath("secret.ini")
        secret_path = settings.get('secret_config_path', default_path)
        # TODO: There is a better way to log this message than print.
        print "Reading secrets from %r" % secret_path
        parser = ConfigParser.ConfigParser()
        parser.read(secret_path)
        secret_config = dict(parser.items("tahrir"))
        settings.update(secret_config)
    except Exception as e:
        # TODO: There is a better way to log this message than print.
        print 'Failed to load secret.ini.  Reason: %r' % str(e)


    authn_policy = AuthTktAuthenticationPolicy(
        secret=settings['authnsecret'],
        callback=groupfinder, # groupfinder callback checks for admin privs
        hashalg='sha512', # because md5 is deprecated
        secure=asbool(settings['tahrir.secure_cookies']),
    )
    authz_policy = ACLAuthorizationPolicy()
    session_factory = UnencryptedCookieSessionFactoryConfig(
            settings['session.secret'])

    # Configure our cache that we instantiated earlier.
    cache.configure_from_config(settings, 'dogpile.cache.')

    config = Configurator(
            settings=settings,
            root_factory=get_root,
            session_factory=session_factory,
            authentication_policy=authn_policy,
            authorization_policy=authz_policy)

    config.include('velruse.providers.openid')
    config.add_openid_login(realm=settings.get('tahrir.openid_realm'))

    config.add_request_method(get_db, 'db', reify=True)

    config.add_static_view(
        'static',
        settings.get('tahrir.static.uri', 'static'),
        cache_max_age=3600,
    )
    config.add_static_view(
        'pngs',
        settings['tahrir.pngs.uri'],
        cache_max_age=3600,
    )

    config.add_route('home', '/')
    config.add_route('admin', '/admin')
    config.add_route('qrcode', '/qrcode')
    config.add_route('badge', '/badge/{id}')
    config.add_route('badge_json', '/badge/{id}/json')
    config.add_route('builder', '/builder')
    config.add_route('explore', '/explore')
    config.add_route('leaderboard', '/leaderboard')
    config.add_route('leaderboard_json', '/leaderboard/json')
    config.add_route('rank_json', '/leaderboard/{id}/json')
    config.add_route('tags', '/tags/{tags}/{match}')
    config.add_route('user', '/user/{id}')
    config.add_route('user_json', '/user/{id}/json')
    config.add_route('login', '/login')
    config.add_route('logout', '/logout')

    # Used to grab a "was awarded" html snippet asynchronously
    config.add_route('assertion_widget', '/_w/assertion/{person}/{badge}')

    config.scan()

    return config.make_wsgi_app()


# I think this is fine here...
def groupfinder(userid, request):
    """Currently, this function simply checks if the user
    is listed as an admin in the config file (tahrir.ini).
    This is the callback function used by the authorization
    policy."""
    admins = map(
        str.strip,
        request.registry.settings['tahrir.admin'].split(','),
    )
    if userid in admins:
        return ['group:admins']
    else:
        return []
