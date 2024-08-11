from alt.models import db

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    type = db.Column(db.String(64))
    image = db.Column(db.String(256))
    price = db.Column(db.Float)
