from flask import g, request
from flask_babel import Babel, get_locale


_LANGUAGES = []

babel = Babel()


def _get_accepted_languages():
    global _LANGUAGES
    if not _LANGUAGES:
        _LANGUAGES = [locale.language for locale in babel.list_translations()]
        _LANGUAGES.sort()
    return _LANGUAGES


@babel.localeselector
def pick_locale():
    return request.accept_languages.best_match(_get_accepted_languages())


@babel.timezoneselector
def get_timezone():
    user = getattr(g, "user", None)
    if user is not None:
        return user.timezone


def store_locale():
    # Store the current locale in g for access in the templates.
    g.locale = get_locale()
