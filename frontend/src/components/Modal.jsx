import React from 'react';

const Modal = ({ isModalVisible, activeTab, setActiveTab, seeds, handleModalItemClick, closeModal }) => {
  if (!isModalVisible) return null;

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-tabs">
          {['common', 'rare', 'epic', 'legendary'].map((tab) => (
            <button
              key={tab}
              className={`modal-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="modal-items">
          {seeds[activeTab].map((seed) => (
            <div key={seed.id} className="modal-item" onClick={() => handleModalItemClick(seed)}>
              <img src={`/images/seeds/${seed.id}.webp`} alt={seed.name} />
              <span>{seed.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
