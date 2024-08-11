from flask import Blueprint, request, jsonify
from alt.models import User

seeds_bp = Blueprint('seeds', __name__)

@seeds_bp.route('/api/seeds', methods=['POST'])
def get_seeds():
    user_id = request.json.get('userId')
    user:User = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    # request.json
    seeds = {
        "commonSeeds": {'seed':user.registered_on},
        "commonSeeds2": {'seed':user.common_seed},
        "commonSeeds3": {'seed':user.email},
        "commonSeeds4": {'seed':user.telegram_id},
        # "rareSeeds": {'seed':1},
        # "epicSeeds": {'seed':1},
        # "legendarySeeds": {'seed':1}
    }
    return jsonify(seeds)
