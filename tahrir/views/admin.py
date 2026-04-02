from flask import flash, g, redirect, request, url_for

from tahrir.app import oidc
from tahrir.utils.user import require_admin

from . import blueprint as bp


@bp.route("/award_from_csv", methods=["POST"])
@oidc.require_login
@require_admin
def award_from_csv():
    csv_file = request.files["csv-file"]
    successful_awards = 0
    """TODO: We need some validation here, and flash
    a message whether the awards were successful or not.
    This should be added at the same time that flash
    messages are added to the admin panel."""
    awards = dict()  # str(badge_id) : str(person_email)
    for line in csv_file:
        values = line.split(",")
        """Through the following if statement, it doesn't matter
        if the line has been entered as "email, badge" or
        "badge, email". The awards dict will be normalized
        to be "badge, email". This code assumes that one of the
        two values will be a valid email address."""
        if values[0].find("@") == -1:
            # If there is no @ sign in the first value, it is the badge id.
            awards[values[1].strip()] = values[0].strip()
        else:
            # If there is an @ sign in the first value, it is the email.
            awards[values[0].strip()] = values[1].strip()

    for email, badge_id in awards.items():
        # First, if the person doesn't exist, we automatically
        # create the person in this special case.
        if not g.tahrirdb.person_exists(email=email):
            g.tahrirdb.add_person(email)
        # Second, if the badge exists and the person has yet
        # to be awarded it, give it to them.
        if g.tahrirdb.badge_exists(badge_id):
            if not g.tahrirdb.assertion_exists(badge_id, email):
                # The None will default to datetime.now().
                g.tahrirdb.add_assertion(badge_id, email, None)
                successful_awards += 1

    flash(f"Successfully awarded {successful_awards} badges.")
    return redirect(url_for("tahrir.home"))
