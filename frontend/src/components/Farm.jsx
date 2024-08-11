import React, { useState, useEffect } from 'react';
import './Farm.css';
import './Modal.css';
import Modal from './Modal';
import CountdownTimer from './CountdownTimer';

const Farm = ({ goBack }) => {
    const tg = window.Telegram.WebApp;
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedPot, setSelectedPot] = useState(null);
    const [potItems, setPotItems] = useState([]);
    const [seedTextures, setSeedTextures] = useState({});
    const apiUrl = 'http://localhost:8000/api';
    const [seeds, setSeeds] = useState({
        common: [],
        rare: [],
        epic: [],
        legendary: []
    });
    const [activeTab, setActiveTab] = useState('common');

    useEffect(() => {
        const isDebug = !tg.initData || tg.initData === '';
        const apiUrl = isDebug ? 'http://localhost:8000/api' : '/api';
        const userId = isDebug ? 'debug-user' : tg.initDataUnsafe.user.id;

        // Чтение токена из локального хранилища
        const token = localStorage.getItem('access_token') || tg.initDataUnsafe.user.token;

        fetch(`${apiUrl}/get-farm-state`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Используем токен для авторизации
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                setPotItems(data);
            })
            .catch(error => console.error('Error fetching data:', error));

        fetch(`${apiUrl}/seeds`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Используем токен для авторизации
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
    }, [tg.initData]);

    const handlePotClick = (index) => {
        setSelectedPot(index);
        setModalVisible(true);
    };

    const handleModalItemClick = (item) => {
        const newPotItems = [...potItems];
        newPotItems[selectedPot].plant_name = item.name;
        newPotItems[selectedPot].texture_url = `/images/seeds/${item.id}.webp`;
        setPotItems(newPotItems);

        // Чтение токена из локального хранилища
        const token = localStorage.getItem('access_token') || tg.initDataUnsafe.user.token;

        fetch(`${apiUrl}/plant-seed`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Используем токен для авторизации
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ plot_id: selectedPot, seed_id: item.id })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Обновляем состояние с новой информацией о растении
                    setPotItems(prevItems =>
                        prevItems.map((pot, idx) =>
                            idx === selectedPot ? data.plot : pot
                        )
                    );
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error planting seed:', error));

        setModalVisible(false);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <div className="screen active farmS" style={{ background: "url('/images/A_fantasy_medieval_garden_with_various_mystical_he.png') no-repeat center center fixed", backgroundSize: 'cover', }}>
            <h1>Farm</h1>
            <div className="garden">
                {potItems.map((item, index) => (
                    <div className="pot" key={index} onClick={() => handlePotClick(index)}>
                        {item.plant_name && (
                            <>
                                <span className="pot-item">{item.plant_name}</span>
                                <img src={item.texture_url} alt="Seed Texture" className="seed-texture" />
                                <div className="timer">
                                    {/* Таймер роста */}
                                    {item.planted_at && (
                                        <CountdownTimer plantedAt={item.planted_at} growTime={item.grow_time} />
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <Modal isModalVisible={isModalVisible} activeTab={activeTab} setActiveTab={setActiveTab} seeds={seeds} handleModalItemClick={handleModalItemClick} closeModal={closeModal} />
        </div>
    );
};

export default Farm;
