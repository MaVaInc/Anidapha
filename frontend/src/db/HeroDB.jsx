// src/db/HeroDB.js
import Dexie from 'dexie';

// Создаем базу данных
const db = new Dexie('HeroDatabase');

// Определяем структуру базы данных
db.version(1).stores({
    hero: '++id, username, count_purchases ,dogsBalance',
    inventory: '++id, heroId, itemName, itemType, category, rarity, quantity'
});

// Функция для сохранения данных о герое
export const saveHeroData = async (heroData) => {
    return await db.hero.put(heroData, 1); // сохраняем данные героя с фиксированным id=1
};

// Функция для получения данных о герое
export const getHeroData = async () => {
    return await db.hero.get(1); // получаем данные героя по id=1
};

// Функция для сохранения инвентаря
export const saveInventory = async (inventoryItems) => {
    await db.inventory.clear(); // очищаем старый инвентарь
    return await db.inventory.bulkPut(inventoryItems); // сохраняем новый инвентарь
};

// Функция для получения инвентаря
export const getInventory = async () => {
    return await db.inventory.toArray();
};

// Функция для синхронизации с сервером
export const syncWithServer = async (fetchHeroDataFromServer, fetchInventoryFromServer) => {
    const heroData = await fetchHeroDataFromServer();
    const inventoryItems = await fetchInventoryFromServer();

    await saveHeroData(heroData);
    await saveInventory(inventoryItems);
};

export default db;
