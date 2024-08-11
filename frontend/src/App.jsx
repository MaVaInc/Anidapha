import React, { useState } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import MainButtonContainer from './components/MainButtonContainer';
import Market from './components/Market';
import Farm from './components/Farm';
import Ruins from './components/Ruins';
import Login from './components/Login';  // Импортируем Login

const App = () => {
    const [platinum, setPlatinum] = useState(0);
    const [stars, setStars] = useState(0);
    const [gold, setGold] = useState(0);
    const [activeScreen, setActiveScreen] = useState('');
    const [showExtra, setShowExtra] = useState(false);
    const [isMainButtonChecked, setMainButtonChecked] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);  // Добавлено состояние аутентификации

    const toggleButtons = (event) => {
        setMainButtonChecked(event.target.checked);
        setShowExtra(!showExtra);
        if (!showExtra) {
            setGold(gold + 3);
            setStars(stars + 1);
            setPlatinum(platinum + 2);
        }
    };

    const showScreen = (screenId) => {
        setActiveScreen(screenId);
    };

    const goBack = () => {
        setActiveScreen('');
        setMainButtonChecked(true);
    };

    return (
        <div className="App">
            {isAuthenticated ? (  // Проверяем аутентификацию
                <>
                    <TopBar platinum={platinum} stars={stars} gold={gold} />
                    {activeScreen === '' ? (
                        <div className="container">
                            <MainButtonContainer
                                isMainButtonChecked={isMainButtonChecked}
                                toggleButtons={toggleButtons}
                                showExtra={showExtra}
                                showScreen={showScreen}
                            />
                        </div>
                    ) : (
                        <div>
                            {activeScreen === 'ruins' && (
                                <Ruins goBack={goBack} />
                            )}
                            {activeScreen === 'marketS' && (
                                <Market />
                            )}
                            {activeScreen === 'farmS' && (
                                <Farm />
                            )}
                            {activeScreen === 'whitepaperS' && (
                                <div className="screen active">
                                    <h1>Wiki</h1>
                                    <p>Content for wiki...</p>
                                </div>
                            )}
                            <button id="back-button" className="back-button" onClick={goBack}>
                                Back
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />  // Подключаем компонент Login
            )}
        </div>
    );
};

export default App;
