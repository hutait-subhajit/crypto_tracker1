// features/crypto/cryptoSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch coin data
export const fetchCoins = createAsyncThunk(
  '/',
  async () => {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd`);
    // console.log(response.data);
    return response.data;
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState: {
    coins: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.loading = false;
        state.coins = action.payload;
        // console.log(action.payload);
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        // console.log(action.error);
      });
  },
});

export default cryptoSlice.reducer;
