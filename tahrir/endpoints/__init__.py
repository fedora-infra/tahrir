from flask import Blueprint, jsonify

blueprint = Blueprint("api", __name__)


@blueprint.errorhandler(404)
def not_found(error):
    return jsonify({"error": str(error.description)}), 404
