import React, { useState } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import MainButtonContainer from './components/MainButtonContainer';
import Market from './components/Market';
import Farm from './components/Farm';
import Ruins from './components/Ruins';
import Login from './components/Login';
import Wiki from './components/Wiki';
import Inventory from './components/Inventory';
import SettingsDrawer from './components/SettingsDrawer';
import { Provider } from 'react-redux';
import store from './store/store';
import { useSwipeable } from 'react-swipeable';
// import { SwipeBehavior } from '@telegram-apps/sdk';
// import { TonConnectUIProvider } from '@tonconnect/ui-react';
import WalletConnect from "./components/SettingsDrawer";
// import { initSwipeBehavior } from '@telegram-apps/sdk';

// const [swipeBehavior] = initSwipeBehavior();
// swipeBehavior.disableVerticalSwipe();


const App = () => {
    const [activeScreen, setActiveScreen] = useState('');
    const [showExtra, setShowExtra] = useState(false);
    const [isMainButtonChecked, setMainButtonChecked] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInventoryOpen, setInventoryOpen] = useState(false);
    const [isSettingsOpen, setSettingsOpen] = useState(false);

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

    const toggleInventoryDrawer = (open) => {
        if (open && isSettingsOpen) {
            setSettingsOpen(false); // Закрываем настройки, если они открыты
        }
        setInventoryOpen(open);
    };

    const toggleSettingsDrawer = (open) => {
        if (open && isInventoryOpen) {
            setInventoryOpen(false); // Закрываем инвентарь, если он открыт
        }
        setSettingsOpen(open);
    };

    const swipeHandlers = useSwipeable({
        onSwipedUp: () => {
            if (isSettingsOpen) {
                toggleSettingsDrawer(false); // Закрываем настройки, если они открыты
            } else {
                toggleInventoryDrawer(true); // Открываем инвентарь, если настройки не открыты
            }
        },
        onSwipedDown: () => {
            if (isInventoryOpen) {
                toggleInventoryDrawer(false); // Закрываем инвентарь, если он открыт
            } else {
                toggleSettingsDrawer(true); // Открываем настройки, если инвентарь не открыт
            }
        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    return (
          // <TonConnectUIProvider manifestUrl="https://t-mini-app.com/tonconnect-manifest.json">
<Provider store={store}>
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
                    <Inventory isOpen={isInventoryOpen} toggleDrawer={toggleInventoryDrawer} />
                </>
            ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
            )}
        </div>
        </Provider>
    );

};

export default App;
