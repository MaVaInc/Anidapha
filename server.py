from flask import Flask, request, jsonify
import hashlib
import hmac
import time
import os

app = Flask(__name__)

BOT_TOKEN = '7234439409:AAG6HEzoTVX5kjZbqdUcT5alJ15NuId1hDM'

def check_telegram_auth(data):
    check_hash = data.pop('hash')
    sorted_data = sorted(data.items())
    data_check_string = '\n'.join([f'{k}={v}' for k, v in sorted_data])
    secret_key = hashlib.sha256(BOT_TOKEN.encode()).digest()
    hmac_string = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

    return hmac_string == check_hash

@app.route('/auth', methods=['POST'])
def auth():
    auth_data = request.json
    if check_telegram_auth(auth_data):
        return jsonify({"status": "success", "user_data": auth_data}), 200
    else:
        return jsonify({"status": "unauthorized"}), 401

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
