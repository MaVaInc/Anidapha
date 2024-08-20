import random
import math

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
        'weapon': {'attack': (1, 10), 'accuracy': (-3, 5), 'defense': (0, 4)},
        'armor': {'defense': (3, 12), 'health': (10, 80)},
        'helmet': {'defense': (2, 8), 'health': (5, 40)},
        'shield': {'block': (15, 35), 'defense': (5, 15)},
        'boots': {'evasion': (3, 10), 'accuracy': (1, 5)},
        'gloves': {'accuracy': (5, 10), 'attack': (2, 8)},
        'ring': {'accuracy': (3, 8), 'evasion': (3, 8)},
        'amulet': {'health': (15, 70), 'defense': (2, 8)},
        'belt': {'health': (10, 50), 'defense': (1, 5)},
        'accessory': {'unique_properties': (1, 1)},
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
def simulate_item_price():
    # Определяем возможные типы предметов
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
        'accessory': {'unique_properties': (1, 1)},
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
    if num_characteristics > 4:
        final_price *= 20  # x20 для более 4 характеристик
    elif num_characteristics > 3:
        final_price *= 5  # x5 для более 3 характеристик

    final_price = round(final_price, 2)

    return final_price

# Симуляция 19999 предметов
prices = [simulate_item_price() for _ in range(19999)]

average_price = sum(prices) / len(prices)
max_price = max(prices)

print(f"Average Price: {average_price:.2f}")
print(f"Max Price: {max_price:.2f}")
