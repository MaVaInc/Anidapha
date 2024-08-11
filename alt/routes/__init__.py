from .seeds import seeds_bp
from .auth import auth_bp  # Импортируйте маршрут авторизации

def register_routes(app):
    app.register_blueprint(seeds_bp)
    app.register_blueprint(auth_bp)  # Зарегистрируйте все ваши маршруты
