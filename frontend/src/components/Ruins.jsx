import React, { useEffect, useState } from 'react';
import './Ruins.css';
import RewardCard from './RewardCard';

const Ruins = ({ goBack }) => {
    const [isClosing, setClosing] = useState(false);
    const [rewardData, setRewardData] = useState(null);

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

    useEffect(() => {
        return () => {
            setRewardData(null); // Очищаем данные о награде при размонтировании
        };
    }, []);

    const handleBackClick = () => {
        setClosing(true);
        const timeoutId = setTimeout(() => {
            goBack();
            setClosing(false);
        }, 1000);

        return () => clearTimeout(timeoutId); // Очищаем таймаут при уходе с экрана
    };

    const handleRewardClick = () => {
        const apiUrl = '/api';
        const authToken = localStorage.getItem('token');

        if (!authToken) {
            console.error('Authorization token not found in local storage');
            return;
        }

        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }

        fetch(`${apiUrl}/reward/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}` // Используем JWT для аутентификации
            }
        })
            .then(response => {
                console.log('Response status:', response.status);
                if (response.status === 200) {
                    return response.json();
                } else {
                    return response.json().then(err => { throw new Error(err.message || 'Failed to fetch reward'); });
                }
            })
            .then(data => {
                console.log('Reward data:', data);
                setRewardData(data);
            })
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
            {rewardData && (
                <RewardCard data={rewardData} onClose={() => setRewardData(null)} />
            )}
        </div>
    );
};

export default Ruins;
