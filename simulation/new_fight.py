import random
from collections import defaultdict

from simulation.get_full_hero import simulate_hero


# Функция для генерации персонажа с заданным сетом характеристик
def generate_character_with_set(set_items):
    character = {
        'attack': 0,
        'defense': 0,
        'accuracy': 0,
        'evasion': 0,
        'stun': 0,
        'health': 0,
        'block': 0,
        'price': 0,
    }
    print(set_items)
    for item in set_items:

        for stat, value in item.items():
            if stat == 'price':
                character[stat] += value
            if stat == 'stats':
                for sta, value in value.items():
                    character[sta] += value

    return character


# Функция для симуляции одного боя между двумя персонажами
def simulate_fight(character1, character2):
    turn = 1
    while character1['health'] > 0 and character2['health'] > 0:
        if turn > 100:
            character1['health'] -= 10
            character2['health'] -= 10

        # Character 1 атакует Character 2
        if attack_success(character1['accuracy'], character2['evasion']):
            damage = calculate_damage(character1['attack'], character2['defense'])
            character2['health'] -= damage

            if apply_stun(character1['stun']):
                turn += 1
                continue

        if character2['health'] <= 0:
            return 1

        # Character 2 атакует Character 1
        if attack_success(character2['accuracy'], character1['evasion']):
            damage = calculate_damage(character2['attack'], character1['defense'])
            character1['health'] -= damage

            if apply_stun(character2['stun']):
                turn += 1
                continue

        if character1['health'] <= 0:
            return -1

        turn += 1

    return 0


# Функция для проверки успешности атаки
def attack_success(accuracy, evasion):
    if accuracy >= evasion:
        return True
    else:
        return random.random() < 0.1


# Функция для расчета урона
def calculate_damage(attack, defense):
    damage = max(1, attack - defense)
    return damage


# Функция для проверки стана
def apply_stun(stun):
    stun_chance = min(50, stun / 5)
    return random.random() < (stun_chance / 100)


# Функция для симуляции боев между персонажами с наборами предметов
def run_set_simulations(num_simulations=10000):
    results = defaultdict(lambda: defaultdict(list))
    price_differences = []

    for _ in range(num_simulations):
        # Генерация двух персонажей с наборами предметов
        character1 = generate_character_with_set(simulate_hero())
        character2 = generate_character_with_set(simulate_hero())

        # Сравнение цены между двумя персонажами
        price_diff = character1['price'] - character2['price']

        # Симуляция боя
        result = simulate_fight(character1, character2)

        # Сохранение разницы характеристик и результатов
        for stat in character1:
            if stat != 'price':  # исключаем цену на этом этапе
                diff = character1[stat] - character2[stat]
                results[stat]['diff'].append(diff)
                results[stat]['result'].append(result)

        # Сохранение результата по цене
        price_differences.append((price_diff, result))

    return results, price_differences


# Функция для анализа результатов
def analyze_results(results, price_differences):
    analysis = {}

    for stat, data in results.items():
        win_rate_for_positive_diff = sum(1 for d, r in zip(data['diff'], data['result']) if d > 0 and r == 1) / max(
            sum(1 for d in data['diff'] if d > 0), 1)
        loss_rate_for_positive_diff = sum(1 for d, r in zip(data['diff'], data['result']) if d > 0 and r == -1) / max(
            sum(1 for d in data['diff'] if d > 0), 1)
        win_loss_ratio_for_positive_diff = win_rate_for_positive_diff / max(loss_rate_for_positive_diff, 0.01)

        win_rate_for_negative_diff = sum(1 for d, r in zip(data['diff'], data['result']) if d < 0 and r == 1) / max(
            sum(1 for d in data['diff'] if d < 0), 1)
        loss_rate_for_negative_diff = sum(1 for d, r in zip(data['diff'], data['result']) if d < 0 and r == -1) / max(
            sum(1 for d in data['diff'] if d < 0), 1)
        win_loss_ratio_for_negative_diff = win_rate_for_negative_diff / max(loss_rate_for_negative_diff, 0.01)

        analysis[stat] = {
            'win_rate_positive_diff': win_rate_for_positive_diff,
            'loss_rate_positive_diff': loss_rate_for_positive_diff,
            'win_loss_ratio_positive_diff': win_loss_ratio_for_positive_diff,
            'win_rate_negative_diff': win_rate_for_negative_diff,
            'loss_rate_negative_diff': loss_rate_for_negative_diff,
            'win_loss_ratio_negative_diff': win_loss_ratio_for_negative_diff,
        }

    # Анализ корреляции цены
    price_analysis = {
        'price_win_rate': sum(1 for pd, r in price_differences if pd > 0 and r == 1) / max(
            sum(1 for pd in price_differences if pd[0] > 0), 1),
        'price_loss_rate': sum(1 for pd, r in price_differences if pd > 0 and r == -1) / max(
            sum(1 for pd in price_differences if pd[0] > 0), 1),
        'price_win_loss_ratio': sum(1 for pd, r in price_differences if pd > 0 and r == 1) / max(
            sum(1 for pd, r in price_differences if pd > 0 and r == -1), 0.01)
    }

    return analysis, price_analysis


# Запуск симуляций
results, price_differences = run_set_simulations()

# Анализ результатов
analysis, price_analysis = analyze_results(results, price_differences)

# Вывод результатов
print("\nКорреляция характеристик с вероятностью победы:")
for stat, data in analysis.items():
    print(f"{stat.capitalize()} ->")
    print(f"  Positive Diff: Win Rate: {data['win_rate_positive_diff']:.2%}, Loss Rate: {data['loss_rate_positive_diff']:.2%}, Win/Loss Ratio: {data['win_loss_ratio_positive_diff']:.2f}")
    print(f"  Negative Diff: Win Rate: {data['win_rate_negative_diff']:.2%}, Loss Rate: {data['loss_rate_negative_diff']:.2%}, Win/Loss Ratio: {data['win_loss_ratio_negative_diff']:.2f}")

print("\nКорреляция цены с вероятностью победы:")
print(f"  Win Rate: {price_analysis['price_win_rate']:.2%}")
print(f"  Loss Rate: {price_analysis['price_loss_rate']:.2%}")
print(f"  Win/Loss Ratio: {price_analysis['price_win_loss_ratio']:.2f}")
