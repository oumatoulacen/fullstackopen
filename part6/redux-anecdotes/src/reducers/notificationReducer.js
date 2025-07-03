import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        addNotification: (state, action) => action.payload,
        clearNotification: () => ''
    }
});

export const setNotification = (message, timeout) => {
    return async (dispatch) => {
        dispatch(addNotification(message));
        setTimeout(() => {
            dispatch(clearNotification());
        }, timeout * 1000);
    };
};

export const { addNotification, clearNotification } = notificationSlice.actions;
const notificationReducer = notificationSlice.reducer;
export default notificationReducer;