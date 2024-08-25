import React, { useState, useEffect } from 'react';
import './RewardCard.css';
import { syncWithServer } from '../db/HeroDB';

const ItemCardInventory = ({ data, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isFlipped, setIsFlipped] = useState(false);

    const getItemGlow = (rarity) => {
        switch (rarity) {
            case 'common':
                return 'images/background/commonItem.png';
            case 'uncommon':
                return 'images/background/uncommonItem.png';
            case 'rare':
                return 'images/background/rareItem.png';
            case 'epic':
                return 'images/background/epicItem.png';
            case 'legendary':
                return 'images/background/legendaryItem.png';
            default:
                return 'images/background/defaultItem.png';
        }
    };

    const getRarityBackgroundClass = (rarity) => {
        switch (rarity) {
            case 'common':
                return 'common-background';
            case 'uncommon':
                return 'uncommon-background';
            case 'rare':
                return 'rare-background';
            case 'epic':
                return 'epic-background';
            case 'legendary':
                return 'legendary-background';
            default:
                return '';
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFlipped(true);
        }, 1);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFlipped(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleCardFlip = () => {
        setIsFlipped(prevState => !prevState);
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
                body: JSON.stringify({ itemId: data.item.item_id || data.item.seed_id })
            });

            if (response.status === 200) {
                const result = await response.json();
                console.log('Item sold successfully:', result);

                await syncWithServer();

                setIsVisible(false);

                onClose();
            } else {
                throw new Error('Failed to sell item');
            }
        } catch (error) {
            console.error('Error selling item:', error);
        }
    };

    if (!isVisible) return null;

    const rarityClass = `${data.item.rarity}-border`;

    return (
        <div className="nft-container">
            <div className={`nft ${isFlipped ? 'flipped' : ''}`} onClick={handleCardFlip}>
                <div className={`card ${rarityClass}`}>
                    <div className="card-front">
                        <img
                            className="tokenImage"
                            style={{ backgroundImage: `url(${getItemGlow(data.item.rarity)})`}}
                            src={data.item.image}
                            alt="NFT"
                        />
                        <h2 className="h2">{data.item.name} #{data.item.itemId}</h2>
                        <p className="description">Не советую одевать если жить хочется</p>
                        <div className="tokenInfo">
                            <div className="price">
                                <ins>◘</ins>
                                <p>{data.item.price} DOGS</p>
                            </div>
                            <div className="duration">
                                <ins>◷</ins>
                                <p>{data.item.name}</p>
                            </div>
                        </div>
                        <div className="button-container">
                            <button className="sell-button" onClick={handleSellClick}>Продать</button>
                            <button className="close-button" onClick={onClose}>Забрать</button>
                        </div>
                    </div>
                    <div className={`card-back ${getRarityBackgroundClass(data.item.rarity)}`}>
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
                                <span className="item-value">Есть</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemCardInventory;
