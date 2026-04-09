import csv
import io

from flask import abort, g, jsonify, request

from ...app import csrf, oidc
from ...utils.badge import convert_name_to_id
from ...utils.user import require_admin
from . import blueprint as bp


@bp.route("/api/admin/badges", methods=["POST"])
@csrf.exempt
@oidc.require_login
@require_admin
def create_badge():
    """Endpoint to create new badge"""

    data = request.get_json()
    if not data:
        return abort(400, "No details provided")

    required_fields = ["name", "image", "description", "criteria", "issuer_id"]
    for field in required_fields:
        if not data.get(field):
            return abort(400, f"No detail provided for {field!r}")

    badge_id = convert_name_to_id(data.get("name"))

    if g.tahrirdb.badge_exists(badge_id):
        return abort(409, f"Badge {badge_id!r} already exists")

    g.tahrirdb.add_badge(
        name=data.get("name"),
        image=data.get("image"),
        desc=data.get("description"),
        criteria=data.get("criteria"),
        issuer_id=data.get("issuer_id"),
        tags=data.get("tags"),
    )

    return jsonify({"message": f"Badge {badge_id!r} created successfully"}), 201


@bp.route("/api/admin/badges/<string:badge_id>", methods=["PUT"])
@csrf.exempt
@oidc.require_login
@require_admin
def update_badge(badge_id):
    """Endpoint to update existing badge"""

    if not badge_id:
        return abort(400, "No badge ID provided")

    data = request.get_json()
    if not data:
        return abort(400, "No details provided")

    try:
        result = g.tahrirdb.update_badge(badge_id, **data)

        if not result:
            return abort(404, f"Badge {badge_id!r} not found")

        return jsonify({"message": f"Badge {badge_id!r} updated successfully"})

    except KeyError as e:
        return abort(400, str(e))


@bp.route("/api/admin/badges/<string:badge_id>", methods=["DELETE"])
@csrf.exempt
@oidc.require_login
@require_admin
def delete_badge(badge_id):
    """Endpoint to delete a badge"""

    if not badge_id:
        return abort(400, "No ID provided")

    result = g.tahrirdb.delete_badge(badge_id)

    if not result:
        return abort(404, f"Badge {badge_id!r} not found")

    return jsonify({"message": f"Badge {badge_id!r} deleted successfully"})


@bp.route("/api/admin/badges/award/csv", methods=["POST"])
@csrf.exempt
@oidc.require_login
@require_admin
def award_badges_from_csv():
    """Endpoint to award badges to multiple users from a CSV file.

    Expected CSV format (one per line):
    email,badge_id
    or
    badge_id,email
    """
    if "csv-file" not in request.files:
        return abort(400, "No file uploaded")

    csv_file = request.files["csv-file"]
    if csv_file.filename == "":
        return abort(400, "No file selected")

    successful_awards = 0
    auto_created_persons = []
    already_awarded = []
    not_found_badges = []
    malformed_lines = []
    awards = []  # list of (email, badge_id) tuples

    # Use csv module for proper parsing
    try:
        content = csv_file.read().decode("utf-8")
        reader = csv.reader(io.StringIO(content))
        for row in reader:
            if not row or len(row) != 2:
                malformed_lines.append(",".join(row) if row else "<empty line>")
                continue

            value_a = row[0].strip()
            value_b = row[1].strip()

            if not value_a or not value_b:
                malformed_lines.append(",".join(row))
                continue

            # Normalize: always (email, badge_id)
            if "@" in value_a:
                email, badge_id = value_a, value_b
            else:
                badge_id, email = value_a, value_b

            # Basic email validation before auto-creating user
            if not email or "@" not in email or "." not in email.split("@")[-1]:
                malformed_lines.append(f"{email},{badge_id} (invalid email)")
                continue

            awards.append((email, badge_id))

    except Exception as e:
        return abort(400, f"Failed to parse CSV file: {str(e)}")

    if not awards and not malformed_lines:
        return abort(400, "The CSV file was empty")

    for email, badge_id in awards:
        # Check if badge exists
        if not g.tahrirdb.badge_exists(badge_id):
            not_found_badges.append(badge_id)
            continue

        # Check if person exists before auto-creating
        if not g.tahrirdb.person_exists(email=email):
            g.tahrirdb.add_person(email)
            auto_created_persons.append(email)

        # Award only if not already awarded
        if not g.tahrirdb.assertion_exists(badge_id, email):
            g.tahrirdb.add_assertion(badge_id, email, None)
            successful_awards += 1
        else:
            already_awarded.append(f"{email} ({badge_id})")

    # Build response
    response_data = {
        "successful_awards": successful_awards,
        "auto_created_persons": auto_created_persons,
        "already_awarded": already_awarded,
        "not_found_badges": not_found_badges,
        "malformed_lines": malformed_lines,
    }

    if successful_awards > 0:
        response_data["message"] = f"Successfully awarded {successful_awards} badge(s)."
        status_code = 200
    else:
        response_data["message"] = "No badges were awarded. Please check the errors below."
        status_code = 400  # Bad Request if nothing succeeded

    return jsonify(response_data), status_code
