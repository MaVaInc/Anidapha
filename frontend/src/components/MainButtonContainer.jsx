import React from 'react';
import './MainButtonContainer.css';

const MainButtonContainer = ({ isMainButtonChecked, toggleButtons, showExtra, showScreen }) => {
    return (
        <div className="main-button-container">
            <input
                type="checkbox"
                className="main-button"
                checked={isMainButtonChecked}
                onChange={toggleButtons}
            />
            <div
                className={`menu-button market ${showExtra ? 'active' : ''}`}
                data-text="Market"
                onClick={() => showScreen('marketS')}
            ></div>
            <div
                className={`menu-button farm ${showExtra ? 'active' : ''}`}
                data-text="Farm"
                onClick={() => showScreen('farmS')}
            ></div>
            <div
                className={`menu-button wiki ${showExtra ? 'active' : ''}`}
                data-text="Wiki"
                onClick={() => showScreen('whitepaperS')}
            ></div>
            <div
                className={`menu-button ruins ${showExtra ? 'active' : ''}`}
                data-text="Ruins"
                onClick={() => showScreen('ruins')}
            ></div>
        </div>
    );
};

export default MainButtonContainer;
