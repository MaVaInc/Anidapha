import React from 'react';

const ItemAttribute = ({ label, value, icon }) => {
    if (value === 0 || value === null || value === undefined) {
        return null;
    }

    return (
        <div className="item-info">
            <span>{label}:</span>
            <span className="item-value">
                {value}
                {icon && <img src={icon} alt={label} className="attribute-icon" />}
            </span>
        </div>
    );
};

export default ItemAttribute;
