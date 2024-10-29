import math
import random

from api.models import User, Item, Resource, Seed
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

def add_characteristic(characteristics, weights, item_stats):
    if not characteristics:
        return item_stats, 0

    i = 0
    stat_pro = None

    while True:
        i += 1
        stat = random.choice(list(characteristics.keys()))

        if i > 5:
            stat_pro, values = get_random_characteristic()
            stat = stat_pro

        if stat not in item_stats:
            if stat_pro:
                min_value, max_value = values
            else:
                min_value, max_value = characteristics[stat]

            value = random.randint(min_value, max_value)
            item_stats[stat] = value

            stat_value = value * weights.get(stat, 1)

            return item_stats, stat_value

def get_random_characteristic():
    item_types = {
        'mace': {'attack': (5, 15), 'accuracy': (-1, 5)},
        'axe': {'attack': (10, 25), 'accuracy': (-10, 3)},
        'sword': {'attack': (1, 8), 'accuracy': (1, 10), 'defense': (0, 6)},
        'armor': {'defense': (3, 12), 'health': (10, 80)},
        'helmet': {'defense': (2, 8), 'health': (5, 40)},
        'shield': {'block': (15, 35), 'defense': (5, 15)},
        'boots': {'evasion': (3, 10), 'accuracy': (1, 5)},
        'gloves': {'accuracy': (5, 10), 'attack': (2, 8)},
        'ring': {'accuracy': (3, 8), 'evasion': (3, 8)},
        'amulet': {'health': (15, 70), 'defense': (2, 8)},
    }

    all_characteristics = {}
    for characteristics in item_types.values():
        all_characteristics.update(characteristics)

    random_stat = random.choice(list(all_characteristics.keys()))
    min_value, max_value = all_characteristics[random_stat]
    return random_stat, (min_value, max_value)

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

    user.dogs_balance -= 100

    reward_pool = {
        'Seed': {'chance': 0.4, 'price': 10},
        'Stone': {'chance': 0.25, 'price': 40},
        'Wood': {'chance': 0.2, 'price': 80},
        'Iron': {'chance': 0.1, 'price': 200},
        'RandomItem': {'chance': 0.05, 'price': None},
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

    reward_type = random.choices(list(reward_pool.keys()), weights=[reward['chance'] for reward in reward_pool.values()])[0]
    reward_info = reward_pool[reward_type]

    if reward_type == 'RandomItem':
        item_types = {
            'mace': {'attack': (5, 15), 'accuracy': (-1, 5)},
            'axe': {'attack': (10, 25), 'accuracy': (-10, 3)},
            'sword': {'attack': (1, 8), 'accuracy': (1, 10), 'defense': (0, 6)},
            'armor': {'defense': (3, 12), 'health': (10, 80)},
            'helmet': {'defense': (2, 8), 'health': (5, 40)},
            'shield': {'block': (15, 35), 'defense': (5, 15)},
            'boots': {'evasion': (3, 10), 'accuracy': (1, 5)},
            'gloves': {'accuracy': (5, 10), 'attack': (2, 8)},
            'ring': {'accuracy': (2, 7), 'evasion': (2, 7)},
            'amulet': {'health': (15, 70), 'defense': (2, 8)},
        }

        random_item_type = random.choice(list(item_types.keys()))
        characteristics = item_types[random_item_type].copy()

        item_stats = {}
        total_stats_value = 0

        item_stats, value = add_characteristic(characteristics, weights, item_stats)
        total_stats_value += value

        if random.random() < 0.8:
            item_stats, value = add_characteristic(characteristics, weights, item_stats)
            total_stats_value += value

        if random.random() < 0.3:
            item_stats, value = add_characteristic(characteristics, weights, item_stats)
            total_stats_value += value

        if random.random() < 0.05:
            item_stats, value = add_characteristic(characteristics, weights, item_stats)
            total_stats_value += value

        if random.random() < 0.01:
            item_stats, value = add_characteristic(characteristics, weights, item_stats)
            total_stats_value += value

        if total_stats_value == 0:
            base_price = 400
        else:
            base_price = total_stats_value * random.uniform(0.3, 0.74)

        max_price = 50000
        min_price = 10
        price_range = max_price - min_price

        non_linear_price = min_price + price_range * (1 - math.exp(-base_price / 500))
        final_price = round(max(min_price, non_linear_price), 2)

        num_characteristics = len(item_stats)
        rarity = 'common'
        if num_characteristics > 4:
            final_price *= 20
            rarity = 'rare'
        elif num_characteristics > 3:
            final_price *= 5
            rarity = 'uncommon'

        final_price = round(final_price, 2)

        item_name = f"Random {random_item_type.capitalize()}"

        new_item = Item.objects.create(
            name=item_name,
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

        item_data = {
            'itemId': new_item.pk,
            'name': new_item.name,
            'item_type': new_item.item_type,
            'price': new_item.price,
            'rarity': str(new_item.rarity),
            'image': new_item.image.url,
            'attack': new_item.attack,
            'defense': new_item.defense,
            'accuracy': new_item.accuracy,
            'evasion': new_item.evasion,
            'stun': new_item.stun,
            'block': new_item.block,
            'health': new_item.health,
            'unique_properties': new_item.unique_properties,
        }

    elif reward_type in ['Stone', 'Wood', 'Iron']:
        resource_type = reward_type.lower()

        new_item = Resource.objects.create(
            name=reward_type,
            creator="System",
            owner=user,
            item_type=resource_type,
            price=reward_info['price'],
            rarity=Resource.INITIAL_RARITY.get(resource_type, 'common')
        )

        item_data = {
            'itemId': new_item.pk,
            'name': new_item.name,
            'item_type': new_item.item_type,
            'price': new_item.price,
            'rarity': str(new_item.rarity),
            'image': new_item.image.url,
        }

    else:  # Seed
        new_item = Seed.objects.create(
            name='Seed',
            creator="System",
            owner=user,
            price=reward_info['price'],
            rarity='common',
        item_type='seed'
        )

        item_data = {
            'item_type': new_item.item_type,
            'itemId': new_item.pk,
            'name': new_item.name,
            'price': new_item.price,
            'rarity': str(new_item.rarity),
            'image': new_item.image.url,
            'growth_time': new_item.growth_time.total_seconds(),
            'stage': new_item.stage,

        }

    new_item.save()
    user.save()

    return JsonResponse({'success': True, 'item': item_data})
