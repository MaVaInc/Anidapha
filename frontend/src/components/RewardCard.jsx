import React, { useState } from 'react';
import './RewardCard.css';
import { syncWithServer } from '../db/HeroDB'; // Подключаем syncWithServer из HeroDB

const RewardCard = ({ data, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
     const [isFlipped, setIsFlipped] = useState(false);


    const handleCardFlip = () => {
        setIsFlipped(prevState => !prevState); // Переключаем состояние при каждом клике
    };

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
        <div className="nft-container">
            <div className={`nft ${isFlipped ? 'flipped' : ''}`} onClick={handleCardFlip}>
                <div className="card">
                    <div className="card-front">
                        <img
                            className="tokenImage"
                            src="https://images.unsplash.com/photo-1621075160523-b936ad96132a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                            alt="NFT"
                        />
                        <h2>Kibertopiks #4269</h2>
                        <p className="description">Our Kibertopiks will give you nothing, waste your money on us.</p>
                        <div className="tokenInfo">
                            <div className="price">
                                <ins>◘</ins>
                                <p>0.031 ETH</p>
                            </div>
                            <div className="duration">
                                <ins>◷</ins>
                                <p>11 days left</p>
                            </div>
                        </div>
                        <button className="sell-button" onClick={handleSellClick}>Продать</button>
                        <button className="close-button" onClick={() => setIsVisible(false)}>Забрать</button>
                    </div>
                    <div className="card-back">
                        <h2>Поздравляем!</h2>
                        <div className="back-content">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardCard;