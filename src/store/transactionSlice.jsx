import { createSlice } from '@reduxjs/toolkit';

const initialTransaction = {
    totalPrice: 0,
    items: []
}

const transactionSlice = createSlice({
    name: 'transaction',
    initialState: initialTransaction,
    reducers: {
        addTransaction: (state, action) => {
            const alreadyExist = state.items.find((item) => item.name === action.payload.name);
            if(alreadyExist) {
                alreadyExist.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
            state.totalPrice += (action.payload.pricePerUnit * action.payload.quantity);
        },
        removeTransaction: (state, action) => {
            const transaction = state.items.find((item) => item.name === action.payload.name);

            if(!transaction) {
                return;
            }

            if(transaction.quantity > 1) {
                transaction.quantity -= action.payload.quantity;
            } else {
                state.items.filter((item) => item.name !== action.payload.name);
            }

            state.totalPrice -= (action.payload.pricePerUnit * action.payload.quantity);
        }
    }
});

export const transactionActions = transactionSlice.actions;

export default transactionSlice;