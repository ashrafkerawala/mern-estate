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
        stateStart: (state) => {
            state.loading = true;
            state.error = false
            state.success = false
        },
        stateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
            state.success = true
        },
        stateFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.success = false
        },
        stateReset: (state) => {
            state.error = false;
            state.loading = false;
            state.success = false;
        }
    }
})

export const { 
    stateStart, stateSuccess, 
    stateFailure, stateReset
} = userSlice.actions
export default userSlice.reducer;