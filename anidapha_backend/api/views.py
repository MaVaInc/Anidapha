import json
import urllib.parse

from django.shortcuts import render
from django.template import context
from rest_framework import viewsets
from rest_framework.response import Response

SECRET_KEY = '7234439409:AAG6HEzoTVX5kjZbqdUcT5alJ15NuId1hDM'

import urllib.parse
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User
from .serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


import hashlib
import hmac
import secrets
import time
import urllib.parse
from django.http import JsonResponse
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User


@api_view(['POST'])
def auth_view(request):
    permission_classes = [AllowAny]
    init_data = "query_id=AAFz2DA4AAAAAHPYMDhiiK2X&user=%7B%22id%22%3A942725235%2C%22first_name%22%3A%22PyTorch%22%2C%22last_name%22%3A%22Love%22%2C%22username%22%3A%22mavainc%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1723920109&hash=85d51bb692c51ec8b26788468f76850f85c7068b50b4eb92187b25fba94b0f35"
    # init_data = request.data.get('initData')
    # init_data = get_init_data()
    bot_token = SECRET_KEY
    # try:
    if validate_init_data(init_data, bot_token):
        user_info_dict = urllib.parse.parse_qs(init_data)
        user_info = json.loads(user_info_dict['user'][0])
        auth_date = json.loads(user_info_dict['auth_date'][0])
        user_info['auth_date']= timezone.datetime.fromtimestamp(int(auth_date)).strftime('%Y-%m-%d %H:%M:%S')


        telegram_id = user_info['id']
        try:
            user, created = User.objects.get_or_create(
                telegram_id=telegram_id,
                defaults={
                    'username': f"user_{secrets.token_hex(4)}",
                    'first_name': user_info['first_name'],
                    'last_name': user_info['last_name'],
                    'photo_url': None,
                    'auth_date': user_info['auth_date'],
                }
            )

        except Exception as e:
            return JsonResponse({'success': False, 'message': f'ddddddddddddddd {e} aaaaaaa {user_info}'},
                                status=401)

        if created or not user.username:
            return JsonResponse({
                'welcome_message': "Welcome! Please choose a nickname.",
                'suggested_username': user.username,
                'registered': False
            })
        else:
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'welcome_message': f"Welcome back, {user.username}!",
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'registered': True,
                'ton_balance': user.ton_balance,
                'platinum_balance': user.platinum_balance,
                'gold_balance': user.gold_balance
            })
    else:
        return JsonResponse({'success': False, 'message': f'Invalid init data {init_data}'},
                            status=401)


def validate_init_data(init_data: str, bot_token: str) -> bool:
    try:
        init_data_dict = dict(urllib.parse.parse_qsl(init_data))
        hash_received = init_data_dict.pop('hash', None)

        # Sort and create the data check string
        data_check_string = "\n".join([f"{k}={v}" for k, v in sorted(init_data_dict.items())])

        # Create the secret key using 'WebAppData' as key base
        secret_key = hmac.new(b'WebAppData', bot_token.encode(), hashlib.sha256).digest()

        # Calculate the hash
        hash_calculated = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

        # Compare the received hash with the calculated hash
        if not hmac.compare_digest(hash_received, hash_calculated):
            print(f"hash_received: {hash_received}")
            print(f"hash_calculated: {hash_calculated}")
            return False

        # Validate the auth_date
        auth_date = int(init_data_dict.get('auth_date', 0))
        if time.time() - auth_date > 86400:
            return False

        return True

    except Exception as e:
        print(f"Validation error: {e}")
        return False


@api_view(['POST'])
def set_username(request):
    user = request.user
    username = request.data.get('username')

    if User.objects.filter(username=username).exists():
        return JsonResponse({'success': False, 'message': 'Username already taken'}, status=400)

    user.username = username
    user.save()

    return JsonResponse({'success': True, 'username': username})

@api_view(['GET'])
def get_user_data(request):
    user = request.user
    serializer = UserSerializer(user)
    print(serializer.data)
    return JsonResponse(serializer.data)