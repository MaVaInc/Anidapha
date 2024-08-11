from flask import Blueprint, request, jsonify
from backend.models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    telegram_id = data.get('telegram_id')
    user = User.authenticate_user(telegram_id)
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
    return jsonify({"token": user})
