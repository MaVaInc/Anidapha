import React, { useState, useEffect } from 'react';
import './Market.css';

const Market = () => {
    const [items, setItems] = useState({
        weapons: [],
        armors: [],
        rings: [],
        amulets: [],
        boots: [],
        gloves: [],
        plants: []
    });
    const [activeTab, setActiveTab] = useState('weapons');
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/market');
                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error('Error fetching market data:', error);
            }
        };

        fetchItems();
    }, []);

    const handleTouchStart = (e) => {
        const timeout = setTimeout(() => {
            setModalVisible(true);
        }, 1000);

        e.target.addEventListener('touchend', () => {
            clearTimeout(timeout);
            setModalVisible(false);
        }, { once: true });
    };

    const categories = Object.keys(items);

    return (
        <div className="market-container" onTouchStart={handleTouchStart}>
            <h1>Market</h1>
            {isModalVisible && (
                <div className="category-modal">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="category-item"
                            style={{
                                transform: `rotate(${(360 / categories.length) * index}deg) translate(150px) rotate(-${(360 / categories.length) * index}deg)`,
                            }}
                            onTouchStart={() => setActiveTab(category)}
                        >
                            {category}
                        </div>
                    ))}
                </div>
            )}
            <div className="items-container">
                {items[activeTab].map((item, index) => (
                    <div className="market-item" key={index}>
                        <img src={item.image} alt={item.name} className="item-image" />
                        <p>{item.name}</p>
                        <button>Buy</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Market;
