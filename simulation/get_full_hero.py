import random
import math
from collections import defaultdict


def add_characteristic(characteristics, weights, item_stats):
    if not characteristics:
        return item_stats, 0
    stat = random.choice(list(characteristics.keys()))
    value = random.randint(*characteristics[stat])
    item_stats[stat] = value
    stat_value = value * weights.get(stat, 1)
    return item_stats, stat_value


def simulate_hero():
    item_types = {
        'weapon': {'attack': (1, 10), 'accuracy': (-3, 5), 'defense': (0, 4)},
        'armor': {'defense': (3, 12), 'health': (10, 80)},
        'helmet': {'defense': (2, 8), 'health': (5, 40)},
        'shield': {'block': (15, 35), 'defense': (5, 15)},
        'boots': {'evasion': (3, 10), 'accuracy': (1, 5)},
        'gloves': {'accuracy': (5, 10), 'attack': (2, 8)},
        'ring': {'accuracy': (3, 8), 'evasion': (3, 8)},
        'amulet': {'health': (15, 70), 'defense': (2, 8)},
        'belt': {'health': (10, 50), 'defense': (1, 5)},
        'accessory': {'health': (15, 70), 'attack': (2, 8)},
    }

    weights = {
        'attack': 1.2,
        'defense': 1.8,
        'accuracy': 2.0,
        'evasion': 2.5,
        'stun': 1.5,
        'block': 1,
        'health': 0.1,
    }

    complete_set = {item: None for item in item_types.keys()}
    total_item_stats = defaultdict(int)
    total_price = 0
    item_list = []

    prices = []  # Список для сохранения цен всех предметов

    while not all(complete_set.values()):
        random_item_type = random.choice(list(item_types.keys()))
        if complete_set[random_item_type]:
            continue

        characteristics = item_types[random_item_type].copy()
        item_stats = {}
        total_stats_value = 0

        # Генерация характеристик для предмета
        item_stats, value = add_characteristic(characteristics, weights, item_stats)
        total_stats_value += value

        if random.random() < 0.8:
            item_stats, value = add_characteristic(characteristics, weights, item_stats)
            total_stats_value += value

        if random.random() < 0.3:
            item_stats, value = add_characteristic(characteristics, weights, item_stats)
            total_stats_value += value

        if random.random() < 0.03:
            item_stats, value = add_characteristic(characteristics, weights, item_stats)
            total_stats_value += value

        if random.random() < 0.01:
            item_stats, value = add_characteristic(characteristics, weights, item_stats)
            total_stats_value += value

        # Суммирование характеристик для полного набора героя
        for stat, val in item_stats.items():
            total_item_stats[stat] += val

        # Рассчет цены предмета
        if total_stats_value == 0:
            base_price = 10
        else:
            base_price = total_stats_value * random.uniform(0.1, 0.34)

        max_price = 10000
        min_price = 10
        price_range = max_price - min_price

        non_linear_price = min_price + price_range * (1 - math.exp(-base_price / 500))
        final_price = round(max(min_price, non_linear_price), 2)

        num_characteristics = len(item_stats)
        if num_characteristics > 4:
            final_price *= 20
        elif num_characteristics > 3:
            final_price *= 5

        total_price += final_price
        prices.append(final_price)  # Сохраняем цену предмета

        # Сохранение предмета в список и отметка как собранного
        item_list.append({
            'type': random_item_type,
            'stats': item_stats,
            'price': final_price
        })
        complete_set[random_item_type] = True

    average_item_price = sum(prices) / len(prices)  # Средняя цена предмета
    max_item_price = max(prices)  # Максимальная цена предмета

    print(f"Средняя цена предмета: {average_item_price:.2f}")
    print(f"Максимальная цена предмета: {max_item_price:.2f}")

    return item_list, average_item_price, max_item_price
