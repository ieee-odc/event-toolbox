import { createSlice } from '@reduxjs/toolkit';


const statsStore = createSlice({
  name: 'stats',
  initialState: {
    events: [],
    totalParticipants: 0,
    currentParticipants: 0,
    totalWorkshops: 0,
    eventId: 1,
    isLoading: false,
    error: null,
  },
  reducers: {
    fetchStatsStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchStatsSuccess(state, action) {
      state.events = action.payload.events;
      state.totalParticipants = action.payload.totalParticipants;
      state.currentParticipants = action.payload.currentParticipants;
      state.totalWorkshops = action.payload.totalWorkshops;
      state.isLoading = false;
    },
    fetchStatsFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setEventId: (state, action) => {
      state.eventId = action.payload;
    },
  },
});

export const { fetchStatsStart, fetchStatsSuccess, fetchStatsFailure, setEventId } = statsStore.actions;

export default statsStore.reducer;
