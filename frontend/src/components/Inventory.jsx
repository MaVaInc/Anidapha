// src/components/Inventory.jsx
import React from 'react';
import { useHero } from '../context/HeroContext';

const Inventory = () => {
    const { inventory } = useHero();

    if (!inventory.length) return <p>No items in inventory</p>;

    return (
        <div>
            <h2>Inventory</h2>
            <ul>
                {inventory.map((item) => (
                    <li key={item.id}>
                        {item.itemName} - {item.category} ({item.rarity})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Inventory;
