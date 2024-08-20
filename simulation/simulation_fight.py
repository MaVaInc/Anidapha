import random
import numpy as np
from collections import defaultdict


# Функция для генерации случайных характеристик
def generate_character():
    return {
        'attack': random.randint(0, 100),
        'defense': random.randint(0, 100),
        'accuracy': random.randint(0, 100),
        'evasion': random.randint(0, 100),
        'stun': random.randint(0, 100),
        # 'block': random.randint(0, 100),
        'health': random.randint(100, 1000)
    }


# Функция для симуляции одного боя
def simulate_fight(character1, character2):
    turn = 1
    while character1['health'] > 0 and character2['health'] > 0:
        # Если прошло больше 100 ходов, оба бойца теряют по 10 HP за ход
        if turn > 100:
            character1['health'] -= 10
            character2['health'] -= 10

        # Character 1 атакует Character 2
        if attack_success(character1['accuracy'], character2['evasion']):
            damage = calculate_damage(character1['attack'], character2['defense'])
            character2['health'] -= damage

            if apply_stun(character1['stun']):
                turn += 1  # Переход к следующему ходу, если есть стан
                continue  # Character 2 пропускает ход из-за стана

        # Проверяем, проиграл ли Character 2
        if character2['health'] <= 0:
            return 1  # Победа Character 1

        # Character 2 атакует Character 1
        if attack_success(character2['accuracy'], character1['evasion']):
            damage = calculate_damage(character2['attack'], character1['defense'])
            character1['health'] -= damage

            if apply_stun(character2['stun']):
                turn += 1  # Переход к следующему ходу, если есть стан
                continue  # Character 1 пропускает ход из-за стана

        # Проверяем, проиграл ли Character 1
        if character1['health'] <= 0:
            return -1  # Победа Character 2

        turn += 1

    return 0  # Ничья (должно редко случаться)


# Функция для проверки успешности атаки
def attack_success(accuracy, evasion):
    # Вероятность попадания: если точность больше уворота, атака успешна. Всегда есть шанс 10% попасть.
    if accuracy >= evasion:
        return True
    else:
        return random.random() < 0.1  # 10% шанс на успех


# Функция для расчета урона
def calculate_damage(attack, defense):
    damage = max(1, attack - defense)  # Минимальный урон при попадании - 1
    return damage


# Функция для проверки стана
def apply_stun(stun):
    stun_chance = min(50, stun / 5)  # Максимальный шанс стана 50%
    return random.random() < (stun_chance / 100)


# Функция для проведения симуляций с изменением характеристик
def run_simulations(num_simulations=10000):
    results = defaultdict(list)

    for _ in range(num_simulations):
        base_character = generate_character()

        for stat in base_character:
            if stat == 'health':  # Особое правило для здоровья
                delta = random.randint(-50, 50)
            else:
                delta = random.randint(-10, 10)

            modified_character = base_character.copy()
            modified_character[stat] = max(0, min(1000 if stat == 'health' else 100, modified_character[stat] + delta))

            # Симуляция боя
            result = simulate_fight(base_character.copy(), modified_character.copy())

            # Сохранение результата
            results[stat].append(result)

    return results


# Функция для анализа результатов
def analyze_results(results):
    analysis = {}

    for stat, outcomes in results.items():
        wins = outcomes.count(1)
        losses = outcomes.count(-1)
        win_rate = wins / len(outcomes)
        loss_rate = losses / len(outcomes)

        analysis[stat] = {
            'win_rate': win_rate,
            'loss_rate': loss_rate,
            'win-loss_ratio': win_rate / max(loss_rate, 0.01)  # Во избежание деления на 0
        }

    return analysis


# Запуск симуляций
results = run_simulations()

# Анализ результатов
analysis = analyze_results(results)

# Вывод результатов
print("\nКорреляция характеристик с вероятностью победы:")
for stat, data in analysis.items():
    print(
        f"{stat.capitalize()} -> Win Rate: {data['win_rate']:.2%}, Loss Rate: {data['loss_rate']:.2%}, Win/Loss Ratio: {data['win-loss_ratio']:.2f}")
