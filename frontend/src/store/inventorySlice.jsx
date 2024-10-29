// src/store/inventorySlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchInventoryFromServer } from '../db/HeroDB';

export const fetchInventoryData = createAsyncThunk('inventory/fetchInventoryData', async () => {
  const data = await fetchInventoryFromServer();
  return data;
});

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    removeItem(state, action) {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.item_id !== itemId);
    },
    removeItemsByName(state, action) {
      const name = action.payload;
      state.items = state.items.filter((item) => item.name !== name);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInventoryData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchInventoryData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { removeItem, removeItemsByName } = inventorySlice.actions;
export default inventorySlice.reducer;
