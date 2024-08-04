from flask import Blueprint, request, jsonify
from models import User
from app import db

bp = Blueprint('seeds', __name__, url_prefix='/seeds')


@bp.route('/get', methods=['POST'])
def get_seeds():
    data = request.get_json()
    user_id = data.get('user_id')

    # Пример: получение семян для пользователя
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    seeds = {'common': [], 'rare': [], 'epic': [], 'legendary': []}  # Заполните реальными данными
    return jsonify(seeds), 200


@bp.route('/reward', methods=['POST'])
def get_reward():
    data = request.get_json()
    user_id = data.get('user_id')

    # Пример: выдача награды пользователю
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    reward = {'item': 'seed', 'rarity': 'epic'}  # Заполните реальными данными
    return jsonify(reward), 200
