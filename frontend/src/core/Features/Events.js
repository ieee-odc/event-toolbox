import { createSlice } from "@reduxjs/toolkit";

const EventsSlice = createSlice({
  name: "Events",
  initialState: {
    isLoading: false,
    events: [],
    isEdit: false,
    filteredEvents: [],
    isModalOpen: false,
    eventsPerPage: 6,
    filterStatus: "",
    selectedEvent: {
      organizerId: "",
      name: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
    },
  },
  reducers: {
    initializeEvents: (state, action) => {
      state.events = action.payload;
      state.filteredEvents = action.payload;
    },
    addEvent: (state, action) => {
      state.events = [...state.events, action.payload];
      state.filteredEvents = [...state.filteredEvents, action.payload];
    },
    deleteEvent: (state, action) => {
      state.events = state.events.filter(
        (event) => event.id !== action.payload
      );
      state.filteredEvents = state.filteredEvents.filter(
        (event) => event.id !== action.payload
      );
    },
    editEvent: (state, action) => {
      const updatedEvents = state.events.map((event) =>
        event.id === action.payload.id ? action.payload : event
      );
      state.events = updatedEvents;
      state.filteredEvents = updatedEvents;
    },
    toggleEventModal: (state) => {
      state.isModalOpen = !state.isModalOpen;
    },
    filterEvents: (state, action) => {
      state.filterStatus = action.payload;
      state.filteredEvents = state.events.filter((event) =>
        event.status.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    toggleEventsIsLoading: (state) => {
      state.isLoading = !state.isLoading;
    },
    selectEvent: (state, action) => {
      state.isEdit = true;
      const { startDate, endDate, ...otherFields } = action.payload;
      state.selectedEvent = {
        ...state.selectedEvent,
        ...otherFields,
        startDate: startDate.split("T")[0],
        endDate: endDate.split("T")[0],
      };
    },
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    updateSelectedEventField: (state, action) => {
      const { id, value } = action.payload;
      state.selectedEvent[id] = value;
      if (id === "startDate") {
        state.selectedEvent.endDate = "";
      }
    },
    resetEventModal: (state) => {
      state.selectedEvent = {
        organizerId: "",
        name: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",
      };
    },
    changeFormState: (state, action) => {
      state.isEdit = action.payload;
    },
    setEventsPerPage: (state, action) => {
      state.eventsPerPage = action.payload;
    },
  },
});

export const {
  initializeEvents,
  addEvent,
  deleteEvent,
  editEvent,
  toggleEventModal,
  filterEvents,
  toggleEventsIsLoading,
  isLoading,
  selectEvent,
  setSelectedEvent,
  updateSelectedEventField,
  resetEventModal,
  changeFormState,
  setEventsPerPage,
} = EventsSlice.actions;
export default EventsSlice.reducer;
