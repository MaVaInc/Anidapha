import React, { useState, useEffect } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import MainButtonContainer from './components/MainButtonContainer';
import Modal from './components/Modal';
import Market from './components/Market';
import Farm from './components/Farm';
import Ruins from './components/Ruins';

const App = () => {
    const tg = window.Telegram.WebApp;
    const [platinum, setPlatinum] = useState(0);
    const [stars, setStars] = useState(0);
    const [gold, setGold] = useState(0);
    const [activeScreen, setActiveScreen] = useState('');
    const [showExtra, setShowExtra] = useState(false);
    const [isMainButtonChecked, setMainButtonChecked] = useState(false);

    useEffect(() => {
        tg.ready(function() {
            tg.expand();
        });

        // const isDebug = !tg.initData || tg.initData === '';
        const isDebug = !tg.initData || tg.initData === '';

        const apiUrl = isDebug ? 'http://localhost:5000/api' : '/api';

        if (isDebug || (tg.initDataUnsafe && tg.initDataUnsafe.user)) {
            const userId = isDebug ? 'debug-user' : tg.initDataUnsafe.user.id;

            fetch(`${apiUrl}/seeds`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            })
                .then(response => response.json())
                .then(data => {
                    setPlatinum(data.platinum);
                    setStars(data.stars);
                    setGold(data.gold);
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    }, []);

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
        </div>
    );
};

export default App;
