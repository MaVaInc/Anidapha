import React, { useState, useEffect } from 'react';
import './Item.css';

const InventoryItem = ({ item, onClick, onSellAll }) => {
    const [showList, setShowList] = useState(false);

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

    const getRarityClass = (rarity) => {
        switch (rarity) {
            case 'common':
                return 'rarity-common';
            case 'uncommon':
                return 'rarity-uncommon';
            case 'rare':
                return 'rarity-rare';
            case 'epic':
                return 'rarity-epic';
            case 'legendary':
                return 'rarity-legendary';
            default:
                return '';
        }
    };

    const handleItemClick = () => {
        if (item.quantity > 1) {
            setShowList(!showList);
        } else {
            onClick(item.originalItems[0]);
        }
    };

    useEffect(() => {
        if (showList) {
            const handleDocumentClick = (event) => {
                if (!event.target.closest('.item-list') && !event.target.closest('.inventory-item')) {
                    setShowList(false);
                }
            };
            document.addEventListener('click', handleDocumentClick);
            return () => document.removeEventListener('click', handleDocumentClick);
        }
    }, [showList]);

    const handleSelectItem = (selectedItem) => {
        onClick(selectedItem);
        setShowList(false);
    };

    const handleSellAll = () => {
        onSellAll(item.originalItems);
        setShowList(false);
    };

    const sortedItems = [...item.originalItems].sort((a, b) => b.price - a.price); // Сортировка по убыванию цены

    const totalValue = sortedItems.reduce((sum, item) => sum + item.price, 0); // Общая сумма

    return (
        <div className="inventory-item-container">
            <div
                className="inventory-item"
                onClick={handleItemClick}
                style={{
                    backgroundImage: `url(${getItemGlow(item.rarity)})`,
                }}
            >
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-quantity">{item.quantity > 1 && `x${item.quantity}`}</div>
            </div>

            {showList && (
                <div className="item-list">
                    <div className="item-list-scrollable"> {/* Ограничиваем высоту списка и добавляем прокрутку */}
                        {sortedItems.map((originalItem, index) => (
                            <div
                                key={index}
                                className={`item-list-entry ${getRarityClass(originalItem.rarity)}`}
                                onClick={() => handleSelectItem(originalItem)}
                            >
                                <img src={originalItem.image} alt={originalItem.name} className="item-list-image" />
                                <p>{originalItem.price} DOGS</p>
                            </div>
                        ))}
                    </div>
                    <button className="sell-all-button" onClick={handleSellAll}>
                        Продать все за {totalValue} DOGS
                    </button>
                </div>
            )}
        </div>
    );
};

export default InventoryItem;
