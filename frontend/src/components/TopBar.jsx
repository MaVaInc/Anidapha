import React, { useState, useEffect } from 'react';
import './TopBar.css';
import {getHeroData, getInventoryData, saveInventory, syncWithServer} from '../db/HeroDB';

const TopBar = () => {
    const [hero, setHero] = useState(null);
    const [inventory, setInventory] = useState(null);

    const loadHeroData = async () => {
        const data = await getHeroData();
        setHero(data);
    };
    const loadInventoryData = async () => {
        const data = await getInventoryData();
        setInventory(data);
    };
    useEffect(() => {
        loadHeroData();
        loadInventoryData();

        const intervalId = setInterval(() => {
            loadHeroData();
            loadInventoryData();
            syncWithServer()
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    if (!hero) return <p>Loading...</p>;

    return (
        <header className="top-bar">
            <div className="coin">
                <img src="/images/dogs_ico.png" alt="Platinum" className="coin-img" />
                <span>{hero.dogs_balance}</span>
            </div>
        </header>
    );
};

export default TopBar;
