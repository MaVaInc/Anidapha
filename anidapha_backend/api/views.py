import json
import random
import urllib.parse
from datetime import datetime, timedelta

from django.shortcuts import render
from django.template import context
from rest_framework import viewsets
from rest_framework.response import Response

from farm.models import Plot, Seed

# from ..farm.models import Seed

SECRET_KEY = '7234439409:AAG6HEzoTVX5kjZbqdUcT5alJ15NuId1hDM'

import urllib.parse
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User, Item
from .serializers import UserSerializer, ItemSerializer


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
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User


@api_view(['POST'])
def auth_view(request):
    permission_classes = [AllowAny]
    # init_data = "query_id=AAFz2DA4AAAAAHPYMDhiiK2X&user=%7B%22id%22%3A942725235%2C%22first_name%22%3A%22PyTorch%22%2C%22last_name%22%3A%22Love%22%2C%22username%22%3A%22mavainc%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1723920109&hash=85d51bb692c51ec8b26788468f76850f85c7068b50b4eb92187b25fba94b0f35"
    init_data = request.data.get('initData')
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
            auth_date_str = user_info['auth_date']
            auth_date = datetime.strptime(auth_date_str, '%Y-%m-%d %H:%M:%S')
            user, created = User.objects.get_or_create(
                telegram_id=telegram_id,
                defaults={
                    'username': f"user_{secrets.token_hex(3)}",
                    'first_name': user_info['first_name'],
                    'last_name': user_info['last_name'],
                    'photo_url': None,
                    'auth_date': auth_date,
                }
            )

        except Exception as e:
            return JsonResponse({'success': False, 'message': f'PD'},
                                status=401)

        if created or not user.username:
            return JsonResponse({
                'welcome_message': "Welcome! Please choose a nickname.",
                'suggested_username': 'x_'+user.username,
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
@permission_classes([IsAuthenticated])
def set_username(request):
    user = request.user
    username = request.data.get('username')
    if User.objects.filter(username=username).exists():
        return JsonResponse({'success': False, 'message': 'Username already taken'}, status=400)

    user.username = username
    plots = [Plot(user=user) for _ in range(3)]
    seed = Seed(owner=user,name='Бурьян', growth_time=timedelta(minutes=1))
    seed.save()
    Plot.objects.bulk_create(plots)

    return JsonResponse({'success': True, 'seed': seed.name,'message': f'Вы получили {seed.name}'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    user = request.user
    serializer = UserSerializer(user)
    print(serializer.data)
    return JsonResponse(serializer.data)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_inventory(request):
    user = request.user
    items = Item.objects.filter(owner=user)  # Выбираем все предметы, принадлежащие пользователю
    serializer = ItemSerializer(items, many=True)  # Сериализуем данные
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reward(request):
    user = request.user
    user = User.objects.get(username=user.username)
    try:
        if int(user.dogs_balance) < -10:
            return JsonResponse({'success': False, 'message': f'Not enough balance {user.dogs_balance}'}, status=400)
    except :
        return JsonResponse({'success': False, 'message': f'{user.data}'}, status=400)

    # Списываем баланс
    user.dogs_balance -= 1

    # Генерация случайного товара
    item_types = ['weapon', 'armor', 'helmet', 'shield', 'boots', 'gloves', 'ring', 'amulet', 'belt', 'accessory']
    random_item_type = random.choice(item_types)
    random_attack = random.randint(5, 20)
    random_defense = random.randint(5, 20)
    random_accuracy = random.randint(5, 20)
    random_evasion = random.randint(5, 20)
    random_stun = random.randint(5, 20)
    random_block = random.randint(5, 20)
    random_health = random.randint(50, 100)
    random_price = round(random.uniform(10.0, 100.0), 2)
    random_unique_properties = "Some unique property"

    # Создаем товар
    new_item = Item.objects.create(
        name=f"Random {random_item_type.capitalize()}",
        creator="System",
        owner=user,
        item_type=random_item_type,
        attack=random_attack,
        defense=random_defense,
        accuracy=random_accuracy,
        evasion=random_evasion,
        stun=random_stun,
        block=random_block,
        health=random_health,
        price=random_price,
        unique_properties=random_unique_properties,
    )
    new_item.save()
    user.save()

    # Возвращаем данные о созданном товаре
    item_data = {
        'itemId': new_item.pk,
        'name': new_item.name,
        'item_type': new_item.item_type,
        'attack': new_item.attack,
        'defense': new_item.defense,
        'accuracy': new_item.accuracy,
        'evasion': new_item.evasion,
        'stun': new_item.stun,
        'block': new_item.block,
        'health': new_item.health,
        'price': new_item.price,
        'unique_properties': 'Шанс привлечь бедствие в виде одного с 12 уникальный Мобов',
    }

    return JsonResponse({'success': True, 'item': item_data})



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sell(request):

    item_id = request.data.get('itemId')
    user = request.user
    user = User.objects.get(username=user.username)
    # Проверка, существует ли товар у пользователя
    try:
        item = Item.objects.get(id=item_id, owner=user)
    except Item.DoesNotExist:
        return JsonResponse({'success': False, 'message': f'Item not found  {request.data}or does not belong to user'}, status=400)

    # Добавляем стоимость товара к балансу пользователя
    user.dogs_balance = float(user.dogs_balance) + float(item.price)

    user.save()

    # Сохраняем цену для сообщения
    earned_tokens = item.price

    # Уничтожаем товар
    item.delete()

    return JsonResponse({'success': True, 'message': f'You earned {earned_tokens} DOGS'})