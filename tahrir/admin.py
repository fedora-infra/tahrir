from flask import g
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from tahrir_api import model

from .database import db


admin = Admin(name="Database", url="/dbadmin", endpoint="dbadmin", template_mode="bootstrap4")


class LazyModelView(ModelView):
    """Like ModelView, but lazily evaluates the DB session to have access to flask.g"""

    _session = None
    _session_getter = None

    @property
    def session(self):
        if self._session is None:
            if self._session_getter is None:
                raise RuntimeError("The session getter hasn't been set yet")
            self._session = self._session_getter()
        return self._session

    @session.setter
    def session(self, value):
        self._session_getter = value
        self._session = None


class TahrirModelView(ModelView):
    page_size = 50  # the number of entries to display on the list view

    def is_accessible(self):
        return g.oidc_user.is_admin


class BadgeToPersonView(TahrirModelView):
    column_searchable_list = ["badge_id", "badge.name", "person.nickname", "person.email"]


class BadgeView(TahrirModelView):
    column_display_pk = True
    form_columns = ["id", "name", "description", "image", "stl", "criteria", "tags"]
    column_searchable_list = ["id", "name", "description"]
    column_editable_list = ["name", "description", "tags"]
    column_filters = ["tags"]


class AssertionView(BadgeToPersonView):
    form_columns = ["badge_id", "person_id", "issued_on", "issued_for"]
    form_excluded_columns = ["recipient"]


class PersonView(TahrirModelView):
    form_columns = [
        "nickname",
        "email",
        "_avatar",
        "website",
        "bio",
        "created_on",
        "last_login",
        "opt_out",
        "assertions",
        "authorizations",
        "invitations",
    ]
    column_searchable_list = ["nickname", "email", "_avatar"]
    form_excluded_columns = ["rank"]
    inline_models = [
        model.Authorization,
        model.Invitation,
        (model.Assertion, dict(form_columns=("id", "badge_id", "issued_on", "issued_for"))),
    ]


admin.add_view(BadgeView(model.Badge, db.Session))
admin.add_view(PersonView(model.Person, db.Session))
admin.add_view(AssertionView(model.Assertion, db.Session))
admin.add_view(BadgeToPersonView(model.Authorization, db.Session))
admin.add_view(BadgeToPersonView(model.Invitation, db.Session))
