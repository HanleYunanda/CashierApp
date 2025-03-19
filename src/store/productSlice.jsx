import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
    name: 'product',
    initialState: [],
    reducers: {
        getProductsWithFilter: (state, action) => {
            const filter = action.payload;
            return state.filter((product) => product.name.toLowerCase().includes(filter.toLowerCase()));
        },
        setProducts: (state, action) => {
            state = action.payload;
        }
    }
});

export const productActions = productSlice.actions;

export default productSlice;