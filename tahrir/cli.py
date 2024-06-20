import os
from pathlib import Path

import yaml
from flask import current_app
from flask.cli import AppGroup
from tahrir_api.utils import get_db_manager_from_uri

from tahrir.database import db
from tahrir.utils.badge import ISSUER


tahrir_cli = AppGroup("tahrir")
"""Commands for the Tahrir application."""


@tahrir_cli.command("sync-db")
def sync_db():
    """Initialize or update the database."""
    db_mgr = get_db_manager_from_uri(current_app.config["SQLALCHEMY_DATABASE_URI"])
    result = db_mgr.sync()
    current_app.logger.info("Database was: %s", result.name.lower())


@tahrir_cli.command("load-badges")
def load_badges():
    """Load badges from the configured directory of YAML files."""
    rules_dir = Path(current_app.config["TAHRIR_PNGS_PATH"]).parent.joinpath("rules")
    tahrir_db = db.get_db()
    issuer_id = tahrir_db.add_issuer(**ISSUER)
    badges = _load_badges(tahrir_db, issuer_id, rules_dir.as_posix())
    current_app.logger.info("Loaded %s total badge definitions", len(badges))


def _load_badges(tahrir_db, issuer_id, rules_dir):
    badges = []
    current_app.logger.debug("Looking in %r to load badge definitions", rules_dir)
    for dirpath, _dirnames, filenames in os.walk(rules_dir):
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)
            badge = _load_badge_from_yaml(tahrir_db, issuer_id, filepath)
            if badge is not None:
                badges.append(badge)
        tahrir_db.session.commit()
    return badges


def _load_badge_from_yaml(tahrir_db, issuer_id, filepath):
    current_app.logger.debug("Loading %r", filepath)
    try:
        with open(filepath) as f:
            badge = yaml.safe_load(f.read())
    except Exception as e:
        current_app.logger.error("Loading %r failed with %r", filepath, e)
        return
    badge["badge_id"] = tahrir_db.add_badge(
        name=badge["name"],
        image=badge["image_url"],
        desc=badge["description"],
        criteria=badge["discussion"],
        tags=",".join(badge.get("tags", [])),
        issuer_id=issuer_id,
    )
    return badge
