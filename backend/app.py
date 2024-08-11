from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
app.config.from_object('config')

db = SQLAlchemy(app)
migrate = Migrate(app, db)

from backend.routes import register_routes
register_routes(app)

if __name__ == '__main__':
    app.run(debug=True)
