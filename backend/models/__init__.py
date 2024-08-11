# backend/models/__init__.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User

__all__ = ['User']
