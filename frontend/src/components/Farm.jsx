import React, { useState, useEffect } from 'react';
import './Farm.css';
import './Modal.css';
import Modal from './Modal';

const Farm = ({ goBack }) => {
    const tg = window.Telegram.WebApp;
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [plots, setPlots] = useState([]);
    const [seeds, setSeeds] = useState({
        common: [],
        rare: [],
        epic: [],
        legendary: []
    });
    const [activeTab, setActiveTab] = useState('common');

    useEffect(() => {
        const apiUrl = '/farm';

        // Fetch farm state
        fetch(`${apiUrl}/farm/state/`, {
            headers: {
                'Authorization': `Bearer ${tg.initDataUnsafe.query_id}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setPlots(data);
                } else {
                    console.error('Invalid data format:', data);
                }
            })
            .catch(error => console.error('Error fetching farm state:', error));

        // Fetch seeds
        fetch(`${apiUrl}/seeds`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tg.initDataUnsafe.query_id}`
            },
            body: JSON.stringify({ userId: tg.initDataUnsafe.user.id })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
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
    }, [tg.initDataUnsafe.query_id]);

    const handlePlotClick = (index) => {
        setSelectedPlot(index);
        setModalVisible(true);
    };

    const handleModalItemClick = (item) => {
        if (!item || typeof item.id === 'undefined') {
            console.error('Invalid seed item:', item);
            return;
        }

        const newPlots = [...plots];
        if (!newPlots[selectedPlot]) {
            console.error('Invalid plot selected:', selectedPlot);
            return;
        }
        newPlots[selectedPlot].plant_name = item.name;
        newPlots[selectedPlot].texture_url = `/images/seeds/${item.id}.webp`;
        setPlots(newPlots);

        setModalVisible(false);

        // Save updated plot data to the backend
        const apiUrl = '/farm';

        fetch(`${apiUrl}/farm/plant/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tg.initDataUnsafe.query_id}`
            },
            body: JSON.stringify({
                plot_id: newPlots[selectedPlot].plot_id,
                seed_id: item.id
            })
        }).catch(error => console.error('Error saving plot data:', error));
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    if (plots.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div
            className="screen active farmS"
            style={{
                background: "url('/images/A_fantasy_medieval_garden_with_various_mystical_he.png') no-repeat center center fixed",
                backgroundSize: 'cover',
            }}
        >
            <h1>Farm</h1>
            <div className="garden">
                {plots.map((plot, index) => (
                    <div className="plot" key={index} onClick={() => handlePlotClick(index)}>
                        {plot.plant_name && <span className="plot-item">{plot.plant_name}</span>}
                        {plot.texture_url && (
                            <img
                                src={plot.texture_url}
                                alt="Seed Texture"
                                className="seed-texture"
                            />
                        )}
                    </div>
                ))}
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
