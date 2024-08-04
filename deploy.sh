#!/bin/bash

# Пароль для SSH соединения
SSH_PASSWORD="043f249e7d1d"

# Синхронизация файлов на сервере
sshpass -p "$SSH_PASSWORD" rsync -avz /home/roman/PycharmProjects/Anidapha/* root@77.221.154.137:/var/www/anidapha

# Перезапуск сервера
sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no root@77.221.154.137 << EOF
cd /var/www/anidapha
source venv/bin/activate
#pip install -r requirements.txt
sudo systemctl restart anidapha.service
sudo systemctl restart anidapha_uwsgi
sudo systemctl restart nginx
echo "Server updated and restarted."
EOF
