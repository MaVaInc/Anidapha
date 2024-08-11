import React, { useState } from 'react';
import './Modal.css';

const Modal = ({ isModalVisible, activeTab, setActiveTab, seeds, handleModalItemClick, closeModal }) => {
    const [hoveredSeed, setHoveredSeed] = useState(null);
    const [isHovering, setIsHovering] = useState(false);

    if (!isModalVisible) return null;

    const handleMouseOver = (seed) => {
        setHoveredSeed(seed);
        setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="tab-navigation">
                    {Object.keys(seeds).map(tab => (
                        <button key={tab} className={tab === activeTab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="seed-list">
                                        {seeds[activeTab].map((seed) => (
                        <div
                            key={seed.id}
                            className="seed-item"
                            onMouseOver={() => handleMouseOver(seed)}
                            onMouseOut={handleMouseOut}
                            onClick={() => handleModalItemClick(seed)}
                        >
                            <img src={`/images/seeds/${seed.id}.webp`} alt={seed.name} />
                            <span>{seed.name}</span>
                        </div>
                    ))}
                </div>
                {isHovering && hoveredSeed && (
                    <div className="seed-info">
                        <h3>{hoveredSeed.name}</h3>
                        <p>Раритет: {hoveredSeed.rarity}</p>
                        <p>Время роста: {hoveredSeed.grow_time}</p>
                        <p>Применение: {hoveredSeed.applied_to.join(', ')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;

