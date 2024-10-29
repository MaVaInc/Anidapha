import json
import math
import random
import urllib.parse
from datetime import datetime, timedelta

from farm.models import  Seed
from rest_framework import viewsets

from farm.serializers import SeedSerializer

SECRET_KEY = '7234439409:AAG6HEzoTVX5kjZbqdUcT5alJ15NuId1hDM'

import urllib.parse
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User, Item, InventoryItem
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
from .models import *


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
        user_info['auth_date'] = timezone.datetime.fromtimestamp(int(auth_date)).strftime('%Y-%m-%d %H:%M:%S')

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
                'suggested_username': 'x_' + user.username,
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
    seed = Seed(owner=user, name='Бурьян', growth_time=timedelta(minutes=1))
    seed.save()
    Plot.objects.bulk_create(plots)

    return JsonResponse({'success': True, 'seed': seed.name, 'message': f'Вы получили {seed.name}'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    user = request.user
    serializer = UserSerializer(user)
    return JsonResponse(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_inventory(request):
    user = request.user
    inventory_items = InventoryItem.objects.filter(owner=user)

    response_data = []

    for inventory_item in inventory_items:
        # if inventory_item.item:
            response_data.append({
                'type': 'item',
                'item_id': inventory_item.item.id,
                'name': inventory_item.item.name,
                'item_type': inventory_item.item.item_type,
                'quantity': inventory_item.quantity,
                'attack': inventory_item.item.attack,
                'defense': inventory_item.item.defense,
                'accuracy': inventory_item.item.accuracy,
                'evasion': inventory_item.item.evasion,
                'stun': inventory_item.item.stun,
                'block': inventory_item.item.block,
                'health': inventory_item.item.health,
                'price': inventory_item.item.price,
                'unique_properties': inventory_item.item.unique_properties,
                'image': inventory_item.item.image.url if inventory_item.item.image else None,
            })
        # elif inventory_item.seed:
        #     response_data.append({
        #         'type': 'seed',
        #         'seed_id': inventory_item.seed.id,
        #         'name': inventory_item.seed.name,
        #         'growth_time': inventory_item.seed.growth_time,
        #         'rarity': inventory_item.seed.get_rarity_display(),
        #         'stage': inventory_item.seed.get_stage_display(),
        #         'quantity': inventory_item.quantity,
        #     })

    return JsonResponse({'inventory': response_data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_inventory(request):
    user = request.user
    items = Item.objects.filter(owner=user)  # Выбираем все предметы, принадлежащие пользователю
    seed = Seed.objects.filter(owner=user)  # Выбираем все предметы, принадлежащие пользователю
    serializer_item = ItemSerializer(items, many=True)  # Сериализуем данные
    serializer_seed = SeedSerializer(seed, many=True)  # Сериализуем данные
    return JsonResponse({'item':serializer_item.data, 'seed': serializer_seed.data}, safe=False)


import random
import math
from collections import defaultdict
from django.http import JsonResponse
from .models import Item, User  # Подкорректируйте путь к модели User в зависимости от вашего проекта


def add_characteristic(characteristics, weights, item_stats):
    """
    Добавляет случайную характеристику из доступных и возвращает обновленные item_stats и total_stats_value.
    """
    if not characteristics:
        print('error')
        return item_stats, 0
    i=0
    stat_pro = None
    while True:
        i+=1
        values=(0,0)
        stat = random.choice(list(characteristics.keys()))
        if i>5:
            stat_pro, values = get_random_characteristic()
            stat = stat_pro
        if stat not in item_stats:  # Проверяем, есть ли уже эта характеристика
            if stat_pro:
                min_value, max_value = values
            else:
                min_value, max_value = characteristics[stat]
            value = random.randint(min_value, max_value)
            item_stats[stat] = value

            # Вычисляем весовую ценность характеристики
            stat_value = value * weights.get(stat, 1)

            # Удаляем использованную характеристику из списка доступных
            # del characteristics[stat]

            return item_stats, stat_value
def get_random_characteristic():
    """
    Возвращает случайную характеристику из всех доступных характеристик вне зависимости от типа предмета.
    """
    item_types = {
        'mace': {'attack': (5, 15), 'accuracy': (-1, 5)},
        'axe': {'attack': (10, 25), 'accuracy': (-10, 3)},
        'sword': {'attack': (1, 8), 'accuracy': (1, 10), 'defense': (0, 6)},
        'armor': {'defense': (3, 12), 'health': (10, 80),'evasion': (-3, 0)},
        'helmet': {'defense': (2, 8), 'health': (5, 40),'evasion': (-3, 0)},
        'shield': {'block': (15, 35), 'defense': (5, 15),'evasion': (-5, 0)},
        'boots': {'evasion': (3, 10), 'accuracy': (1, 5)},
        'gloves': {'accuracy': (5, 10), 'attack': (2, 8)},'evasion': (0, 3),
        'ring': {'accuracy': (3, 8), 'evasion': (3, 8)},
        'amulet': {'health': (15, 70), 'defense': (2, 8)},
    }
    # Создаем список всех возможных характеристик из всех типов предметов
    all_characteristics = {}
    for characteristics in item_types.values():
        all_characteristics.update(characteristics)

    # Выбираем случайную характеристику из объединенного списка
    random_stat = random.choice(list(all_characteristics.keys()))
    min_value, max_value = all_characteristics[random_stat]
    value = random.randint(min_value, max_value)
    return random_stat,all_characteristics[random_stat]
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reward(request):
    user = request.user
    user = User.objects.get(username=user.username)

    try:
        if int(user.dogs_balance) < 100:
            return JsonResponse({'success': False, 'message': f'Not enough balance {user.dogs_balance}'}, status=400)
    except:
        return JsonResponse({'success': False, 'message': f'{user.data}'}, status=400)

    # Списываем баланс
    user.dogs_balance -= 100

    # Определяем возможные типы предметов
    item_types = {
        'mace': {'attack': (5, 15), 'accuracy': (-1, 5)},
        'axe': {'attack': (10, 25), 'accuracy': (-10, 3)},
        'sword': {'attack': (1, 8), 'accuracy': (1, 10), 'defense': (0, 6)},
        'armor': {'defense': (3, 12), 'health': (10, 80)},
        'helmet': {'defense': (2, 8), 'health': (5, 40)},
        'shield': {'block': (15, 35), 'defense': (5, 15)},
        'boots': {'evasion': (3, 10), 'accuracy': (1, 5)},
        'pants': {'evasion': (3, 10), 'accuracy': (1, 5)},
        'gloves': {'accuracy': (5, 10), 'attack': (2, 8)},
        'ring': {'accuracy': (3, 8), 'evasion': (3, 8)},
        'amulet': {'health': (15, 70), 'defense': (2, 8)},
    }

    weights = {
        'attack': 1.2,
        'defense': 1.8,
        'accuracy': 2.0,
        'evasion': 2.4,
        'stun': 1.0,
        'block': 0.7,
        'health': 0.1,
    }

    random_item_type = random.choice(list(item_types.keys()))
    characteristics = item_types[random_item_type].copy()

    item_stats = {}
    total_stats_value = 0

    # Генерация характеристик для предмета
    item_stats, value = add_characteristic(characteristics, weights, item_stats)
    total_stats_value += value

    if random.random() < 0.8:  # 80% шанс на вторую характеристику
        item_stats, value = add_characteristic(characteristics, weights, item_stats)
        total_stats_value += value

    if random.random() < 0.3:  # 30% шанс на третью характеристику
        item_stats, value = add_characteristic(characteristics, weights, item_stats)
        total_stats_value += value

    if random.random() < 0.03:  # 3% шанс на четвертую характеристику
        item_stats, value = add_characteristic(characteristics, weights, item_stats)
        total_stats_value += value

    if random.random() < 0.01:  # 1% шанс на пятую характеристику
        item_stats, value = add_characteristic(characteristics, weights, item_stats)
        total_stats_value += value

    # Рассчитываем цену предмета
    if total_stats_value == 0:
        base_price = 10
    else:
        base_price = total_stats_value * random.uniform(0.1, 0.34)

    max_price = 10000
    min_price = 10
    price_range = max_price - min_price

    # Настраиваем экспоненциальное распределение
    non_linear_price = min_price + price_range * (1 - math.exp(-base_price / 500))

    final_price = round(max(min_price, non_linear_price), 2)

    # Применяем скейлинг в зависимости от количества характеристик
    num_characteristics = len(item_stats)
    rarity = 'common'
    if num_characteristics > 4:
        final_price *= 20  # x20 для более 4 характеристик
        rarity = 'rare'
    elif num_characteristics > 3:
        final_price *= 5  # x5 для более 3 характеристик
        rarity = 'uncommon'

    final_price = round(final_price, 2)

    # Создаем товар с учетом сгенерированных характеристик и рассчитанной цены
    new_item = Item.objects.create(
        name=f"Random {random_item_type.capitalize()}",
        creator="System",
        owner=user,
        item_type=random_item_type,
        attack=item_stats.get('attack', None),
        defense=item_stats.get('defense', None),
        accuracy=item_stats.get('accuracy', None),
        evasion=item_stats.get('evasion', None),
        stun=item_stats.get('stun', None),
        block=item_stats.get('block', None),
        health=item_stats.get('health', None),
        price=final_price,
        image=f'images/{random_item_type}.PNG',
        unique_properties=item_stats.get('unique_properties', "Some unique property"),
        rarity=rarity
    )

    # Сохраняем изменения
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
        'image': str(new_item.image),
        'rarity': str(new_item.rarity),
        'unique_properties': new_item.unique_properties,
    }

    return JsonResponse({'success': True, 'item': item_data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sell(request):
    user = request.user
    user = User.objects.get(username=user.username)

    items = request.data.get('items', [])
    total_earned = 0

    if not items:
        # Если передан только один itemId
        item_id = request.data.get('itemId')
        items = [{'itemId': item_id}] if item_id else []

    for i in items:
        item_id = i.get('itemId')

        # Проверка, существует ли товар у пользователя
        try:
            item = Item.objects.get(id=item_id, owner=user)
        except Item.DoesNotExist:
            try:
                item = Seed.objects.get(id=item_id, owner=user)
            except Seed.DoesNotExist:
                return JsonResponse(
                    {'success': False, 'message': f'Item with ID {item_id} not found or does not belong to user'},
                    status=400)

        # Добавляем стоимость товара к балансу пользователя
        user.dogs_balance = float(user.dogs_balance) + float(item.price)
        total_earned += item.price

        # Уничтожаем товар
        item.delete()

    user.save()

    return JsonResponse({'success': True, 'message': f'You earned {total_earned} DOGS'})

from rest_framework.response import Response
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_daily_reward(request):
    user = request.user
    now = timezone.now()
    # user = User.objects.get(username=user.username)
    try:
        if user.last_daily_reward:
            time_since_last_reward = now - user.last_daily_reward
            if time_since_last_reward < timedelta(seconds=22244):
                return Response({
                    'message': 'You have already claimed your daily reward. Please try again later.',
                    'next_available_in': str(timedelta(hours=24) - time_since_last_reward)
                }, status=403)
    except:
        user.last_daily_reward = now

    # Если прошло 24 часа, даем новую награду
    # Здесь можно добавить логику генерации награды
    # Например, выдаем семечко
    reward = Seed.objects.create(
        owner=user,
        name="Бурьян",
        growth_time=timedelta(hours=1),
        rarity="common"
    )

    # Обновляем время последней награды
    user.last_daily_reward = now
    user.save()

    return Response({
        'message': 'Daily reward claimed!',
        'reward': {
            'name': reward.name,
            'rarity': reward.rarity,
            'growth_time': str(reward.growth_time),
            'price': reward.price
        }
    })
