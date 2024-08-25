import React from 'react';
import { Button, ButtonGroup } from '@mui/material';
import './Inventory.css';
const InventoryFilters = ({ filter, subFilter, onFilterChange, onSubFilterChange }) => {
    return (
        <div className="inventory-filters">
            <ButtonGroup variant="outlined" color="primary">
                <Button onClick={() => onFilterChange('all')} variant={filter === 'all' ? 'contained' : 'outlined'} className="custom-button">All</Button>
                <Button onClick={() => onFilterChange('equipment')} variant={filter === 'equipment' ? 'contained' : 'outlined'}className="custom-button">Equipment</Button>
                <Button onClick={() => onFilterChange('materials')} variant={filter === 'materials' ? 'contained' : 'outlined'}className="custom-button">Materials</Button>
                <Button onClick={() => onFilterChange('plants')} variant={filter === 'plants' ? 'contained' : 'outlined'}className="custom-button">Plants</Button>
            </ButtonGroup>
            {filter === 'equipment' && (
                <ButtonGroup variant="outlined" color="secondary" className="subcategory-group">
                    <Button onClick={() => onSubFilterChange('all')} variant={subFilter === 'all' ? 'contained' : 'outlined'}className="custom-button">All Equipment</Button>
                    <Button onClick={() => onSubFilterChange('weapon')} variant={subFilter === 'weapon' ? 'contained' : 'outlined'}className="custom-button">Weapons</Button>
                    <Button onClick={() => onSubFilterChange('armor')} variant={subFilter === 'armor' ? 'contained' : 'outlined'}className="custom-button">Armor</Button>
                    <Button onClick={() => onSubFilterChange('helmet')} variant={subFilter === 'helmet' ? 'contained' : 'outlined'}className="custom-button">Helmets</Button>
                    <Button onClick={() => onSubFilterChange('shield')} variant={subFilter === 'shield' ? 'contained' : 'outlined'}className="custom-button">Shields</Button>
                    <Button onClick={() => onSubFilterChange('boots')} variant={subFilter === 'boots' ? 'contained' : 'outlined'}className="custom-button">Boots</Button>
                    <Button onClick={() => onSubFilterChange('gloves')} variant={subFilter === 'gloves' ? 'contained' : 'outlined'}className="custom-button">Gloves</Button>
                    <Button onClick={() => onSubFilterChange('ring')} variant={subFilter === 'ring' ? 'contained' : 'outlined'}className="custom-button">Rings</Button>
                    <Button onClick={() => onSubFilterChange('amulet')} variant={subFilter === 'amulet' ? 'contained' : 'outlined'}className="custom-button">Amulets</Button>
                    <Button onClick={() => onSubFilterChange('belt')} variant={subFilter === 'belt' ? 'contained' : 'outlined'}className="custom-button">Belts</Button>
                </ButtonGroup>
            )}
            {filter === 'plants' && (
                <ButtonGroup variant="outlined" color="secondary" className="subcategory-group">
                    <Button onClick={() => onSubFilterChange('all')} variant={subFilter === 'all' ? 'contained' : 'outlined'}className="custom-button">All Stages</Button>
                    <Button onClick={() => onSubFilterChange('seed')} variant={subFilter === 'seed' ? 'contained' : 'outlined'}className="custom-button">Seed</Button>
                    <Button onClick={() => onSubFilterChange('growing')} variant={subFilter === 'growing' ? 'contained' : 'outlined'}className="custom-button">Growing</Button>
                    <Button onClick={() => onSubFilterChange('harvest')} variant={subFilter === 'harvest' ? 'contained' : 'outlined'}className="custom-button">Harvest</Button>
                </ButtonGroup>
            )}
        </div>
    );
};

export default InventoryFilters;
