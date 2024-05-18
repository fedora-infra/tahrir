import os
from configparser import ConfigParser

from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from pyramid.config import Configurator
from pyramid.session import SignedCookieSessionFactory
from pyramid.settings import asbool
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from tahrir_api.dbapi import TahrirDatabase

from . import notifications
from .app import get_root
from .utils import cache


def main(global_config, **settings):
    """This function returns a Pyramid WSGI application."""

    session_cls = scoped_session(
        sessionmaker(
            bind=create_engine(settings["sqlalchemy.url"]),
        )
    )

    def get_db(request):
        """Database retrieval function to be added to the request for
        calling anywhere.
        """
        session = session_cls()
        return TahrirDatabase(
            session=session, autocommit=True, notification_callback=notifications.callback
        )

    required_keys = [
        "tahrir.pngs.uri",
        "tahrir.admin",
        "tahrir.title",
        "tahrir.base_url",
    ]

    # validate the config
    for key in required_keys:
        if key not in settings:
            raise ValueError(f"{key} required in settings.")

    # Make data dir if it doesn't already exist.
    settings["tahrir.pngs.uri"] = os.path.abspath(settings["tahrir.pngs.uri"])
    if not os.path.exists(settings["tahrir.pngs.uri"]):
        os.makedirs(settings["tahrir.pngs.uri"])

    # Load secret stuff from secret.ini.
    try:
        default_path = os.path.abspath("secret.ini")
        secret_path = settings.get("tahrir.secret_config_path", default_path)
        # TODO: There is a better way to log this message than print.
        print(f"Reading secrets from {secret_path!r}")
        parser = ConfigParser()
        parser.read(secret_path)
        secret_config = dict(parser.items("tahrir"))
        settings.update(secret_config)
    except Exception as e:
        # TODO: There is a better way to log this message than print.
        print(f"Failed to load secret.ini.  Reason: {str(e)!r}")

    authn_policy = AuthTktAuthenticationPolicy(
        secret=settings["authnsecret"],
        callback=groupfinder,  # groupfinder callback checks for admin privs
        hashalg="sha512",  # because md5 is deprecated
        secure=asbool(settings.get("tahrir.secure_cookies", True)),
        http_only=asbool(settings.get("tahrir.httponly_cookies", True)),
    )
    authz_policy = ACLAuthorizationPolicy()
    session_factory = SignedCookieSessionFactory(
        secret=settings["session.secret"],
        secure=asbool(settings.get("tahrir.secure_cookies", True)),
        httponly=asbool(settings.get("tahrir.httponly_cookies", True)),
    )

    # Configure our cache that we instantiated earlier.
    cache.configure_from_config(settings, "dogpile.cache.")

    config = Configurator(
        settings=settings,
        root_factory=get_root,
        session_factory=session_factory,
        authentication_policy=authn_policy,
        authorization_policy=authz_policy,
    )

    config.include("pyramid_mako")

    config.add_request_method(get_db, "db", reify=True)

    config.add_static_view(
        "static",
        settings.get("tahrir.theme_name", "tahrir") + ":static",
        cache_max_age=3600,
    )
    config.add_static_view(
        "pngs",
        settings["tahrir.pngs.uri"],
        cache_max_age=3600,
    )

    config.add_route("home", "/")
    config.add_route("heartbeat", "/heartbeat")

    # main admin endpoint
    config.add_route("admin", "/admin")

    # delegated admin endpoints
    config.add_route("award", "/award")
    config.add_route("invite", "/invite")
    config.add_route("add_tag", "/add_tag")

    config.add_route("qrcode", "/qrcode")
    config.add_route("badge", "/badge/{id}")
    config.add_route("badge_full", "/badge/{id}/full")
    config.add_route("badge_json", "/badge/{id}/json")
    config.add_route("badge_rss", "/badge/{id}/rss")
    config.add_route("badge_stl", "/badge/{id}/stl")
    config.add_route("builder", "/builder")
    config.add_route("about", "/about")
    config.add_route("explore", "/explore")
    config.add_route("explore_badges", "/explore/badges")
    config.add_route("explore_badges_rss", "/explore/badges/rss")
    config.add_route("leaderboard", "/leaderboard")
    config.add_route("leaderboard_json", "/leaderboard/json")
    config.add_route("rank_json", "/leaderboard/{id}/json")
    config.add_route("tags", "/tags/{tags}/{match}")
    config.add_route("user", "/user/{id}")
    config.add_route("user_json", "/user/{id}/json")
    config.add_route("user_rss", "/user/{id}/rss")
    config.add_route("user_team_json", "/user/{id}/team/{team_id}/json")
    config.add_route("diff", "/diff/{id_a}/{id_b}")
    config.add_route("report", "/report")
    config.add_route("report_this_month", "/report/this/month")
    config.add_route("report_year", "/report/{year}")
    config.add_route("report_year_month", "/report/{year}/{month}")
    config.add_route("report_year_week", "/report/{year}/week/{weeknumber}")
    config.add_route("report_year_month_day", "/report/{year}/{month}/{day}")
    config.add_route("award_from_csv", "/award_from_csv")

    config.include("tahrir.auth")

    # config.add_route('login', '/login')
    # config.add_route('logout', '/logout')

    # Used to grab a "was awarded" html snippet asynchronously
    config.add_route("assertion_widget", "/_w/assertion/{person}/{badge}")

    config.scan()

    return config.make_wsgi_app()


# I think this is fine here...
def groupfinder(userid, request):
    """Currently, this function simply checks if the user
    is listed as an admin in the config file (tahrir.ini).
    This is the callback function used by the authorization
    policy."""
    admins = [admin.strip() for admin in request.registry.settings["tahrir.admin"].split(",")]
    if userid in admins:
        return ["group:admins"]
    else:
        return []
