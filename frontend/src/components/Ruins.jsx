import React, { useEffect, useState } from 'react';
import './Ruins.css';
import RewardCard from './RewardCard';

const Ruins = ({ goBack }) => {
    const [isClosing, setClosing] = useState(false);
    const [rewardData, setRewardData] = useState(null);
    const [showReward, setShowReward] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [isSplit, setIsSplit] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(true);

    useEffect(() => {
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

        Promise.all(promises).then(() => {
            setImagesLoaded(true);
        });
    }, []);

    useEffect(() => {
        const ruinsElement = document.querySelector('.screen.ruins');
        if (ruinsElement && imagesLoaded) {
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

        return () => clearTimeout(timeoutId);
    };

    const handleButtonClick = () => {
        if (!imagesLoaded) return;

        setIsSplit(true);
        // setIsButtonVisible(false); // Скрываем кнопку после разрыва

        setTimeout(() => {
            const screen = document.querySelector('.screen.ruins');
            for (let i = 0; i < 50; i++) {
                const fragment = document.createElement('div');
                fragment.className = 'fragment';
                fragment.style.left = `${Math.random() * 100}vw`;
                fragment.style.top = `${Math.random() * 50}vh`;
                fragment.style.animationDelay = `${Math.random()}s`;
                screen.appendChild(fragment);
            }
        }, 500);

        setTimeout(() => {
            fetch('/api/reward/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
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
 // Показываем награду

                setTimeout(() => {
                                    setRewardData(data);
                setShowReward(true);
                    setIsSplit(false); // Сбрасываем состояние разрыва
                     // Делаем кнопку снова видимой
                }, 2000); // Задержка перед повторным появлением кнопки
            })
            .catch(error => console.error('Error fetching reward:', error));
        }, 500);
    };

    const handleCloseReward = () => {
        setIsButtonVisible(true);
        setShowReward(false);
        setRewardData(null); // Сбрасываем данные награды после закрытия

    };

    return (
        <div className={`screen active ruins ${isClosing ? 'closing' : ''}`}>
            <div className="door-button left-button"></div>
            <div className="door-button right-button"></div>

            {isButtonVisible && (
                <div className={`large-button ${isSplit ? 'split' : ''}`} onClick={handleButtonClick}>
                    <div className="top-half">100</div>
                    <div className="bottom-half">DOGS</div>
                </div>
            )}

            {showReward && rewardData && (
                <RewardCard data={rewardData} onClose={handleCloseReward} />
            )}

            <button id="back-buttonr" className="back-buttonr" onClick={handleBackClick}>
                Back
            </button>
        </div>
    );
};

export default Ruins;
