import React, { useState, useEffect } from 'react';
import './MainButtonContainer.css';

const MainButtonContainer = ({ isMainButtonChecked, toggleButtons, showExtra, showScreen }) => {
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        // Собираем все изображения, которые необходимо загрузить
        const images = document.querySelectorAll('.menu-button');
        const promises = Array.from(images).map(image => {
            return new Promise((resolve) => {
                const bgImage = window.getComputedStyle(image).backgroundImage;
                const url = bgImage.match(/url\("(.*?)"\)/)[1];
                const img = new Image();
                img.src = url;
                img.onload = resolve;
                img.onerror = resolve;
            });
        });

        // Ждем загрузки всех изображений
        Promise.all(promises).then(() => {
            setImagesLoaded(true); // Отмечаем, что изображения загружены
        });
    }, []);

    return (

        <div className={`main-button-container ${!imagesLoaded ? 'loading' : ''}`}>
            <div className="preload"></div>

            <input
                type="checkbox"
                className="main-button"
                checked={isMainButtonChecked}
                onChange={toggleButtons}
                disabled={!imagesLoaded} // Отключаем кнопку до загрузки
            />
            <div
                className={`menu-button market ${showExtra && imagesLoaded ? 'active' : ''}`}
                data-text="Market"
                onClick={() => imagesLoaded && showScreen('marketS')}
            ></div>
            <div
                className={`menu-button farm ${showExtra && imagesLoaded ? 'active' : ''}`}
                data-text="Farm"
                onClick={() => imagesLoaded && showScreen('farmS')}
            ></div>
            <div
                className={`menu-button wiki ${showExtra && imagesLoaded ? 'active' : ''}`}
                data-text="Wiki"
                onClick={() => imagesLoaded && showScreen('whitepaperS')}
            ></div>
            <div
                className={`menu-button ruins ${showExtra && imagesLoaded ? 'active' : ''}`}
                data-text="Ruins"
                onClick={() => imagesLoaded && showScreen('ruins')}
            ></div>
        </div>
    );
};

export default MainButtonContainer;
