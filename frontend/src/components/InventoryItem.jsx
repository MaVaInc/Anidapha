import React from 'react';
// Убедитесь, что файл InventoryItem.css существует или замените на свои стили
import './Inventory.css';

const InventoryItem = ({ item, onClick }) => {
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
    return `rarity-${rarity}`;
  };

  return (
    <div className="inventory-item-container">
      <div
        className={`inventory-item ${getRarityClass(item.rarity)}`}
        onClick={() => onClick(item)}
        style={{
          backgroundImage: `url(${getItemGlow(item.rarity)})`,
        }}
      >
        <img src={item.image} alt={item.name} className="item-image" />
        {item.quantity > 1 && <div className="item-quantity">x{item.quantity}</div>}
      </div>
    </div>
  );
};

export default InventoryItem;
