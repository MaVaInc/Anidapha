// src/db/HeroDB.js
import Dexie from 'dexie';

// Создаем базу данных
const db = new Dexie('HeroDatabase');

// Определяем структуру базы данных
db.version(1).stores({
    hero: 'id, username, count_purchases ,dogsBalance',
    inventory: '++id, heroId, itemName, itemType, category, rarity, quantity'
});

// Функция для сохранения данных о герое
export const saveHeroData = async (heroData) => {
    db.hero.clear()
    return await db.hero.put(heroData); // сохраняем данные героя с фиксированным id=1
};

// Функция для получения данных о герое
export const getHeroData = async () => {
    return await db.hero.orderBy('id').first(); // Получаем первого героя по порядку
};

// Функция для получения данных героя с сервера
export const fetchHeroDataFromServer = async () => {
    let token;
    token = localStorage.getItem('token');
    try {

        const response = await fetch('/api/user_data/',{
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
    redirect: 'follow'
}); // API-эндпоинт для получения данных героя
        if (response.ok) {
            const data = await response.json();
            console.log('Hero data fetched from server:', data);
            return data;
        } else {
            throw new Error('Failed to fetch hero data');
        }
    } catch (error) {
        console.error('Error fetching hero data:', error);
        throw error;
    }
};

// Функция для получения данных инвентаря с сервера
export const fetchInventoryFromServer = async () => {
    let token;
    token = localStorage.getItem('token');
    try {

        const response = await fetch('/api/inventory/',{
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
    redirect: 'follow'
}); // API-эндпоинт для получения данных героя
        if (response.ok) {
            const data = await response.json();
            console.log('Hero data fetched from server:', data);
            return data;
        } else {
            throw new Error('Failed to fetch hero data');
        }
    } catch (error) {
        console.error('Error fetching hero data:', error);
        throw error;
    }
};

// Функция для сохранения данных героя в локальное хранилище (например, IndexedDB, LocalStorage)

// Функция для сохранения данных инвентаря в локальное хранилище
export const saveInventory = async (items) => {
    // Здесь ваш код для сохранения данных инвентаря
    console.log('Inventory data saved locally:', items);
};

// Функция синхронизации с сервером
export const syncWithServer = async () => {
    try {
        const heroData = await fetchHeroDataFromServer();
        const inventoryItems = await fetchInventoryFromServer();

        await saveHeroData(heroData);
        await saveInventory(inventoryItems);

        console.log('Sync with server completed successfully.');
    } catch (error) {
        console.error('Error during sync with server:', error);
    }
};


export default db;
