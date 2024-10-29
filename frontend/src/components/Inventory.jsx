// src/components/Inventory.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { SwipeableDrawer, Box } from '@mui/material';
import InventoryFilters from './InventoryFilters';
import InventoryItem from './InventoryItem';
import ItemCardInventory from './ItemCardInventory';
import './Inventory.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInventoryData, removeItem, removeItemsByName } from '../store/inventorySlice';

const Inventory = ({ isOpen, toggleDrawer }) => {
  const dispatch = useDispatch();
  const inventoryItems = useSelector((state) => state.inventory.items);
  const inventoryStatus = useSelector((state) => state.inventory.status);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [subFilter, setSubFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [openGroup, setOpenGroup] = useState(null);

  useEffect(() => {
    if (isOpen && inventoryStatus === 'idle') {
      dispatch(fetchInventoryData());
    }
  }, [isOpen, dispatch, inventoryStatus]);

  useEffect(() => {
    if (inventoryStatus === 'succeeded') {
      const groupedItems = groupInventoryItems(inventoryItems);
      applyFilters(filter, subFilter, groupedItems);
    } else if (inventoryStatus === 'failed') {
      console.error('Failed to load inventory data');
    }
  }, [inventoryItems, filter, subFilter, inventoryStatus]);

  const groupInventoryItems = (items) => {
    if (!Array.isArray(items)) return [];

    const groupedItems = items.reduce((groups, item) => {
      const key = `${item.name}-${item.item_type || item.stage}`;
      if (!groups[key]) {
        groups[key] = {
          ...item,
          quantity: 1,
          originalItems: [item],
        };
      } else {
        groups[key].quantity += 1;
        groups[key].originalItems.push(item);
      }
      return groups;
    }, {});
    return Object.values(groupedItems);
  };

  const applyFilters = useCallback((mainFilter, subFilter, items) => {
    let filtered = items;

    if (mainFilter !== 'all') {
      filtered = filtered.filter((item) => item.category === mainFilter);
    }

    if (subFilter !== 'all') {
      if (mainFilter === 'equipment') {
        filtered = filtered.filter((item) => item.item_type === subFilter);
      } else if (mainFilter === 'resources') {
        filtered = filtered.filter((item) => item.item_type === subFilter);
      } else if (mainFilter === 'plants') {
        filtered = filtered.filter((item) => item.stage === subFilter);
      }
    }

    setFilteredItems(filtered);
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    const groupedItems = groupInventoryItems(inventoryItems);
    applyFilters(newFilter, subFilter, groupedItems);
    if (newFilter === 'all') {
      setSubFilter('all');
    }
  };

  const handleSubFilterChange = (newSubFilter) => {
    setSubFilter(newSubFilter);
    const groupedItems = groupInventoryItems(inventoryItems);
    applyFilters(filter, newSubFilter, groupedItems);
  };

  const handleItemClick = (item) => {
    if (item.originalItems && item.originalItems.length > 1) {
      setOpenGroup(item);
    } else {
      setSelectedItem(item.originalItems ? item.originalItems[0] : item);
    }
  };

  const handleGroupItemClick = (item) => {
    setSelectedItem(item);
    setOpenGroup(null);
  };

  const handleItemSold = (soldItemId) => {
    dispatch(removeItem(soldItemId));
    setSelectedItem(null);
  };

  const handleItemSellFailed = (failedItem) => {
    console.error('Failed to sell item:', failedItem);
    setSelectedItem(null);
  };

  const handleSellAllFromGroup = async (group) => {
    try {
      const authToken = localStorage.getItem('token');
      const itemIds = group.originalItems.map((item) => item.item_id || item.seed_id);
      const response = await fetch('/api/sell_all/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ itemIds }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        dispatch(removeItemsByName(group.name));
        setOpenGroup(null);
      } else {
        throw new Error(data.message || 'Failed to sell items');
      }
    } catch (error) {
      console.error('Error selling all items from group:', error);
      // Опционально, можно показать уведомление пользователю об ошибке
    }
  };

  const handleGroupClose = () => {
    setOpenGroup(null);
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
            {inventoryStatus === 'loading' && <p>Loading inventory...</p>}
            {inventoryStatus === 'failed' && <p>Error loading inventory.</p>}
            {inventoryStatus === 'succeeded' && filteredItems.length === 0 && <p>No items found.</p>}
            {inventoryStatus === 'succeeded' && filteredItems.map((item) => (
              <InventoryItem
                key={`${item.name}-${item.item_type || item.stage}`}
                item={item}
                onClick={handleItemClick}
              />
            ))}
          </Box>
        </Box>
      </SwipeableDrawer>

      {openGroup && (
        <div className="group-modal">
          <div className="group-modal-content">
            <h3>
              {openGroup.name} (x{openGroup.quantity})
            </h3>
            <div className="group-buttons">
              <button onClick={() => handleSellAllFromGroup(openGroup)}>Продать все</button>
              <button onClick={handleGroupClose}>Закрыть</button>
            </div>
            <div className="group-items-list">
              {openGroup.originalItems.map((item) => (
                <div
                  key={item.item_id || item.seed_id}
                  className="group-item"
                  onClick={() => handleGroupItemClick(item)}
                >
                  <p>ID: {item.item_id || item.seed_id}</p>
                  <p>Цена: {item.price} DOGS</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedItem && (
        <ItemCardInventory
          data={{ item: selectedItem }}
          onSold={handleItemSold}
          onSellFailed={handleItemSellFailed}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
};

export default Inventory;
