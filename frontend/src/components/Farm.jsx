// Farm.jsx
import React, { useState, useEffect } from 'react';
import './Farm.css';
import './Modal.css';
import Modal from './Modal';

const Farm = ({ goBack }) => {
    const tg = window.Telegram.WebApp;
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedPot, setSelectedPot] = useState(null);
    const [potItems, setPotItems] = useState(Array(15).fill(''));
    const [seedTextures, setSeedTextures] = useState({});
    const [seeds, setSeeds] = useState({
        common: [],
        rare: [],
        epic: [],
        legendary: []
    });
    const [activeTab, setActiveTab] = useState('common');

    useEffect(() => {
        const isDebug = !tg.initData || tg.initData === '';
        const apiUrl = isDebug ? 'http://localhost:5000/api' : '/api';
        const userId = isDebug ? 'debug-user' : tg.initDataUnsafe.user.id;

        fetch(`${apiUrl}/seeds`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        })
            .then(response => response.json())
            .then(data => {
                setSeeds({
                    common: data.commonSeeds,
                    rare: data.rareSeeds,
                    epic: data.epicSeeds,
                    legendary: data.legendarySeeds
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handlePotClick = (index) => {
        setSelectedPot(index);
        setModalVisible(true);
    };

    const handleModalItemClick = (item) => {
        const newPotItems = [...potItems];
        newPotItems[selectedPot] = item.name;
        setPotItems(newPotItems);

        const newSeedTextures = { ...seedTextures };
        newSeedTextures[selectedPot] = item.id;
        setSeedTextures(newSeedTextures);

        setModalVisible(false);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <div
            className="screen active farmS"
            style={{
                background: "url('/images/A_fantasy_medieval_garden_with_various_mystical_he.png') no-repeat center center fixed",
                backgroundSize: 'cover',
            }}
        >
            <h1>Farm</h1>
            <div className="garden">
                {potItems.map((item, index) => (
                    <div className="pot" key={index} onClick={() => handlePotClick(index)}>
                        {item && <span className="pot-item">{item}</span>}
                        {seedTextures[index] && (
                            <img
                                src={`/images/seeds/${seedTextures[index]}.webp`}
                                alt="Seed Texture"
                                className="seed-texture"
                            />
                        )}
                    </div>
                ))}
            </div>
            <Modal
                isModalVisible={isModalVisible}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                seeds={seeds}
                handleModalItemClick={handleModalItemClick}
                closeModal={closeModal}
            />
            {/*<button id="back-button" className="back-button" onClick={goBack}>*/}
            {/*    Back*/}
            {/*</button>*/}
        </div>
    );
};

export default Farm;
