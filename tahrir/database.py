# SPDX-FileCopyrightText: Contributors to the Fedora Project
#
# SPDX-License-Identifier: GPL-3.0-or-later

"""
Use sqlalchemy-helpers.

Import the functions we will use in the main code and in migrations.
"""

from flask import g
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from tahrir_api.dbapi import TahrirDatabase
from werkzeug.utils import find_modules, import_string


# Ref: https://flask.palletsprojects.com/en/2.0.x/extensiondev/
class TahrirDatabaseExtension:
    """A Flask extension to configure the database manager according the the app's configuration.

    It cleans up database connections at the end of the requests, and creates the CLI endpoint to
    sync the database schema.
    """

    def __init__(self, app=None):
        self.app = app
        self.Session = scoped_session(sessionmaker())
        self._notifications_callback = None
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        """Initialize the extention on the provided Flask app

        Args:
            app (flask.Flask): the Flask application.
        """
        # Set config defaults
        app.config.setdefault("SQLALCHEMY_DATABASE_URI", "sqlite:///:memory:")
        app.config.setdefault("NOTIFICATIONS_CALLBACK", "tahrir.notifications.callback")
        # Connect hook
        app.before_request(self.before_request)
        # Disconnect hook
        app.teardown_appcontext(self.teardown)

        self._notifications_callback = import_string(app.config["NOTIFICATIONS_CALLBACK"])

        # Engine & Session
        engine = create_engine(app.config["SQLALCHEMY_DATABASE_URI"])
        self.Session.configure(bind=engine)

        # Import all modules here that might define models so that
        # they will be registered properly on the metadata.
        models_location = "tahrir_api.model"
        try:
            for module in find_modules(models_location, include_packages=True, recursive=True):
                import_string(module)
        except ValueError:
            # It's just a module, importing it is enough
            import_string(models_location)

    def get_db(self):
        """Prepare the database at the start of each request."""
        session = self.Session()
        return TahrirDatabase(
            session=session, autocommit=True, notification_callback=self._notifications_callback
        )

    def teardown(self, exception):
        """Close the database connection at the end of each requests."""
        self.Session.remove()

    def before_request(self):
        """Prepare the database at the start of each request."""
        g.tahrirdb = self.get_db()


db = TahrirDatabaseExtension()
