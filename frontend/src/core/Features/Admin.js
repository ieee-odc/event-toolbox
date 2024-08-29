import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosRequest from "../../utils/AxiosConfig";

// Async thunk to fetch pending organizers
export const fetchOrganizers = createAsyncThunk(
    'adminApproval/fetchOrganizers',
    async () => {
        const response = await axiosRequest.get('/organizers');
        console.log(response.data)
        return response.data;
    }
);

// Async thunk to approve an organizer
export const approveOrganizer = createAsyncThunk(
    'adminApproval/approveOrganizer',
    async (organizerId) => {
        const response = await axiosRequest.patch(`/organizers/${organizerId}/approve`);
        return response.data;
    }
);

// Async thunk to decline an organizer
export const declineOrganizer = createAsyncThunk(
    'adminApproval/declineOrganizer',
    async (organizerId) => {
        const response = await axiosRequest.patch(`/organizers/${organizerId}/decline`);
        return response.data;
    }
);

const adminApprovalSlice = createSlice({
    name: 'adminApproval',
    initialState: {
        organizers: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrganizers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrganizers.fulfilled, (state, action) => {
                state.organizers = action.payload;
                state.loading = false;
            })
            .addCase(fetchOrganizers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(approveOrganizer.fulfilled, (state, action) => {
                state.organizers = state.organizers.filter(
                    (org) => org.id !== action.payload.id
                );
            })
            .addCase(declineOrganizer.fulfilled, (state, action) => {
                state.organizers = state.organizers.filter(
                    (org) => org.id !== action.payload.id
                );
            });
    },
});

export default adminApprovalSlice.reducer;
