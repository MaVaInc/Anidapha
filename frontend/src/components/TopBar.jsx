import React, { useState, useEffect } from 'react';
import './TopBar.css';
import { getHeroData } from '../db/HeroDB';

const HeroProfile = () => {
    const [hero, setHero] = useState(null);

    useEffect(() => {
        // Получаем данные о герое из локальной базы данных
        const loadHeroData = async () => {
            const data = await getHeroData();
            setHero(data);  // Сохраняем данные в состояние
        };

        loadHeroData();
    }, []); // Пустой массив зависимостей означает, что эффект выполнится только один раз при монтировании компонента

    if (!hero) return <p>Loading...</p>;

    return (
        <div>
            {hero.dogsBalance}
        </div>
    );
}

const TopBar = () => {
    const [hero, setHero] = useState(null);

    useEffect(() => {
        // Загружаем данные героя, когда компонент монтируется
        const loadHeroData = async () => {
            const data = await getHeroData();
            setHero(data);  // Сохраняем данные в состояние
            console.log(data)
            console.log('dataLog')
        };

        loadHeroData();
    }, []); // Пустой массив зависимостей означает, что эффект выполнится только один раз при монтировании компонента

    if (!hero) return <p>Loading...</p>;

    return (
        <div className="top-bar">
            <div className="coin">
                <img src="/images/dogs_ico.png" alt="Platinum" className="coin-img" />
                <span>{hero.dogs_balance}</span>
            </div>
            {/* /!*Закомментированные секции можно будет добавить позже, если нужно *!/*/}
            {/*<div className="coin">*/}
            {/*    <img src="/images/stars.png" alt="Stars" className="coin-img" />*/}
            {/*    <span>{stars}</span>*/}
            {/*</div>*/}
            {/*<div className="coin">*/}
            {/*    <img src="/images/gold.png" alt="Gold" className="coin-img" />*/}
            {/*    <span>{gold}</span>*/}
            {/*</div>*/}
        </div>
    );
};

export default TopBar;
