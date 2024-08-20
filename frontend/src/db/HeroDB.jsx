import Dexie from 'dexie';

// Создаем базу данных
const db = new Dexie('UserDatabase');

// Определяем структуру базы данных
db.version(1).stores({
    hero: '++id, dogs_balance',
    items: '++id, item_id, name, item_type, quantity, attack, defense, accuracy,evasion, stun, block, health,price,image',
    seeds: '++id, name, growth_time, rarity, stage, quantity, seed_id'
});

export const saveHeroData = async (heroData) => {
    const heroToSave = {
        dogs_balance: heroData.dogs_balance
    };
    // console.log('Saving hero data:', heroToSave);
    try {
        await db.hero.clear();
        return await db.hero.put(heroToSave); // сохраняем данные героя
    } catch (error) {
        console.error('Error saving hero data:', error);
        throw error;
    }
};

export const saveInventory = async (data) => {
    try {
        // Очистка старых данных
        await db.items.clear();
        await db.seeds.clear();

        // Разделение данных на items и seeds
        const itemRecords = [];
        const seedRecords = [];
        // Если данные приходят с ключами `item` и `seed`, соответственно разбиваем их
        if (data.item) {
            data.item.forEach(item => {
                itemRecords.push({
                    item_id: item.id,
                    name: item.name,
                    item_type: item.item_type,
                    quantity: item.quantity || 1,
                    attack: item.attack || 0,
                    defense: item.defense || 0,
                    accuracy: item.accuracy || 0,
                    evasion: item.evasion || 0,
                    stun: item.stun || 0,
                    block: item.block || 0,
                    health: item.health || 0,
                    price: item.price || 0.0,
                    image: item.image || ''
                });
            });
        }

        if (data.seed) {
            data.seed.forEach(seed => {
                seedRecords.push({
                    seed_id: seed.id,
                    name: seed.name,
                    growth_time: seed.growth_time || 0,
                    rarity: seed.rarity || 'common',
                    stage: seed.stage || 'seed',
                    quantity: seed.quantity || 1
                });
            });
        }

        // Сохранение в базу данных
        if (itemRecords.length > 0) {
            await db.items.bulkPut(itemRecords);
        }

        if (seedRecords.length > 0) {
            await db.seeds.bulkPut(seedRecords);
        }

    } catch (error) {
        console.error('Error saving inventory data:', error);
        throw error;
    }
};

export const getHeroData = async () => {
    try {
        const heroData = await db.hero.orderBy('id').first();
        return heroData;
    } catch (error) {
        throw error;
    }
};

export const getInventoryData = async () => {
    try {
        const items = await db.items.toArray();
        const seeds = await db.seeds.toArray();
        return { items, seeds };
    } catch (error) {
        console.error('Error retrieving inventory data:', error);
        throw error;
    }
};

// Функция синхронизации с сервером
export const syncWithServer = async () => {
    try {
        const heroData = await fetchHeroDataFromServer();
        const inventoryItems = await fetchInventoryFromServer();

        await saveHeroData(heroData);
        await saveInventory(inventoryItems);

    } catch (error) {
        console.error('Error during sync with server:', error);
    }
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
            return data;
        } else {
            throw new Error('Failed to fetch hero data');
        }
    } catch (error) {
        console.error('Error fetching hero data:', error);
        throw error;
    }
};

export default db;
