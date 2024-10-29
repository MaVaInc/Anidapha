// src/db/HeroDB.js

import Dexie from 'dexie';

// Создаем базу данных
const db = new Dexie('Database');

// Определяем структуру базы данных
db.version(1).stores({
  items: '++id, item_id, name, item_type, category, stage, quantity, price, rarity, image',
  hero: '++id, dogs_balance',
});

// Функции для работы с данными

export const getInventoryData = async () => {
  try {
    const items = await db.items.toArray();
    return items;
  } catch (error) {
    console.error('Error getting inventory data:', error);
    throw error;
  }
};

export const saveInventoryData = async (items) => {
  try {
    await db.items.clear();
    await db.items.bulkPut(items);
  } catch (error) {
    console.error('Error saving inventory data:', error);
    throw error;
  }
};

export const fetchHeroDataFromServer = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/user_data/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Failed to fetch hero data');
    }
  } catch (error) {
    console.error('Error fetching hero data:', error);
    throw error;
  }
};

export const fetchInventoryFromServer = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/inventory/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
    });
    if (response.ok) {
      const data = await response.json();
      // Трансформация данных в нужный формат, если необходимо
      return data.items;
    } else {
      throw new Error('Failed to fetch inventory data');
    }
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    throw error;
  }
};

// Добавляем функцию для получения ежедневного вознаграждения
export const fetchDailyRewardFromServer = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/get_daily_reward/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
    });
    if (response.ok) {
      const data = await response.json();
      return data.reward;
    } else if (response.status === 403) {
      // Возвращаем null, если награду уже получили
      return null;
    } else {
      throw new Error('Failed to fetch daily reward');
    }
  } catch (error) {
    console.error('Error fetching daily reward:', error);
    throw error;
  }
};

export default db;
