import json
import os
import sys
from collections import OrderedDict

from flask import Flask
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from tahrir_api.dbapi import TahrirDatabase
from tqdm import tqdm

RARITIES = ["X", "S", "A", "B", "C", "D"]


def generate_rarities(sessmake):
    accodict = {}
    with sessmake() as sessobjc:
        database = TahrirDatabase(session=sessobjc, autocommit=False)
        accolist = database.get_all_badges().all()
        userpoll = database.get_all_persons().count()
        pbar = tqdm(
            accolist,
            total=len(accolist),
            colour="#008080",
            leave=False,
            bar_format="{desc} {percentage:4.2f}%|{bar}| {n_fmt}/{total_fmt} [{elapsed}<{remaining}, {rate_fmt}]",  # noqa: E501
        )
        for unit in pbar:
            pbar.set_description(f"Processing {unit.name[:20]:<20}")
            giftlist = database.get_assertions_by_badge(unit.id)
            accodict[unit.id] = {"poll": len(giftlist), "rate": len(giftlist) / userpoll * 100}

    """
    The count of badges is equally (read equivalently) divided into the count of rarities
    to ensure that all rarities have a similar count of badges. In case the floor
    division ends up leaving a remainder behind, that remainder is further shared among
    all the rarities to ensure fairness.

    For e.g., at the time of writing this code, there is a total of 628 badges and I created
    6 rarity levels, starting from X (most rare) to D (least rare). The dictionary of
    badges is sorted with respect to the assertion count and then, equal segments of sizes
    equalling ~ (628 // 6) are created.

    As 628 does not divide neatly by 6, the size of each rarity becomes 104 (i.e. 628 // 6)
    before the remainder 4 (i.e. 628 % 6) is also spread through all the rarities from X
    onwards until we run out of it. This ends up in a division where X, S, A and B rarities
    have 105 badges and C and D rarities have 104 badges.
    """
    accodict = OrderedDict(sorted(accodict.items(), key=lambda item: item[1]["poll"]))
    rarities = {name: [] for name in RARITIES}
    size = len(accodict.keys()) // len(RARITIES)
    left = len(accodict.keys()) % len(RARITIES)
    jump = 0
    for iter, rare in enumerate(rarities.keys()):
        stop = jump + size + (1 if iter < left else 0)
        for iden, data in list(accodict.items())[jump:stop]:
            data["rare"] = rare
            rarities[rare].append(iden)
        jump = stop

    jsondata = {
        "rarity": rarities,
        "badges": accodict,
    }
    with open("rarities.json", "w") as json_file:
        json.dump(jsondata, json_file, indent=4, sort_keys=False)
    print("Rarities saved to 'rarities.json' - Move this file into the tahrir/static directory")


def main():
    app = Flask(__name__)
    if "FLASK_CONFIG" in os.environ:
        app.config.from_envvar("FLASK_CONFIG")
    database_uri = app.config.get("SQLALCHEMY_DATABASE_URI")
    try:
        sessmake = sessionmaker(bind=create_engine(database_uri))
        generate_rarities(sessmake)
    except Exception as expt:
        print(f"Rarities generation failed: {expt}")
        sys.exit(1)
