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

        updateUserStart: (state) => {
            state.loading = true;
        }, // update user start

        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload; //update user in state with new user
            state.loading = false;  //set loading to false
            state.error = null;
        },// update user success

        updateUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
       
    },
}); //create user slice

export const { signInStart, signInSuccess, signInFailure, updateUserStart, updateUserSuccess, updateUserFailure } = userSlice.actions; //export actions

export default userSlice.reducer; //export reducer
