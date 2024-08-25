import React, { useState, useEffect } from 'react';
import './Roulette.css';

const Roulette = ({ rewardData, onSpinRequest }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [targetAngle, setTargetAngle] = useState(0);
    const [sections, setSections] = useState([]);
    const [rouletteInstance, setRouletteInstance] = useState(null);

    // Загружаем секции для рулетки с сервера при монтировании компонента
    useEffect(() => {
        const fetchRouletteSections = async () => {
            try {
                const response = await fetch('/api/roulette_rewards/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setSections(data.roulette_sections);
                } else {
                    console.error('Failed to fetch roulette sections');
                }
            } catch (error) {
                console.error('Error fetching roulette sections:', error);
            }
        };

        fetchRouletteSections();
    }, []);

    useEffect(() => {
        // Создаем экземпляр рулетки после того, как секции загружены
        if (sections.length > 0) {
            const rouletteConfig = sections.map(section => ({
                name: section.name,
                color: section.color,
                image: section.image,
                weight: 1 // Для теста можно установить равные веса
            }));

            const roulette = new Roulette(rouletteConfig);
            setRouletteInstance(roulette);
        }
    }, [sections]);

    // Определяем угол вращения, когда получаем данные о награде
    useEffect(() => {
        if (rewardData && sections.length > 0 && rouletteInstance) {
            const prizeIndex = sections.findIndex(section => section.name === rewardData.prize);
            if (prizeIndex >= 0) {
                const calculatedTargetAngle = 360 - (prizeIndex * (360 / sections.length));
                setTargetAngle(calculatedTargetAngle + 360 * 3); // Добавляем несколько полных оборотов
                rouletteInstance.spinTo(rewardData.prize);
            }
        }
    }, [rewardData, sections, rouletteInstance]);

    const spinRoulette = () => {
        if (isSpinning || sections.length === 0) return;

        setIsSpinning(true);
        onSpinRequest()
            .then(() => {
                setTimeout(() => {
                    setIsSpinning(false);
                }, 4000);  // Длительность вращения
            })
            .catch(() => {
                setIsSpinning(false);
                console.error('Error during roulette spin');
            });
    };

    return (
        <div id="roulette-container">
            <div id="roulette-wheel">
                {sections.map((section, index) => (
                    <div
                        key={index}
                        className="roulette-section"
                        style={{
                            transform: `rotate(${index * (360 / sections.length)}deg) translate(-50%, -50%)`,
                            backgroundColor: section.color
                        }}
                    >
                        <img src={section.image} alt={section.name} />
                    </div>
                ))}
            </div>
            <div id="roulette-spinBtn" onClick={spinRoulette}>
                <div id="spin-text">SPIN</div>
                <div id="spin-holster">
                    <span id="roulette-spinner"></span>
                </div>
            </div>
        </div>
    );
};

export default Roulette;

// Далее должен быть ваш CSS код (Roulette.css)
