import React, { useState, useEffect } from 'react';
import './Farm.css';
import Modal from './Modal';

const Farm = ({ goBack }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedPlot, setSelectedPlot] = useState(null);
    const authToken = localStorage.getItem('token');
    const [plots, setPlots] = useState([]);
    const [seeds, setSeeds] = useState({
        common: [],
        rare: [],
        epic: [],
        legendary: []
    });
    const [activeTab, setActiveTab] = useState('common');

    useEffect(() => {
        const apiUrl = 'api/farm';

        fetch(`${apiUrl}/state/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch farm state'))
        .then(data => Array.isArray(data) ? setPlots(data) : console.error('Invalid data format:', data))
        .catch(error => console.error('Error fetching farm state:', error));

        fetch(`${apiUrl}/seeds/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch seeds'))
        .then(data => {
            if (data && data.commonSeeds && data.rareSeeds && data.epicSeeds && data.legendarySeeds) {
                setSeeds({
                    common: data.commonSeeds,
                    rare: data.rareSeeds,
                    epic: data.epicSeeds,
                    legendary: data.legendarySeeds
                });
            } else {
                console.error('Invalid seed data format:', data);
            }
        })
        .catch(error => console.error('Error fetching seeds:', error));
    }, [authToken]);

function handlePlotClick(index) {
  const selectedPot = document.querySelectorAll('.pot')[index];
  selectedPot.classList.toggle('expand');
}


    const handleModalItemClick = (item) => {
        const newPlots = [...plots];
        if (newPlots[selectedPlot]) {
            newPlots[selectedPlot].plant_name = item.name;
            newPlots[selectedPlot].texture_url = `/images/seeds/${item.id}.webp`;
            setPlots(newPlots);
            setModalVisible(false);

            const apiUrl = 'api/farm';

            fetch(`${apiUrl}/plant/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    plot_id: newPlots[selectedPlot].plot_id,
                    seed_id: item.id
                })
            })
            .then(response => response.ok ? response.json() : Promise.reject('Failed to save plot data'))
            .catch(error => console.error('Error saving plot data:', error));
        } else {
            console.error('Invalid plot selected:', selectedPlot);
        }
    };

    const closeModal = () => setModalVisible(false);

    return (

        <div>
            <h1>Farm</h1>
            <div className="garden">
                {plots.length === 0 ? (
                    <div>Loading...</div>
                ) : (
                    plots.map((plot, index) => (
                        <div className="pot" key={index} onClick={() => handlePlotClick(index)}>
                            {plot.plant_name && <span className="pot-item">{plot.plant_name}</span>}
                            {plot.texture_url && (
                                <img
                                    src={plot.texture_url}
                                    alt="Seed Texture"
                                    className="seed-texture"
                                />
                            )}
                        </div>
                    ))
                )}
            </div>

            <Modal
                isModalVisible={isModalVisible}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                seeds={seeds}
                handleModalItemClick={handleModalItemClick}
                closeModal={closeModal}
            />
        </div>
    );
};

export default Farm;
