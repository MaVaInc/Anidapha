import React, { useEffect, useState } from 'react';
import './Ruins.css';

const Ruins = ({ goBack }) => {
    const [isClosing, setClosing] = useState(false);

    useEffect(() => {
        const ruinsElement = document.querySelector('.screen.ruins');
        if (ruinsElement) {
            if (isClosing) {
                ruinsElement.classList.add('closing');
            } else {
                ruinsElement.classList.remove('closing');
            }
        }
    }, [isClosing]);

    const handleBackClick = () => {
        setClosing(true);
        setTimeout(() => {
            goBack();
            setClosing(false);
        }, 1000);
    };

    const handleRewardClick = () => {
        const tg = window.Telegram.WebApp;
        const apiUrl = !tg.initData || tg.initData === '' ? 'http://localhost:8000/api' : '/api';

        // Вызов тактильной связи
        if (tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('medium');
        }

        fetch(`${apiUrl}/reward`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: tg.initDataUnsafe.user.id })
        })
            .then(response => response.json())
            .then(data => alert(`You received: ${JSON.stringify(data)}`))
            .catch(error => console.error('Error fetching reward:', error));
    };

    return (
        <div className={`screen active ruins ${isClosing ? 'closing' : ''}`}>
            <div className="door-button left-button"></div>
            <div className="door-button right-button"></div>
            <button className="large-button" onClick={handleRewardClick}>
                BOOM
            </button>
            <button id="back-buttonr" className="back-buttonr" onClick={handleBackClick}>
                Back
            </button>
        </div>
    );
};

export default Ruins;
