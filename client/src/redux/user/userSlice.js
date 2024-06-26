import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    currentUser: null,
    error: false,
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
        stateSoftReset: (state) => {
            state.error = false;
            state.loading = false;
            state.success = false;
        },
        stateHardReset: () => initialState
    }
})

export const { 
    stateStart, stateSuccess, 
    stateFailure, stateSoftReset,
    stateHardReset
} = userSlice.actions
export default userSlice.reducer;