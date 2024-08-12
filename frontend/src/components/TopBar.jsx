import React from 'react';
import './TopBar.css';

const TopBar = ({ platinum, stars, gold }) => {
    return (
        <div className="top-bar">
            <div className="coin">
                <img src="/images/platinum.png" alt="Platinum" className="coin-img" />
                <span>{platinum}</span>
            </div>
            <div className="coin">
                <img src="/images/stars.png" alt="Stars" className="coin-img" />
                <span>{stars}</span>
            </div>
            <div className="coin">
                <img src="/images/gold.png" alt="Gold" className="coin-img" />
                <span>{gold}</span>
            </div>
        </div>
    );
};

export default TopBar;
