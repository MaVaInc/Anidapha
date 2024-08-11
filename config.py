import os


SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://roman:your_password@localhost/telega'
SQLALCHEMY_TRACK_MODIFICATIONS = False

