from flask import abort, flash, g, redirect, request, url_for

from tahrir.app import oidc
from tahrir.utils.user import require_admin

from . import blueprint as bp


@bp.route("/award_from_csv", methods=["POST"])
@oidc.require_login
@require_admin
def award_from_csv():
    if "csv-file" not in request.files:
        flash("No file uploaded.")
        return redirect(url_for("tahrir.home"))

    csv_file = request.files["csv-file"]

    if csv_file.filename == "":
        flash("No file selected.")
        return redirect(url_for("tahrir.home"))

    successful_awards = 0
    auto_created_persons = []
    already_awarded = []
    not_found_badges = []
    malformed_lines = []
    awards = {}  # str(email) : str(badge_id)

    for raw_line in csv_file:
        try:
            line = raw_line.decode("utf-8").strip()
        except UnicodeDecodeError:
            malformed_lines.append(repr(raw_line))
            continue

        if not line:
            continue

        values = line.split(",")

        if len(values) != 2:
            malformed_lines.append(line)
            continue

        value_a = values[0].strip()
        value_b = values[1].strip()

        # Normalise to email -> badge_id regardless of column order.
        if "@" in value_a:
            email, badge_id = value_a, value_b
        else:
            badge_id, email = value_a, value_b

        if not email or not badge_id:
            malformed_lines.append(line)
            continue

        awards[email] = badge_id

    if not awards and not malformed_lines:
        flash("The CSV file was empty.")
        return redirect(url_for("tahrir.home"))

    for email, badge_id in awards.items():
        # Validate badge exists before doing anything else.
        if not g.tahrirdb.badge_exists(badge_id):
            not_found_badges.append(badge_id)
            continue

        # Create person if they don't exist yet.
        if not g.tahrirdb.person_exists(email=email):
            g.tahrirdb.add_person(email)
            auto_created_persons.append(email)

        # Award badge if not already awarded.
        if not g.tahrirdb.assertion_exists(badge_id, email):
            g.tahrirdb.add_assertion(badge_id, email, None)
            successful_awards += 1
        else:
            already_awarded.append(f"{email} ({badge_id})")

    flash(f"Successfully awarded {successful_awards} badge(s).")

    if auto_created_persons:
        flash(
            f"{len(auto_created_persons)} user(s) did not exist and were "
            f"automatically created: {', '.join(auto_created_persons)}"
        )

    if already_awarded:
        flash(
            f"{len(already_awarded)} award(s) skipped — already awarded: "
            f"{', '.join(already_awarded)}"
        )

    if not_found_badges:
        flash(
            f"{len(not_found_badges)} badge(s) not found and skipped: {', '.join(not_found_badges)}"
        )

    if malformed_lines:
        flash(
            f"{len(malformed_lines)} line(s) malformed and skipped — each line must be "
            f"'email,badge_id' or 'badge_id,email': {', '.join(malformed_lines)}"
        )

    return redirect(url_for("tahrir.home"))


@bp.route("/add_tag", methods=["POST"])
@oidc.require_login
@require_admin
def add_tag():
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
