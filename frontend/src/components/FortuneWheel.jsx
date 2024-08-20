import React, { useEffect, useState } from 'react';
import './FortuneWheel.css';

const FortuneWheel = () => {
    const [isSpinning, setIsSpinning] = useState(false);

    useEffect(() => {
        // Запускаем вращение при монтировании компонента
        setIsSpinning(true);

        // Останавливаем через 4 секунды
        const timer = setTimeout(() => {
            setIsSpinning(false);
        }, 4000);

        return () => clearTimeout(timer); // Очищаем таймер при размонтировании
    }, []);

    return (
        <div className={`wheel-container ${isSpinning ? 'spinning' : ''}`}>
            <div className="wheel">
                {/* */}
            </div>
            <div className="arrow"></div>
        </div>
    );
};

export default FortuneWheel;
