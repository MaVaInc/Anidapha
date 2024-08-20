import React, { useState, useEffect } from 'react';
import { SwipeableDrawer, Tabs, Tab, Box } from '@mui/material';
import { getHeroData, getInventoryData } from '../db/HeroDB';
import InventoryFilters from './InventoryFilters';
import './Inventory.css';

const Inventory = ({ isOpen, toggleDrawer }) => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [filter, setFilter] = useState('all');
    const [subFilter, setSubFilter] = useState('all');
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        const fetchInventory = async () => {
            console.log('Fetching inventory...');

            try {
                const heroData = await getHeroData();
                const inventoryData = await getInventoryData();

                const combinedItems = [
                    ...inventoryData.items.map(item => ({ ...item, type: 'item' })),
                    ...inventoryData.seeds.map(seed => ({ ...seed, type: 'seed' }))
                ];

                setInventoryItems(combinedItems);
                setFilteredItems(combinedItems);
            } catch (error) {
                console.error('Error fetching inventory:', error);
            }
        };
        fetchInventory();
    }, []);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        if (newFilter === 'all') {
            setFilteredItems(inventoryItems);
        } else {
            const filtered = inventoryItems.filter(item => item.category === newFilter);
            setFilteredItems(filtered);
        }
    };

    const handleSubFilterChange = (newSubFilter) => {
        setSubFilter(newSubFilter);
        if (newSubFilter === 'all') {
            handleFilterChange(filter);
        } else {
            const filtered = inventoryItems.filter(item => item.item_type === newSubFilter);
            setFilteredItems(filtered);
        }
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <SwipeableDrawer
            anchor="bottom"
            open={isOpen}
            onClose={() => toggleDrawer(false)}
            onOpen={() => toggleDrawer(true)}
            className="inventory-drawer"
        >
            <Box sx={{ width: '100%' }}>
                <InventoryFilters
                    filter={filter}
                    subFilter={subFilter}
                    onFilterChange={handleFilterChange}
                    onSubFilterChange={handleSubFilterChange}
                />
                <Box p={3}>
                    {filteredItems.map((item) => (
                        <div key={item.id} className="inventory-item">
                            <p>{item.name} (x{item.quantity})</p>
                            <p>Type: {item.item_type}</p>
                            <p>Rarity: {item.rarity}</p>
                        </div>
                    ))}
                </Box>
            </Box>
        </SwipeableDrawer>
    );
};

export default Inventory;
