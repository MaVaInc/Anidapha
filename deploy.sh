#!/bin/bash


#pip install -r requirements.txt



# Пароль для SSH соединения
SSH_PASSWORD="Mavaincee2020"
#git="https://github.com/MaVaInc/Anidapha.git"
# Синхронизация файлов на сервере
sshpass -p "$SSH_PASSWORD" rsync -avz /home/roman/telega/Anidapha/anidapha_backend/* root@77.221.154.137:/var/www/anidapha/anidapha_backend
sshpass -p "$SSH_PASSWORD" rsync -avz /home/roman/telega/Anidapha/frontend/src/* root@77.221.154.137:/var/www/anidapha/frontend/src
sshpass -p "$SSH_PASSWORD" rsync -avz /home/roman/telega/Anidapha/frontend/public/* root@77.221.154.137:/var/www/anidapha/frontend/public

# Перезапуск сервера
sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no root@77.221.154.137 << EOF

cd /var/www/anidapha/frontend
#npm install
npm run build

#npm start
cd /var/www/anidapha/anidapha_backend/
source /var/www/anidapha/anidapha_backend/venv/bin/activate
python3 manage.py collectstatic --no-input
#python3 -m pip install Pillow
python3 manage.py makemigrations
python3 manage.py migrate


#yes
#cd /var/www/anidapha/
#pip install -r requirements.txt
sudo systemctl restart gunicorn
sudo systemctl restart nginx

#echo "Server updated and restarted."

EOF


#CREATE USER pro WITH PASSWORD 'Mavaincee2020';
#CREATE DATABASE adventurers;
#GRANT ALL PRIVILEGES ON DATABASE adventurers TO pro;


#npm install dexie
