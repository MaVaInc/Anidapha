import hashlib
import hmac
import time
import urllib.parse

def generate_init_data(user_id, bot_token, first_name='', last_name='', username='', photo_url=''):
    init_data_dict = {
        'user[id]': user_id,
        'user[first_name]': first_name,
        'user[last_name]': last_name,
        'user[username]': username,
        'user[photo_url]': photo_url,
        'auth_date': int(time.time())
    }

    data_check_string = "\n".join([f"{k}={v}" for k, v in sorted(init_data_dict.items())])
    secret_key = hashlib.sha256(bot_token.encode()).digest()
    hash_calculated = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

    init_data_dict['hash'] = hash_calculated

    # Возвращаем закодированную строку, чтобы соответствовать ожиданиям validate_init_data
    return urllib.parse.urlencode(init_data_dict)

# Пример использования:
bot_token = '7234439409:AAG6HEzoTVX5kjZbqdUcT5alJ15NuId1hDM'
user_id = '123456789'
first_name = 'John'
last_name = 'Doe'
username = 'johndoe'
photo_url = 'https://example.com/photo.jpg'

def get_init_data():
    init_data = generate_init_data(user_id, bot_token, first_name, last_name, username, photo_url)
    return init_data
