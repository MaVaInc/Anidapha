import React, {useEffect, useState} from 'react';
import './Ruins.css';
import RewardCard from './RewardCard';

const Ruins = ({goBack}) => {
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
// useEffect(() => {
//     const fragments = document.querySelectorAll('.flying-texture');
//
//     fragments.forEach(fragment => {
//         const randomX = `${Math.random() * 100 - 50}vw`;  // Случайное смещение по X (-50vw до 50vw)
//         const randomY = `${Math.random() * 100 - 50}vh`;  // Случайное смещение по Y (-50vh до 50vh)
//         const randomScale = 0.5 + Math.random() * 1.5;    // Случайное изменение размера от 0.5 до 2
//
//         fragment.style.setProperty('--random-x', randomX);
//         fragment.style.setProperty('--random-y', randomY);
//         fragment.style.setProperty('--random-scale', randomScale);
//     });
// }, []);
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

    setTimeout(() => {
        const screen = document.querySelector('.screen.ruins');
        const textures = [
            'images/amulet.PNG',
            'images/armor.PNG',
            'images/axe.PNG',
            'images/boots.PNG',
            'images/gloves.PNG',
            'images/mace.PNG',
            'images/pants.PNG',
            'images/ring.PNG',
            'images/shield.PNG',
            'images/sword.PNG',
        ];

        for (let i = 0; i < 200; i++) {
            const fragment = document.createElement('img');
            fragment.className = 'flying-texture';
            fragment.src = textures[Math.floor(Math.random() * textures.length)];

            const startX = Math.random() * 100;  // Случайное начальное положение по X
            const startY = -10;  // Начальное положение по Y, за пределами экрана сверху
            const endY = 100 + Math.random() * 20;  // Конечное положение по Y, немного ниже экрана
            const randomScaleStart = 0.5 + 2*Math.random();  // Случайный начальный размер
            const randomScaleEnd = 0.5 + 2* Math.random();  // Случайный конечный размер
            const rotateAngle = Math.random() * 360;  // Случайный угол вращения
            const fallDuration = 2 + Math.random() * 1.5;  // Случайная продолжительность падения

            fragment.style.setProperty('--start-x', `${startX}vw`);
            fragment.style.setProperty('--start-y', `${startY}vh`);
            fragment.style.setProperty('--end-y', `${endY}vh`);
            fragment.style.setProperty('--random-scale-start', randomScaleStart);
            fragment.style.setProperty('--random-scale-end', randomScaleEnd);
            fragment.style.setProperty('--rotate-angle', `${rotateAngle}deg`);
            fragment.style.setProperty('--fall-duration', `${fallDuration}s`);

            fragment.style.animationDelay = `${Math.random() * 1.5}s`;  // Случайная задержка перед началом падения

            screen.appendChild(fragment);

            setTimeout(() => {
                fragment.remove();
            }, fallDuration * 2000);  // Удаляем текстуру через продолжительность анимации
        }
    }, 100);



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
                        return response.json().then(err => {
                            throw new Error(err.message || 'Failed to fetch reward');
                        });
                    }
                })
                .then(data => {
                    setTimeout(() => {
                        setRewardData(data);
                        setShowReward(true);
                        setIsSplit(false);
                    }, 2000);
                })
                .catch(error => console.error('Error fetching reward:', error));
        }, 500);
    };

    const handleCloseReward = () => {
        setIsButtonVisible(true);
        setShowReward(false);
        setRewardData(null);
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
                <RewardCard data={rewardData} onClose={handleCloseReward}/>
            )}

            <button id="back-buttonr" className="back-buttonr" onClick={handleBackClick}>
                Back
            </button>
        </div>
    );
};

export default Ruins;
