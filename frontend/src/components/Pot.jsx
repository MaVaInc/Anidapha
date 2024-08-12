import React, { useState } from 'react';
import Modal from './Modal';

const Pot = ({ pot, seeds = [], onPlant }) => {
  const [showModal, setShowModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handlePlant = (seed) => {
    onPlant(pot.id, seed);
    handleClose();
  };

  const handleLongPress = () => {
    setShowInfo(true);
  };

  const handleMouseUp = () => {
    if (showInfo) {
      setShowInfo(false);
    }
  };

  return (
    <div
      className="pot"
      onClick={handleClick}
      onMouseDown={handleLongPress}
      onMouseUp={handleMouseUp}
    >
      {pot.isEmpty ? (
        <span>Пусто</span>
      ) : (
        <>
          <img src={pot.plantTexture} alt={pot.plantName} />
          <small>{`До сбора: ${pot.timeToHarvest}`}</small>
        </>
      )}
      {showModal && (
        <Modal
          seeds={seeds}
          onClose={handleClose}
          onSelect={handlePlant}
        />
      )}
      {showInfo && <div className="plant-info">{pot.plantName} - {pot.timeToHarvest}</div>}
    </div>
  );
};

export default Pot;
