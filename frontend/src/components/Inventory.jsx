import React, { useState, useEffect } from 'react';
import { SwipeableDrawer, Box } from '@mui/material';
import { getInventoryData } from '../db/HeroDB';
import InventoryFilters from './InventoryFilters';
import ItemCardInventory from './ItemCardInventory';
import InventoryItem from './InventoryItem';
import './Inventory.css';

const Inventory = ({ isOpen, toggleDrawer }) => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [filter, setFilter] = useState('all');
    const [subFilter, setSubFilter] = useState('all');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isUpdating, setIsUpdating] = useState(true);
    const [openListItem, setOpenListItem] = useState(null);  // Хранит информацию об открытом списке

    useEffect(() => {
        const fetchInventory = async () => {
            if (!isUpdating) return;

            try {
                const inventoryData = await getInventoryData();

                const combinedItems = [
                    ...inventoryData.items.map(item => ({ ...item, type: 'item', category: 'equipment' })),
                    ...inventoryData.seeds.map(seed => ({ ...seed, type: 'seed', category: 'plants' }))
                ];

                const groupedItems = combinedItems.reduce((acc, item) => {
                    const key = `${item.name}-${item.item_type || item.stage}`;
                    if (!acc[key]) {
                        acc[key] = { ...item, quantity: item.quantity || 1, originalItems: [item] };
                    } else {
                        acc[key].quantity += item.quantity || 1;
                        acc[key].originalItems.push(item);
                    }
                    return acc;
                }, {});

                const groupedArray = Object.values(groupedItems);

                setInventoryItems(groupedArray);
                applyFilters(filter, subFilter, groupedArray);
                setIsUpdating(false);  // Остановим обновление после загрузки данных
            } catch (error) {
                console.error('Error fetching inventory:', error);
            }
        };

        fetchInventory();
    }, [isUpdating]);

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
        if (item.originalItems && item.originalItems.length > 1) {
            setOpenListItem(item);
            setIsUpdating(false);  // Останавливаем обновление
        } else {
            setSelectedItem(item.originalItems ? item.originalItems[0] : item);
            setIsUpdating(false);  // Останавливаем обновление
        }
    };

    const handleListClose = () => {
        setOpenListItem(null);  // Закрываем список
        setIsUpdating(true);  // Включаем обновление
    };

    const handleCardClose = () => {
        setSelectedItem(null);
        setIsUpdating(true);  // Включаем обновление после закрытия диалога
    };

    const handleItemSold = () => {
        if (selectedItem) {
            setInventoryItems(prevItems =>
                prevItems.map(item => {
                    if (item.name === selectedItem.name && (item.item_type || item.stage) === (selectedItem.item_type || item.stage)) {
                        const remainingItems = item.originalItems.filter(i => i !== selectedItem);
                        if (remainingItems.length > 0) {
                            return { ...item, quantity: item.quantity - 1, originalItems: remainingItems };
                        } else {
                            return null;
                        }
                    }
                    return item;
                }).filter(item => item !== null)
            );
            setSelectedItem(null);
            setIsUpdating(true);  // Включаем обновление после продажи
        }
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
                            <InventoryItem
                                key={item.id}
                                item={item}
                                onClick={handleItemClick}
                                isListOpen={openListItem && openListItem.name === item.name}  // Передаем статус списка
                            />
                        ))}
                    </Box>
                </Box>
            </SwipeableDrawer>

            {openListItem && (
                <div className="item-list-overlay">
                    <div className="item-list-modal">
                        {openListItem.originalItems.map((originalItem, index) => (
                            <div key={index} className="item-list-entry" onClick={() => handleItemClick(originalItem)}>
                                <img src={originalItem.image} alt={originalItem.name} className="item-list-image" />
                                <p>{originalItem.price} DOGS</p>
                            </div>
                        ))}
                        <button onClick={handleListClose}>Close</button>
                    </div>
                </div>
            )}

            {selectedItem && (
                <ItemCardInventory
                    data={{ item: selectedItem }}
                    onClose={handleCardClose}
                    onSold={handleItemSold}
                />
            )}
        </>
    );
};

export default Inventory;
