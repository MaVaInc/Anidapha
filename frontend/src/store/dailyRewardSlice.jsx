// src/store/dailyRewardSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDailyRewardFromServer } from '../db/HeroDB';

export const fetchDailyReward = createAsyncThunk('dailyReward/fetchDailyReward', async () => {
  const reward = await fetchDailyRewardFromServer();
  return reward;
});

const dailyRewardSlice = createSlice({
  name: 'dailyReward',
  initialState: {
    reward: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearDailyReward(state) {
      state.reward = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyReward.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDailyReward.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reward = action.payload;
      })
      .addCase(fetchDailyReward.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearDailyReward } = dailyRewardSlice.actions;
export default dailyRewardSlice.reducer;
