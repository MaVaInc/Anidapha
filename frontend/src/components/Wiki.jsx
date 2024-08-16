import React from 'react';
import './Wiki.css';

const Wiki = () => {
    const goToAdmin = () => {
        window.location.href = '/admin/';
    };

    return (
        <div className="screen active">
            <h1>Wiki</h1>
            <p>Пока не понятно зачем создана эта страница)</p>
            <button onClick={goToAdmin} className="button">Перейти в админ панель</button>
        </div>
    );
};

export default Wiki;
