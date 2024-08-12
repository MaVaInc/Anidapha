import hashlib
import hmac
import secrets
import time
import urllib.parse
from django.http import JsonResponse


import jwt
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .generate_initData import get_init_data
from .models import User
from .serializers import UserSerializer

SECRET_KEY = '7234439409:AAG6HEzoTVX5kjZbqdUcT5alJ15NuId1hDM'


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


@api_view(['POST'])
def auth_view(request):
    init_data = get_init_data()  # Возвращает закодированную строку
    bot_token = SECRET_KEY

    if validate_init_data(init_data, bot_token):
        # Разбор строки init_data обратно в словарь
        init_data_dict = dict(urllib.parse.parse_qsl(init_data))

        user_info = {
            'id': init_data_dict['user[id]'],
            'first_name': init_data_dict.get('user[first_name]', ''),
            'last_name': init_data_dict.get('user[last_name]', ''),
            'username': init_data_dict.get('user[username]', ''),
            'photo_url': init_data_dict.get('user[photo_url]', ''),
            'auth_date': timezone.datetime.fromtimestamp(int(init_data_dict['auth_date'])).strftime(
                '%Y-%m-%d %H:%M:%S'),
        }

        telegram_id = user_info['id']
        user, created = User.objects.get_or_create(
            telegram_id=telegram_id,
            defaults={
                'username': f"user_{secrets.token_hex(4)}",
                'first_name': user_info['first_name'],
                'last_name': user_info['last_name'],
                'photo_url': user_info['photo_url'],
                'auth_date': user_info['auth_date'],
            }
        )

        if created or not user.username:
            return JsonResponse({
                'welcome_message': "Welcome! Please choose a nickname.",
                'suggested_username': user.username,
                'registered': False
            })
        else:
            # Генерация access и refresh токенов
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'welcome_message': f"Welcome back, {user.username}!",
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'registered': True
            })
    else:
        return JsonResponse({'success': False, 'message': 'Invalid init data'}, status=401)


def validate_init_data(init_data: str, bot_token: str) -> bool:
    try:
        init_data_dict = dict(urllib.parse.parse_qsl(init_data))
        hash_received = init_data_dict.pop('hash', None)

        data_check_string = "\n".join([f"{k}={v}" for k, v in sorted(init_data_dict.items())])
        secret_key = hashlib.sha256(bot_token.encode()).digest()

        hash_calculated = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

        if not hmac.compare_digest(hash_received, hash_calculated):
            return False

        auth_date = int(init_data_dict.get('auth_date', 0))
        if time.time() - auth_date > 86400:  # 24 часа
            return False

        return True
    except Exception as e:
        print(f"Validation error: {e}")
        return False
@api_view(['POST'])
def set_username(request):
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = User.objects.get(id=decoded['user_id'])
    except jwt.ExpiredSignatureError:
        return JsonResponse({'success': False, 'message': 'Token expired'}, status=401)
    except jwt.InvalidTokenError:
        return JsonResponse({'success': False, 'message': 'Invalid token'}, status=401)
    except User.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'User not found'}, status=404)

    username = request.data.get('username')

    if User.objects.filter(username=username).exists():
        return JsonResponse({'success': False, 'message': 'Username already taken'}, status=400)

    user.username = username
    user.save()

    return JsonResponse({'success': True, 'username': username})

