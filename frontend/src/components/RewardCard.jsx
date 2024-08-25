import React, { useState, useEffect } from 'react';
import './RewardCard.css';
import { syncWithServer } from '../db/HeroDB';
import ItemAttribute from './ItemAttribute';

const RewardCard = ({ data, onClose }) => {
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
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFlipped(false);
        }, 1500);

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
                body: JSON.stringify({ itemId: data.item.itemId })
            });

            if (response.status === 200) {
                const result = await response.json();
                console.log('Item sold successfully:', result);

                await syncWithServer();

                setIsVisible(false);
                if (onClose) {
                    onClose();
                }
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
            <div className={`nft ${isFlipped ? 'flipped' : ''} `} onClick={handleCardFlip}>
                <div className={`card ${rarityClass}`}>
                    <div className="card-front">
                        <img
                            className="tokenImage"
                            style={{ backgroundImage: `url(${getItemGlow(data.item.rarity)})`}}
                            src={data.item.image}
                            alt="NFT"
                        />
                        <h2 className="item-name">{data.item.name} #{data.item.itemId}</h2>
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

                            <ItemAttribute label="Атака" value={data.item.attack} icon="/images/attack.png" />
                            <ItemAttribute label="Защита" value={data.item.defense} icon="/images/defense.png" />
                            <ItemAttribute label="Точность" value={data.item.accuracy} icon="/images/accuracy.png" />
                            <ItemAttribute label="Уклонение" value={data.item.evasion} icon="/images/evasion.png" />
                            <ItemAttribute label="Оглушение" value={data.item.stun} icon="/images/stun.png" />
                            <ItemAttribute label="Блок" value={data.item.block} icon="/images/block.png" />
                            <ItemAttribute label="Здоровье" value={data.item.health} icon="/images/health.png" />
                        </div>
                        <p className="description">Не советую одевать если жить хочется</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardCard;
