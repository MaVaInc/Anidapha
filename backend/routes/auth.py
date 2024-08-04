from flask import Blueprint, request, jsonify
from models import User
from app import db

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    telegram_id = data.get('telegram_id')
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if User.query.filter_by(telegram_id=telegram_id).first():
        return jsonify({'message': 'User already exists'}), 400

    new_user = User.create_user(telegram_id, username, password, email)
    return jsonify({'message': 'User registered successfully'}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    telegram_id = data.get('telegram_id')

    access_token = User.authenticate_user(telegram_id)
    if access_token:
        return jsonify({'access_token': access_token}), 200

    return jsonify({'message': 'Invalid credentials'}), 401
