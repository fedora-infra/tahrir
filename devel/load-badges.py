#!/usr/bin/env python3

import logging
import os
from argparse import ArgumentParser
from pathlib import Path

import yaml
from paste.deploy import appconfig
from tahrir_api.dbapi import TahrirDatabase

log = logging.getLogger(__name__)

ISSUER = dict(
    name="Fedora Project",
    origin="http://badges.fedoraproject.org",
    org="http://fedoraproject.org",
    contact="badges@fedoraproject.org",
)


def get_settings_from_paste(config_path):
    return appconfig(f"config:{config_path}", name="pyramid", relative_to=os.getcwd())


def load_badge_from_yaml(db, issuer_id, filepath):
    log.debug("Loading %r", filepath)
    try:
        with open(filepath) as f:
            badge = yaml.safe_load(f.read())
    except Exception as e:
        log.error("Loading %r failed with %r", filepath, e)
        return
    badge["badge_id"] = db.add_badge(
        name=badge["name"],
        image=badge["image_url"],
        desc=badge["description"],
        criteria=badge["discussion"],
        tags=",".join(badge.get("tags", [])),
        issuer_id=issuer_id,
    )
    return badge


def load_badges(db, issuer_id, rules_dir):
    badges = []
    log.debug("Looking in %r to load badge definitions", rules_dir)
    for dirpath, _dirnames, filenames in os.walk(rules_dir):
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)
            badge = load_badge_from_yaml(db, issuer_id, filepath)
            if badge is not None:
                badges.append(badge)
        db.session.commit()
    return badges


def notification_callback(message):
    print(message.summary)


def parse_args():
    parser = ArgumentParser()
    parser.add_argument("config", help="paste INI config file")
    parser.add_argument("-d", "--debug", action="store_true", help="show more info")
    return parser.parse_args()


def main():
    args = parse_args()
    logging.basicConfig(level=logging.DEBUG if args.debug else logging.INFO, format="%(message)s")

    settings = get_settings_from_paste(args.config)
    db = TahrirDatabase(
        dburi=settings["sqlalchemy.url"],
        autocommit=False,
        notification_callback=notification_callback,
    )
    rules_dir = Path(settings["tahrir.pngs.uri"]).parent.joinpath("rules")
    issuer_id = db.add_issuer(**ISSUER)
    badges = load_badges(db, issuer_id, rules_dir.as_posix())
    log.info("Loaded %s total badge definitions", len(badges))


if __name__ == "__main__":
    main()
