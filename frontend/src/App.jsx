import React, { useState } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import MainButtonContainer from './components/MainButtonContainer';
import Market from './components/Market';
import Farm from './components/Farm';
import Ruins from './components/Ruins';
import Login from './components/Login';
import Wiki from './components/Wiki';
import Inventory from './components/Inventory'; // Импортируем инвентарь
import { useSwipeable } from 'react-swipeable';
import { initSwipeBehavior } from '@telegram-apps/sdk';

const [swipeBehavior] = initSwipeBehavior();
swipeBehavior.disableVerticalSwipe();

const App = () => {
    const [activeScreen, setActiveScreen] = useState('');
    const [showExtra, setShowExtra] = useState(false);
    const [isMainButtonChecked, setMainButtonChecked] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInventoryOpen, setInventoryOpen] = useState(false); // Добавляем состояние для инвентаря

    const toggleButtons = (event) => {
        setMainButtonChecked(event.target.checked);
        setShowExtra(!showExtra);
    };

    const showScreen = (screenId) => {
        setActiveScreen(screenId);
    };

    const goBack = () => {
        setActiveScreen('');
        setMainButtonChecked(true);
    };

    const toggleDrawer = (open) => {
        setInventoryOpen(open);
    };

    const swipeHandlers = useSwipeable({
        onSwipedUp: () => toggleDrawer(true),
        onSwipedDown: () => toggleDrawer(false),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    return (
        <div className="App" {...swipeHandlers}>
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
                    <Inventory isOpen={isInventoryOpen} toggleDrawer={toggleDrawer} />
                </>
            ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
            )}
        </div>
    );
};

export default App;
