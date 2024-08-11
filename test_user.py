from alt.app import app, db
from alt.models.user import User

with app.app_context():
    # Создание нового пользователя
    new_user = User(
        telegram_id="1234516789",
        username="test_user",
        password="password",
        email="test@example.com",
        common_seeds={"seed1": 10},
        rare_seeds={"seed2": 5},
        epic_seeds={"seed3": 2},
        legendary_seeds={"seed4": 1}
    )

    # Добавление пользователя в базу данных
    db.session.add(new_user)
    db.session.commit()

    print("Test user added.")
