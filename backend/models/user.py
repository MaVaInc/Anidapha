from app import db, bcrypt
from flask_jwt_extended import create_access_token

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    telegram_id = db.Column(db.String(50), unique=True, nullable=False)
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    registered_on = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    @staticmethod
    def create_user(telegram_id, username, password, email=None):
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(telegram_id=telegram_id, username=username, password=hashed_password, email=email)
        db.session.add(new_user)
        db.session.commit()
        return new_user

    @staticmethod
    def authenticate_user(telegram_id):
        user = User.query.filter_by(telegram_id=telegram_id).first()
        if user:
            access_token = create_access_token(identity=user.id)
            return access_token
        return None

    def __repr__(self):
        return f'<User {self.username}>'
