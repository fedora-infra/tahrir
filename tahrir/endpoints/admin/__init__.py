from flask import Blueprint, jsonify


blueprint = Blueprint("admin", __name__)


@blueprint.errorhandler(400)
def api_bad_request(error):
    return jsonify({"error": str(error.description)}), 400


@blueprint.errorhandler(404)
def api_not_found(error):
    return jsonify({"error": str(error.description)}), 404


@blueprint.errorhandler(409)
def api_conflict(error):
    return jsonify({"error": str(error.description)}), 409
