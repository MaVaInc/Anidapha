// src/store/heroSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchHeroDataFromServer } from '../db/HeroDB';

export const fetchHeroData = createAsyncThunk('hero/fetchHeroData', async () => {
  const data = await fetchHeroDataFromServer();
  return data;
});

const heroSlice = createSlice({
  name: 'hero',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeroData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHeroData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchHeroData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default heroSlice.reducer;
