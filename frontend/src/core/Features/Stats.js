import { createSlice } from '@reduxjs/toolkit';


const statsStore = createSlice({
  name: 'stats',
  initialState: {
    events: [],
    workshops: [],
    totalParticipants: 0,
    currentParticipants: 0,
    totalWorkshops: 0,
    totalOrganizers: 0,
    eventId: 1,
    workshopId: 2,
    isLoading: false,
    error: null,
    eventsPerPage: 5,
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
      state.totalOrganizers = action.payload.totalOrganizers;
      state.isLoading = false;
    },
    fetchStatsFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchWorkshops(state, action) {
      state.workshops = action.payload.workshops;
    },
    setEventId: (state, action) => {
      state.eventId = action.payload;
    },
    setWorkshopId: (state, action) => {
      state.workshopId = action.payload;
    },
    setEventsPerPage: (state, action) => {
      state.eventsPerPage = action.payload;
    },
  },
});

export const { fetchStatsStart, fetchStatsSuccess, fetchStatsFailure, fetchWorkshops, setEventId,setWorkshopId, setEventsPerPage } = statsStore.actions;

export default statsStore.reducer;
