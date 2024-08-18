import React, { useState } from 'react';
import './RewardCard.css';
import { syncWithServer } from '../db/HeroDB'; // Подключаем syncWithServer из HeroDB

const RewardCard = ({ data, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleSellClick = async () => {
        try {
            const tg = window.Telegram.WebApp;
            const apiUrl = !tg.initData || tg.initData === '' ? 'http://localhost:8000/api' : '/api';
            const authToken = localStorage.getItem('token');

            const response = await fetch(`${apiUrl}/sell`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ itemId: data.item.itemId })
            });

            if (response.status === 200) {
                const result = await response.json();
                console.log('Item sold successfully:', result);

                await syncWithServer(); // Синхронизация данных после продажи

                setIsVisible(false); // Скрываем карточку после продажи
                if (onClose) {
                    onClose(); // Закрываем карточку
                }
            } else {
                throw new Error('Failed to sell item');
            }
        } catch (error) {
            console.error('Error selling item:', error);
        }
    };

    if (!isVisible) return null; // Скрываем компонент, если он не виден

    return (
        <div className="reward-card">
            <div className="reward-content">
                <h2>Поздравляем!</h2>
                <p>Название: {data.item.name}</p>
                <p>Тип: {data.item.item_type}</p>
                <p>Атака: {data.item.attack}</p>
                <p>Защита: {data.item.defense}</p>
                <p>Точность: {data.item.accuracy}</p>
                <p>Уклонение: {data.item.evasion}</p>
                <p>Оглушение: {data.item.stun}</p>
                <p>Блок: {data.item.block}</p>
                <p>Здоровье: {data.item.health}</p>
                <p>Цена: {data.item.price}</p>

                <p>Уникальные свойства: {data.item.unique_properties}</p>

                <button className="sell-button" onClick={handleSellClick}>Продать</button>
                <button className="close-button" onClick={() => {
                    setIsVisible(false);
                    if (onClose) {
                        onClose();
                    }
                }}>Закрыть</button>
            </div>
        </div>
    );
};

export default RewardCard;
