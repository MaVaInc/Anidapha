import TopBar from "./TopBar";
import MainButtonContainer from "./MainButtonContainer";
import Ruins from "./Ruins";
import Market from "./Market";
import Farm from "./Farm";
import Wiki from "./Wiki";
import Login from "./Login";
import React from "react";
import App from "../App";
return(
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

export default Main;
