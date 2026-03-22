# Tahrir — Fedora Badges

Tahrir is a [Flask](https://flask.palletsprojects.com/) application used by the Fedora Project for issuing [Open Badges](https://openbadges.org). As per the [about](https://openbadges.org/about/) page:

> The concept of Open Badges originated among those working at the Mozilla and
> MacArthur foundations, and out of the research of Erin Knight, founding
> director of the Open Badges project at Mozilla.

Originally, information was hosted on the [Mozilla Wiki][moz-badges].

[moz-badges]: https://wiki.mozilla.org/index.php?title=Badges&oldid=1170927

Tahrir is [Arabic for Liberation](http://en.wikipedia.org/wiki/Tahrir_Square). The name is total overkill.

The project is hosted [on Github](https://github.com/fedora-infra/tahrir).
You can read [the documentation](https://tahrir.readthedocs.org/) for more details.

You can see Tahrir deployed in [production](https://badges.fedoraproject.org/), or in the [staging instance](https://badges.stg.fedoraproject.org/).

![PyPI](https://img.shields.io/pypi/v/tahrir.svg)
![Supported Python versions](https://img.shields.io/pypi/pyversions/tahrir.svg)
![Build status](https://github.com/fedora-infra/tahrir/actions/workflows/main.yml/badge.svg?branch=develop)
![Documentation](https://readthedocs.org/projects/tahrir/badge/?version=latest)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Web framework | [Flask](https://flask.palletsprojects.com/) 3.x |
| Authentication | [Flask-OIDC](https://flask-oidc.readthedocs.io/) (OpenID Connect / FAS) |
| Database | SQLAlchemy 2.x (PostgreSQL in production, SQLite for local dev) |
| Database API | [tahrir-api](https://github.com/fedora-infra/tahrir-api) |
| Caching | [dogpile.cache](https://dogpilecache.sqlalchemy.org/) |
| Messaging | [fedora-messaging](https://fedora-messaging.readthedocs.io/) |
| Admin UI | Flask-Admin |
| i18n | Flask-Babel |
| Python | 3.10+ |

---

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for a full guide on setting up your local environment, running the tests, and submitting a pull request.

---

## Configuration

Tahrir is configured via a `.cfg` file pointed to by the `FLASK_CONFIG` environment variable.

The default configuration values are documented in [`tahrir/defaults.py`](tahrir/defaults.py).

The following keys must always be set:

| Key | Description |
|---|---|
| `SECRET_KEY` | Flask secret key for session signing and CSRF protection |
| `TAHRIR_PNGS_PATH` | Path to the directory containing badge PNG images |
| `TAHRIR_ADMIN_GROUPS` | List of OIDC groups with admin access |
| `TAHRIR_TITLE` | Site title displayed in the UI |

---

## License

Licensed under the [AGPLv3+ with additional permission](LICENSE).