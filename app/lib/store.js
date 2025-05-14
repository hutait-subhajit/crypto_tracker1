import { configureStore } from '@reduxjs/toolkit';
import searchSliceReducer from './searchSlice';
import cryptoSliceReducer from './cryptoSlice';

const Store = configureStore({
  reducer: {
    counter: searchSliceReducer,
    getCrypto:cryptoSliceReducer
  },
  
});

export default Store