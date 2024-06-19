import flask_babel
from flask import g, request


_LANGUAGES = []

babel = flask_babel.Babel()


def _get_accepted_languages():
    global _LANGUAGES
    if not _LANGUAGES:
        _LANGUAGES = [locale.language for locale in babel.list_translations()]
        _LANGUAGES.sort()
    return _LANGUAGES


def pick_locale():
    return request.accept_languages.best_match(_get_accepted_languages())


def store_locale():
    # Store the current locale in g for access in the templates.
    g.locale = flask_babel.get_locale()
