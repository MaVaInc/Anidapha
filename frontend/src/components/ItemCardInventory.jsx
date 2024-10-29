// src/components/ItemCardInventory.jsx

import React, { useState } from 'react';
import './ItemCardInventory.css';
import { useDispatch } from 'react-redux';
import { removeItem } from '../store/inventorySlice';

const ItemCardInventory = ({ data, onClose }) => {
  const [isSelling, setIsSelling] = useState(false);
  const dispatch = useDispatch();

  const handleSellClick = async () => {
    setIsSelling(true);
    try {
      const tg = window.Telegram.WebApp;
      const apiUrl = !tg.initData || tg.initData === '' ? 'http://localhost:8000/api' : '/api';
      const authToken = localStorage.getItem('token');
      const itemId = data.item.itemId || data.item.item_id;

      const response = await fetch(`${apiUrl}/sell/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ itemId }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        dispatch(removeItem(itemId));
        onClose();
      } else {
        throw new Error(result.message || 'Failed to sell item');
      }
    } catch (error) {
      console.error('Error selling item:', error);
      // Опционально, можно показать уведомление пользователю об ошибке
    } finally {
      setIsSelling(false);
    }
  };

  return (
    <div className="item-card-overlay">
      <div className="item-card">
        <h2>{data.item.name}</h2>
        <img src={data.item.image} alt={data.item.name} />
        <p>Цена: {data.item.price} DOGS</p>
        {/* Отображение других характеристик предмета */}
        <div className="button-group">
          <button onClick={handleSellClick} disabled={isSelling} className="sell-button">
            {isSelling ? 'Продается...' : 'Продать'}
          </button>
          <button onClick={onClose} className="close-button">Закрыть</button>
        </div>
      </div>
    </div>
  );
};

export default ItemCardInventory;
