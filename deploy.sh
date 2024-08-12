#!/bin/bash


#pip install -r requirements.txt



# Пароль для SSH соединения
SSH_PASSWORD="Mavaincee2020"
#git="https://github.com/MaVaInc/Anidapha.git"
# Синхронизация файлов на сервере
sshpass -p "$SSH_PASSWORD" rsync -avz /home/roman/telega/Anidapha/anidapha_backend/* root@77.221.154.137:/var/www/anidapha/anidapha_backend

# Перезапуск сервера
sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no root@77.221.154.137 << EOF
#cd /var/www/anidapha/anidapha_backend/
#source venv/bin/activate
cd /var/www/anidapha/
#pip install -r requirements.txt
sudo systemctl restart gunicorn
sudo systemctl restart nginx

echo "Server updated and restarted."
#cd /var/www/anidapha/frontend
#npm install
#npm run build

EOF
