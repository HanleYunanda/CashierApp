import { configureStore } from '@reduxjs/toolkit';

import transactionSlice from './transactionSlice';
import productSlice from './productSlice';
import authSlice from './authSlice';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    product: productSlice.reducer,
    transaction: transactionSlice.reducer
  },
});

export default store;