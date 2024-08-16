import json

parsed_query = {'id': 942725235, 'first_name': 'PyTorch', 'last_name': 'Love', 'username': 'mavainc',
                'language_code': 'ru', 'is_premium': True, 'allows_write_to_pm': True,
                'auth_date': '2024-08-12 20:59:07'}

user_info_dict = json.loads(parsed_query['user'][0])

print(user_info_dict)
