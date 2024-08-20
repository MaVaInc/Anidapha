import React, { useState, useEffect } from 'react';
import { SwipeableDrawer, Box } from '@mui/material';
import { getHeroData, getInventoryData } from '../db/HeroDB';
import InventoryFilters from './InventoryFilters';
import ItemCardInventory from './ItemCardInventory';
import './Inventory.css';

const Inventory = ({ isOpen, toggleDrawer }) => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [filter, setFilter] = useState('all');
    const [subFilter, setSubFilter] = useState('all');
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchInventory = async () => {
            console.log('Fetching inventory...');

            try {
                const heroData = await getHeroData();
                const inventoryData = await getInventoryData();

                console.log('Hero Data:', heroData);
                console.log('Inventory Data:', inventoryData);

                const combinedItems = [
                    ...inventoryData.items.map(item => ({ ...item, type: 'item', category: 'equipment' })),
                    ...inventoryData.seeds.map(seed => ({ ...seed, type: 'seed', category: 'plants' }))
                ];

                console.log('Combined Items:', combinedItems);

                setInventoryItems(combinedItems);
                applyFilters(filter, subFilter, combinedItems);
            } catch (error) {
                console.error('Error fetching inventory:', error);
            }
        };

        fetchInventory(); // первоначальный вызов

        const intervalId = setInterval(fetchInventory, 2000); // запуск интервала на 2 секунды

        return () => clearInterval(intervalId); // очистка интервала при размонтировании компонента
    }, [filter, subFilter]); // включаем зависимость от фильтров

    const applyFilters = (mainFilter, subFilter, items) => {
        let filtered = items;

        if (mainFilter !== 'all') {
            filtered = filtered.filter(item => item.category === mainFilter);
        }

        if (subFilter !== 'all') {
            if (mainFilter === 'plants') {
                filtered = filtered.filter(item => item.stage === subFilter);
            } else {
                filtered = filtered.filter(item => item.item_type === subFilter);
            }
        }

        console.log('Filtered Items:', filtered);
        setFilteredItems(filtered);
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        applyFilters(newFilter, subFilter, inventoryItems);
    };

    const handleSubFilterChange = (newSubFilter) => {
        setSubFilter(newSubFilter);
        applyFilters(filter, newSubFilter, inventoryItems);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    const handleCardClose = () => {
        setSelectedItem(null);
    };

    return (
        <>
            <SwipeableDrawer
                anchor="bottom"
                open={isOpen}
                onClose={() => toggleDrawer(false)}
                onOpen={() => toggleDrawer(true)}
                className="inventory-drawer"
            >
                <Box sx={{ width: '100%', height: '100%' }}>
                    <InventoryFilters
                        filter={filter}
                        subFilter={subFilter}
                        onFilterChange={handleFilterChange}
                        onSubFilterChange={handleSubFilterChange}
                    />
                    <Box className="inventory-content">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="inventory-item" onClick={() => handleItemClick(item)}>
                                <p>{item.name} (x{item.quantity})</p>
                                <p>Type: {item.item_type}</p>
                                <p>Rarity: {item.rarity}</p>
                            </div>
                        ))}
                    </Box>
                </Box>
            </SwipeableDrawer>

            {selectedItem && (
                <ItemCardInventory
                    data={{ item: selectedItem }}
                    onClose={handleCardClose}
                />
            )}
        </>
    );
};

export default Inventory;
