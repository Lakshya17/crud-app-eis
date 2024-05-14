import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLogin: false,
    currentUser: false,
    loading: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLogin = true;
        },
        logout: (state, action) => {
            state.isLogin = false;
        },
        currentSession: (state, action) => {
            state.currentUser = action.payload
        },
        btnLoading: (state, action) => {
            state.loading = true
        },
        btnLoadingFalse: (state, action) => {
            state.loading = false;
        }
    }
})

export const { login, logout, currentSession, btnLoading, btnLoadingFalse } = authSlice.actions;

export default authSlice.reducer;