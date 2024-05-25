from flask import current_app, g
from flask_healthz import HealthError
from sqlalchemy_helpers.manager import DatabaseStatus
from tahrir_api.utils import get_db_manager_from_uri


def liveness():
    pass


def readiness():
    db_mgr = get_db_manager_from_uri(current_app.config["SQLALCHEMY_DATABASE_URI"])
    try:
        status = db_mgr.get_status(session=g.tahrirdb.session)
    except Exception as e:
        raise HealthError(f"Can't get the database status: {e}") from e
    if status is DatabaseStatus.NO_INFO:
        raise HealthError("Can't connect to the database")
    if status is DatabaseStatus.UPGRADE_AVAILABLE:
        raise HealthError("The database schema needs to be updated")
