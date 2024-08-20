import React, { useState, useEffect } from 'react';
import './RewardCard.css';
import { syncWithServer } from '../db/HeroDB';

const RewardCard = ({ data, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        // Таймер для автоматического переворачивания карточки через 1 секунду
        const timer = setTimeout(() => {
            setIsFlipped(true);
        }, 1000);

        // Очистка таймера при размонтировании компонента
        return () => clearTimeout(timer);
    }, []);

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
                            src={data.item.image}
                            alt="NFT"
                        />
                        <h2 className={"h2"}>{data.item.name} #{data.item.itemId}</h2>
                        <p className="description">Предмет проклятой коллекции</p>
                        <div className="tokenInfo">
                            <div className="price">
                                <ins>◘</ins>
                                <p>{data.item.price} DOGS</p>
                            </div>
                            <div className="duration">
                                <ins>◷</ins>
                                <p>{data.item.image}</p>
                            </div>
                        </div>
                        <div className="button-container">
                            <button className="sell-button" onClick={handleSellClick}>Продать</button>
                            <button className="close-button" onClick={onClose}>Забрать</button>
                        </div>
                    </div>
                    <div className="card-back">
                        <h2 className="item-name">{data.item.name}</h2>
                        <div className="back-content">
                            <div className="item-info">
                                <span>Тип:</span>
                                <span className="item-value">{data.item.item_type}</span>
                            </div>
                            <div className="item-info">
                                <span>Атака:</span>
                                <span className="item-value">{data.item.attack}</span>
                            </div>
                            <div className="item-info">
                                <span>Защита:</span>
                                <span className="item-value">{data.item.defense}</span>
                            </div>
                            <div className="item-info">
                                <span>Точность:</span>
                                <span className="item-value">{data.item.accuracy}</span>
                            </div>
                            <div className="item-info">
                                <span>Уклонение:</span>
                                <span className="item-value">{data.item.evasion}</span>
                            </div>
                            <div className="item-info">
                                <span>Оглушение:</span>
                                <span className="item-value">{data.item.stun}</span>
                            </div>
                            <div className="item-info">
                                <span>Блок:</span>
                                <span className="item-value">{data.item.block}</span>
                            </div>
                            <div className="item-info">
                                <span>Здоровье:</span>
                                <span className="item-value">{data.item.health}</span>
                            </div>
                            <div className="item-info">
                                <span>Уникальные свойства:</span>
                                <span className="item-value">{data.item.unique_properties}</span>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default RewardCard;
