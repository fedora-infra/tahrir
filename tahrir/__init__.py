import os

from pyramid.config import Configurator
from sqlalchemy import engine_from_config

from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from pyramid.session import UnencryptedCookieSessionFactoryConfig

from .app import get_root
from tahrir_api.model import DBSession
from .widgets import SavingFileField


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """

    required_keys = [
        'tahrir.salt',
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

    # Set that directory on the filefield widget.
    SavingFileField.png_dir = settings['tahrir.pngs.uri']

    # start setting things up
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)

    authn_policy = AuthTktAuthenticationPolicy(
        secret='verysecret',
    )
    authz_policy = ACLAuthorizationPolicy()
    session_factory = UnencryptedCookieSessionFactoryConfig(
            settings['session.secret'])
    config = Configurator(
            settings=settings,
            root_factory=get_root,
            session_factory=session_factory)

    config.include('velruse.providers.openid')
    config.add_openid_login(
        realm="http://localhost:6543/"
    )

    config.set_authentication_policy(authn_policy)
    config.set_authorization_policy(authz_policy)

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
    config.add_route('login', '/login')
    config.add_route('logout', '/logout')

    config.scan()

    return config.make_wsgi_app()
