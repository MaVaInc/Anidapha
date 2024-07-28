#!/bin/bash

# Пароль для SSH соединения
SSH_PASSWORD="Mavaincee202@"


# Коммитим изменения
git add .
git commit -m "$1"

# Пушим изменения на сервер
git push production main

echo "Changes have been pushed to the server."
sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no root@185.218.0.64 << EOF
# Подключаемся к серверу и проверяем статус приложения
cd /var/www/anidapha
source venv/bin/activate
pip install -r requirements.txt
systemctl restart nginx
echo "Server updated and restarted."
EOF
