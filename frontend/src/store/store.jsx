// src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import heroReducer from './heroSlice';
import inventoryReducer from './inventorySlice';
import dailyRewardReducer from './dailyRewardSlice';

const store = configureStore({
  reducer: {
    hero: heroReducer,
    inventory: inventoryReducer,
    dailyReward: dailyRewardReducer,
  },
});

export default store;
