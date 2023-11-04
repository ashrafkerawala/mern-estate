import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
    success: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateUserStart: (state) => {
            state.loading = true;
            state.error = false
            state.success = false
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
            state.success = true
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.success = false
        },
        updateUserResetState: (state) => {
            state.error = false;
            state.loading = false;
            state.success = false;
        }
    }
})

export const { 
    signInStart, signInSuccess, 
    signInFailure, updateUserStart, 
    updateUserSuccess, updateUserFailure,
    updateUserResetState 
} = userSlice.actions
export default userSlice.reducer;