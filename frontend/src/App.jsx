import React, { useEffect, useState } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import MainButtonContainer from './components/MainButtonContainer';
import Market from './components/Market';
import Farm from './components/Farm';
import Ruins from './components/Ruins';
import Login from './components/Login';
import Wiki from './components/Wiki';

const App = () => {
    const [activeScreen, setActiveScreen] = useState('');
    const [showExtra, setShowExtra] = useState(false);
    const [isMainButtonChecked, setMainButtonChecked] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);



    const toggleButtons = (event) => {
        setMainButtonChecked(event.target.checked);
        setShowExtra(!showExtra);
        if (!showExtra) {
            // setGold(gold + 3);
            // setStars(stars + 1);
            // setPlatinum(platinum + 2);
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
            {isAuthenticated ? (
                <>
                    <TopBar />
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
                                <Wiki />
                            )}
                            <button id="back-button" className="back-button" onClick={goBack}>
                                Back
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
            )}
        </div>
    );
};

export default App;
