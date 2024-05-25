from datetime import datetime

from flask import abort, current_app, flash, g, redirect, render_template, request, session, url_for

from tahrir.app import oidc
from tahrir.utils.badge import convert_name_to_id, generate_badge_yaml
from tahrir.utils.user import require_admin

from . import blueprint as bp


@bp.route("/admin", methods=["GET", "POST"])
@oidc.require_login
@require_admin
def admin():
    if not g.oidc_user.is_admin:
        abort(403, "Unauthorized.")
    session["came_from"] = url_for("tahrir.admin")
    # Handle any admin actions. These are done through POSTS via the
    # HTML forms on the admin panel.
    if request.method == "POST":
        if request.form.get("add-team"):
            team_name = request.form.get("team-name")
            team_id = convert_name_to_id(team_name)
            if not g.tahrirdb.team_exists(team_id=team_id):
                g.tahrirdb.create_team(name=team_name)
                flash(f"You created a team with name {team_name}")
            else:
                flash(f"Team with name {team_name} already exists.")

        elif request.form.get("add-series"):
            data = request.form
            series_name = data.get("series-name")
            series_id = convert_name_to_id(series_name)
            if not g.tahrirdb.series_exists(series_id):
                description = data.get("series-description")
                tags = data.get("series-tags")
                team_id = data.get("series-team-id")

                g.tahrirdb.create_series(
                    series_id=series_id,
                    name=series_name,
                    desc=description,
                    tags=tags,
                    team_id=team_id,
                )
                flash(f"You created a series with name {series_name}")
            else:
                flash(f"Series with name {series_name} already exists.")

        elif request.form.get("add-milestone"):
            data = request.form
            series_id = data.get("milestone-series-id")
            badge_id = data.get("milestone-badge-id")
            if not g.tahrirdb.milestone_exists_for_badge_series(badge_id, series_id):
                position = data.get("milestone-position")
                g.tahrirdb.create_milestone(
                    position=position, series_id=series_id, badge_id=badge_id
                )
                flash(f"You add badge {badge_id} as milestone in series {series_id}")
            else:
                flash(f"Badge {badge_id} already added as milestone in series {series_id}")

        elif request.form.get("add-person"):
            # Email is a required field on the HTML form.
            # Add a Badge to the DB.
            email = request.form.get("person-email")
            if not g.tahrirdb.person_exists(email=email):
                g.tahrirdb.add_person(
                    email,
                    nickname=request.form.get("person-nickname"),
                )
                flash("You added a person with email {}".format(request.form.get("person-email")))
            else:
                flash(f"Person with email {email} already exists.")
        elif request.form.get("add-badge"):
            name = request.form.get("badge-name")
            idx = convert_name_to_id(name)
            if not g.tahrirdb.badge_exists(idx):
                # Add a Badge to the DB.
                g.tahrirdb.add_badge(
                    name,
                    request.form.get("badge-image"),
                    request.form.get("badge-description"),
                    request.form.get("badge-criteria"),
                    request.form.get("badge-issuer"),
                    request.form.get("badge-tags"),
                )
                flash(f"You added a badge with name {name}")
            else:
                flash(f"Badge with id {idx} already exists.")

        elif request.form.get("add-invitation"):
            # Add an Invitation to the DB.
            try:
                created_on = datetime.strptime(
                    request.form.get("invitation-created"), "%Y-%m-%d %H:%M"
                )
            except ValueError:
                created_on = None  # Will default to datetime.now(timezone.utc)

            try:
                expires_on = datetime.strptime(
                    request.form.get("invitation-expires"), "%Y-%m-%d %H:%M"
                )
            except ValueError:
                expires_on = None  # Will default to datettime.now(timezone.utc)

            created_by = request.form.get("invitation-issuer-email")
            if "@" not in created_by:
                created_by = f"{created_by}@{current_app.config['TAHRIR_EMAIL_DOMAIN']}"
            try:
                g.tahrirdb.add_invitation(
                    request.form.get("invitation-badge-id"),
                    created_on=created_on,
                    expires_on=expires_on,
                    created_by_email=created_by,
                )
            except ValueError as e:
                flash(str(e))
            else:
                flash(
                    "You added an invitation for badge {}".format(
                        request.form.get("invitation-badge-id")
                    )
                )
        elif request.form.get("add-issuer"):
            origin = request.form.get("issuer-origin")
            name = request.form.get("issuer-name")
            if not g.tahrirdb.issuer_exists(origin, name):
                # Add an Issuer to the DB.
                g.tahrirdb.add_issuer(
                    origin, name, request.form.get("issuer-org"), request.form.get("issuer-contact")
                )
                flash(
                    "You added an issuer with the name {}".format(request.form.get("issuer-name"))
                )
            else:
                flash(f"Issuer with origin {origin} and name {name} already exists.")

        elif request.form.get("add-assertion"):
            idx = request.form.get("assertion-badge-id")
            email = request.form.get("assertion-person-email")
            if not g.tahrirdb.assertion_exists(idx, email):
                # Add an Assertion to the DB.
                try:
                    issued_on = datetime.strptime(
                        request.form.get("assertion-issued-on"), "%Y-%m-%d %H:%M"
                    )
                except ValueError:
                    issued_on = None  # Will default to datetime.now(timezone.utc)

                g.tahrirdb.add_assertion(
                    request.form.get("assertion-badge-id"),
                    request.form.get("assertion-person-email"),
                    issued_on,
                )
                flash(
                    f"You awarded {request.form.get('assertion-badge-id')} "
                    f"to {request.form.get('assertion-person-email')}"
                )
            else:
                flash(f"User with email {email} already has badge {idx}.")

        elif request.form.get("add-authorization"):
            idx = request.form.get("authorization-badge-id")
            email = request.form.get("authorization-person-email")
            if "@" not in email:
                email = f"{email}@{current_app.config['TAHRIR_EMAIL_DOMAIN']}"

            if not g.tahrirdb.authorization_exists(idx, email):
                g.tahrirdb.add_authorization(idx, email)
                flash(f"You authorized {email} to issue {idx}")
            else:
                flash(f"{email} is already authorized to issue {idx}.")

    return render_template(
        "admin.html",
        issuers=g.tahrirdb.get_all_issuers().all(),
    )


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
    return redirect(url_for("tahrir.admin"))


@bp.route("/add_tag", methods=["POST"])
@oidc.require_login
@require_admin
def add_tag(request):
    badge_id = request.form.get("badge_id")
    badge = g.tahrirdb.get_badge(badge_id)
    if not badge:
        abort(404, f"No such badge {badge_id!r}")

    tags = request.form.get("tags", "")
    new_tags = [tag.strip() for tag in tags.strip().split(",") if tag.strip()]
    originals = [tag.strip() for tag in badge.tags.split(",") if tag.strip()]
    badge.tags = ",".join(set(originals + new_tags)) + ","
    g.tahrirdb.session.flush()

    return redirect(url_for("tahrir.badge", badge_id=badge.id))


@bp.route("/builder", methods=["GET", "POST"])
def builder():
    # set came_from so we can get back home after openid auth.
    session["came_from"] = url_for("tahrir.builder")

    # get default creator field
    default_creator = None
    if g.oidc_user.person:
        default_creator = g.oidc_user.person.nickname or g.oidc_user.person.email

    badge_yaml = None
    if request.method == "POST":
        badge_yaml = generate_badge_yaml(request.form)

    return render_template(
        "builder.html",
        default_creator=default_creator,
        badge_yaml=badge_yaml,
    )
