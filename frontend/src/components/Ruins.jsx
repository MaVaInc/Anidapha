import React, { useEffect, useState } from 'react';
import './Ruins.css';
import RewardCard from './RewardCard';
import FortuneWheel from './FortuneWheel';

const Ruins = ({ goBack }) => {
    const [isClosing, setClosing] = useState(false);
    const [rewardData, setRewardData] = useState(null);
    const [showWheel, setShowWheel] = useState(false);
    const [showReward, setShowReward] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        // Собираем все изображения, которые необходимо загрузить
        const images = document.querySelectorAll('img');
        const promises = Array.from(images).map(image => {
            return new Promise((resolve) => {
                if (image.complete) {
                    resolve();
                } else {
                    image.onload = resolve;
                    image.onerror = resolve;
                }
            });
        });

        // Ждем загрузки всех изображений
        Promise.all(promises).then(() => {
            setImagesLoaded(true); // Отмечаем, что изображения загружены
        });
    }, []);

    useEffect(() => {
        const ruinsElement = document.querySelector('.screen.ruins');
        if (ruinsElement && imagesLoaded) { // Запускаем анимации только после загрузки изображений
            if (isClosing) {
                ruinsElement.classList.add('closing');
            } else {
                ruinsElement.classList.remove('closing');
            }
        }
    }, [isClosing, imagesLoaded]);

    const handleBackClick = () => {
        setClosing(true);
        const timeoutId = setTimeout(() => {
            goBack();
            setClosing(false);
        }, 1000);

        return () => clearTimeout(timeoutId); // Очищаем таймаут при уходе с экрана
    };

    const handleRewardClick = (event) => {
        if (!imagesLoaded) return; // Не запускаем анимацию до загрузки изображений

        const button = event.currentTarget;

        // Добавляем класс falling для активации анимации
        button.classList.add('falling');

        const apiUrl = '/api';
        const authToken = localStorage.getItem('token');

        if (!authToken) {
            console.error('Authorization token not found in local storage');
            return;
        }

        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }



        // Задержка перед отправкой запроса
        setTimeout(() => {
            fetch(`${apiUrl}/reward/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return response.json().then(err => { throw new Error(err.message || 'Failed to fetch reward'); });
                }
            })
            .then(data => {
                setRewardData(data);
                // Останавливаем вращение колеса и показываем награду через 4 секунды
                setTimeout(() => {
                    setShowReward(true);
                    button.classList.remove('falling');
                }, 3000); // Задержка 4 секунды после завершения вращения
            })

            .catch(error => console.error('Error fetching reward:', error));
        }, 500); // Задержка 500ms

    };

    return (
        <div className={`screen active ruins ${isClosing ? 'closing' : ''}`}>
            <div className="door-button left-button"></div>
            <div className="door-button right-button"></div>
            <button className="large-button" onClick={handleRewardClick} disabled={!imagesLoaded}>
                BOOM
            </button>

            {showReward && rewardData && (
                <RewardCard data={rewardData} onClose={() => setRewardData(null)}/>
            )}

            <button id="back-buttonr" className="back-buttonr" onClick={handleBackClick}>
                Back
            </button>
        </div>
    );
};

export default Ruins;
