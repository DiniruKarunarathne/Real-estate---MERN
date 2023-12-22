import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error : null,
    loading : false,
}; //initial state for user

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        }, // sign in start

        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        }, // sign in success

        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }, // sign in failure
       
    },
}); //create user slice

export const { signInStart, signInSuccess, signInFailure } = userSlice.actions; //export actions

export default userSlice.reducer; //export reducer
