import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        unreadCount: 0,
        showNotifications: false,
        isLoading: false,
        error: null,
    },
    reducers: {
        toggleShowNotifications: (state) => {
            state.showNotifications = !state.showNotifications;
        },
        setNotifications: (state, action) => {
            state.notifications = action.payload.notifications;
            state.unreadCount = action.payload.unreadCount;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        markAllAsReadSuccess: (state) => {
            state.notifications = state.notifications.map((notification) => ({
                ...notification,
                read: true,
            }));
            state.unreadCount = 0;
        },
        deleteNotificationSuccess: (state, action) => {
            state.notifications = state.notifications.filter(
                (notification) => notification._id !== action.payload
            );
            state.unreadCount = state.notifications.filter(
                (notification) => !notification.read
            ).length;
        },
        addNotification: (state, action) => {
            state.notifications = [action.payload, ...state.notifications];
            state.unreadCount += 1;
        },
    },
});

export const {
    toggleShowNotifications,
    setNotifications,
    setLoading,
    setError,
    markAllAsReadSuccess,
    deleteNotificationSuccess,
    addNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
