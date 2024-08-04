# from flask import Flask, render_template, redirect, url_for, request, session
#
# app = Flask(__name__)
# app.secret_key = 'your_secret_key'
#
# @app.route('/')
# def home():
#     return render_template('index.html')
#
# @app.route('/login')
# def telegram_auth():
#     return '''
#     <script async src="https://telegram.org/js/telegram-widget.js?15"
#         data-telegram-login="YOUR_BOT_USERNAME"
#         data-size="large"
#         data-auth-url="/auth/telegram/callback"
#         data-request-access="write">
#     </script>
#     '''
#
# @app.route('/auth/telegram/callback')
# def auth_callback():
#     # обработка ответа от Telegram
#     return redirect(url_for('home'))
#
# if __name__ == '__main__':
#     app.run()


from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

from models import user
from routes import auth, seeds

app.register_blueprint(auth.bp)
app.register_blueprint(seeds.bp)

if __name__ == '__main__':
    app.run()

