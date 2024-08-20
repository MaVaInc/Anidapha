import React, { useState, useEffect } from 'react';
import './TopBar.css';
import { getHeroData } from '../db/HeroDB';

const TopBar = () => {
    const [hero, setHero] = useState(null);

    const loadHeroData = async () => {
        const data = await getHeroData();
        setHero(data);
    };

    useEffect(() => {
        loadHeroData();

        const intervalId = setInterval(() => {
            loadHeroData();
        }, 1000);

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
