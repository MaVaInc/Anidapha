import React from 'react';
import { Button, ButtonGroup } from '@mui/material';

const InventoryFilters = ({ filter, subFilter, onFilterChange, onSubFilterChange }) => {
    return (
        <div className="inventory-filters">
            <ButtonGroup variant="outlined" color="primary">
                <Button onClick={() => onFilterChange('all')} variant={filter === 'all' ? 'contained' : 'outlined'}>All</Button>
                <Button onClick={() => onFilterChange('equipment')} variant={filter === 'equipment' ? 'contained' : 'outlined'}>Equipment</Button>
                <Button onClick={() => onFilterChange('materials')} variant={filter === 'materials' ? 'contained' : 'outlined'}>Materials</Button>
                <Button onClick={() => onFilterChange('plants')} variant={filter === 'plants' ? 'contained' : 'outlined'}>Plants</Button>
            </ButtonGroup>
            {filter === 'equipment' && (
                <ButtonGroup variant="outlined" color="secondary" className="subcategory-group">
                    <Button onClick={() => onSubFilterChange('all')} variant={subFilter === 'all' ? 'contained' : 'outlined'}>All Equipment</Button>
                    <Button onClick={() => onSubFilterChange('weapon')} variant={subFilter === 'weapon' ? 'contained' : 'outlined'}>Weapons</Button>
                    <Button onClick={() => onSubFilterChange('armor')} variant={subFilter === 'armor' ? 'contained' : 'outlined'}>Armor</Button>
                    <Button onClick={() => onSubFilterChange('helmet')} variant={subFilter === 'helmet' ? 'contained' : 'outlined'}>Helmets</Button>
                    <Button onClick={() => onSubFilterChange('shield')} variant={subFilter === 'shield' ? 'contained' : 'outlined'}>Shields</Button>
                    <Button onClick={() => onSubFilterChange('boots')} variant={subFilter === 'boots' ? 'contained' : 'outlined'}>Boots</Button>
                    <Button onClick={() => onSubFilterChange('gloves')} variant={subFilter === 'gloves' ? 'contained' : 'outlined'}>Gloves</Button>
                    <Button onClick={() => onSubFilterChange('ring')} variant={subFilter === 'ring' ? 'contained' : 'outlined'}>Rings</Button>
                    <Button onClick={() => onSubFilterChange('amulet')} variant={subFilter === 'amulet' ? 'contained' : 'outlined'}>Amulets</Button>
                    <Button onClick={() => onSubFilterChange('belt')} variant={subFilter === 'belt' ? 'contained' : 'outlined'}>Belts</Button>
                </ButtonGroup>
            )}
            {filter === 'plants' && (
                <ButtonGroup variant="outlined" color="secondary" className="subcategory-group">
                    <Button onClick={() => onSubFilterChange('all')} variant={subFilter === 'all' ? 'contained' : 'outlined'}>All Stages</Button>
                    <Button onClick={() => onSubFilterChange('seed')} variant={subFilter === 'seed' ? 'contained' : 'outlined'}>Seed</Button>
                    <Button onClick={() => onSubFilterChange('growing')} variant={subFilter === 'growing' ? 'contained' : 'outlined'}>Growing</Button>
                    <Button onClick={() => onSubFilterChange('harvest')} variant={subFilter === 'harvest' ? 'contained' : 'outlined'}>Harvest</Button>
                </ButtonGroup>
            )}
        </div>
    );
};

export default InventoryFilters;
