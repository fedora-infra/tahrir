import tahrir_api.model as m
from flask import g, jsonify, render_template, request

from tahrir.utils.user import get_person

from . import blueprint as bp


@bp.route("/leaderboard")
def leaderboard():
    """Render a top users view."""

    query = (
        g.tahrirdb.session.query(m.Person)
        .order_by(
            m.Person.rank,
            m.Person.created_on,
        )
        .filter(m.Person.opt_out.is_(False))
    )

    leaderboard = query.filter(m.Person.rank.isnot(None)).all()
    # Get total user count.
    user_count = len(leaderboard)
    leaderboard.extend(query.filter(m.Person.rank.is_(None)).all())

    user_to_rank = g.tahrirdb._make_leaderboard()

    if g.oidc_user.person:
        awarded_assertions = g.oidc_user.person.assertions
        rank = g.oidc_user.person.rank or 0
        idx = rank - 1

        # Handle the case of leaderboard[-2:2] which will be [] always.
        if idx < 2:
            idx = 2

        competitors = leaderboard[(idx - 2) : (idx + 3)]

        try:
            percentile = (float(rank) / float(user_count)) * 100
        except ZeroDivisionError:
            percentile = 0
    else:
        awarded_assertions = None
        rank = None
        competitors = None
        percentile = None

    return render_template(
        "leaderboard.html",
        awarded_assertions=awarded_assertions,
        top_persons_sorted=leaderboard,
        rank=rank,
        user_count=user_count,
        percentile=percentile,
        competitors=competitors,
        user_to_rank=user_to_rank,
    )


@bp.route("/leaderboard/json")
@bp.route("/leaderboard/<user_id>/json")
def leaderboard_json(user_id=None):
    """Render a top-users JSON dump."""

    limit = int(request.args.get("limit", 25))
    user = None
    if user_id:
        user = get_person(user_id)

    query = (
        g.tahrirdb.session.query(m.Person)
        .order_by(
            m.Person.rank,
            m.Person.created_on,
        )
        .filter(m.Person.opt_out.is_(False))
    )

    leaderboard = query.filter(m.Person.rank.isnot(None)).all()
    # Get total user count.
    # user_count = len(leaderboard)
    leaderboard.extend(query.filter(m.Person.rank.is_(None)).all())

    user_to_rank = g.tahrirdb._make_leaderboard()

    if user:
        rank = user.rank or 0
        idx = rank - 1

        # Handle the case of leaderboard[-2:2] which will be [] always.
        if idx < 2:
            idx = 2

        leaderboard = leaderboard[(idx - 2) : (idx + 3)]
    else:
        leaderboard = leaderboard[:limit]

    ret = [
        {**user_to_rank[p], **{"nickname": p.nickname}} for p in leaderboard if p in user_to_rank
    ]

    return jsonify({"leaderboard": ret})
