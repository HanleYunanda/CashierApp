import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        id: null,
        email: null,
    },
    reducers: {
        setAuth (state, action) {
            state.token = action.payload.token;
            state.id = action.payload.id;
            state.email = action.payload.email;
        },
        removeAuth (state) {
            state.token = null;
            state.id = null;
            state.email = null;
        }
    }
});

export const authActions = authSlice.actions;

export default authSlice;