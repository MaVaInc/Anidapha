// src/context/HeroContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getHeroData, saveHeroData, getInventory, saveInventory, syncWithServer } from '../db/HeroDB';

const HeroContext = createContext();

export const useHero = () => useContext(HeroContext);

export const HeroProvider = ({ children }) => {
    const [hero, setHero] = useState(null);
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        const loadHeroData = async () => {
            const storedHero = await getHeroData();
            const storedInventory = await getInventory();
            setHero(storedHero);
            setInventory(storedInventory);
        };

        loadHeroData();
    }, []);

    const syncHeroData = async (fetchHeroDataFromServer, fetchInventoryFromServer) => {
        await syncWithServer(fetchHeroDataFromServer, fetchInventoryFromServer);
        const updatedHero = await getHeroData();
        const updatedInventory = await getInventory();
        setHero(updatedHero);
        setInventory(updatedInventory);
    };

    return (
        <HeroContext.Provider value={{ hero, inventory, syncHeroData }}>
            {children}
        </HeroContext.Provider>
    );
};
