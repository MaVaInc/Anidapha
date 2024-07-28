#!/bin/bash

# Пароль для SSH соединения
SSH_PASSWORD="Mavaincee202@"

# Коммитим изменения
git config --global user.email "mavaincee@gmail.com"
echo "email."
git add .
git commit -m "$1"


# Пушим изменения на сервер
git push production main

echo "Changes have been pushed to the server."

# Подключаемся к серверу и проверяем статус приложения
#sshpass -p "$SSH_PASSWORD" ssh root@185.218.0.64 << EOF
#cd /var/www/anidapha
#source venv/bin/activate
#pip install -r requirements.txt
#systemctl restart nginx
#echo "Server updated and restarted."
#EOF
