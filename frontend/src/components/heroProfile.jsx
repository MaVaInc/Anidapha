// src/components/HeroProfile.js
import React from 'react';
import { useHero } from '../context/HeroContext';

const HeroProfile = () => {
    const { hero } = useHero();

    if (!hero) return <p>Loading...</p>;

    return (
        <div>
            <h1>Hero Profile</h1>
            <p>Nickname: {hero.username}</p>
            <p>Dogs Balance: {hero.dogsBalance}</p>

        </div>
    );
};

export default HeroProfile;
