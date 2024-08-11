import React from 'react';
import './Modal.css';
const Modal = ({ isModalVisible, activeTab, setActiveTab, seeds, handleModalItemClick, closeModal }) => {
    const handleOutsideClick = (event) => {
        if (event.target.className === 'modal active') {
            closeModal();
        }
    };

    return (
        <div id="modal" className={`modal ${isModalVisible ? 'active' : ''}`} onClick={handleOutsideClick}>
            <div className="modal-content">
                <span className="close" onClick={closeModal}>
                    &times;
                </span>
                <div className="tabs">
                    <button className={activeTab === 'common' ? 'active' : ''} onClick={() => setActiveTab('common')}>Common</button>
                    <button className={activeTab === 'rare' ? 'active' : ''} onClick={() => setActiveTab('rare')}>Rare</button>
                    <button className={activeTab === 'epic' ? 'active' : ''} onClick={() => setActiveTab('epic')}>Epic</button>
                    <button className={activeTab === 'legendary' ? 'active' : ''} onClick={() => setActiveTab('legendary')}>Legendary</button>
                </div>
                <div className="button-container">
                    {seeds[activeTab].map((seed, index) => (
                        <div className="modal-button" key={index} onClick={() => handleModalItemClick(seed)}>
                            <img src={`/images/seeds/${seed.id}.webp`} alt={seed.name} className="seed-image" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Modal;
