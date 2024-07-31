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
    filterEvents(state, action) {
      state.filterStatus = action.payload;
      if (action.payload === "") {
        state.filteredEvents = state.events;
      } else {
        state.filteredEvents = state.events.filter((event) => {
          const status = getEventStatus(event.startDate, event.endDate).status;
          return status === action.payload;
        });
      }
    },
    toggleEventsIsLoading: (state) => {
      state.isLoading = !state.isLoading;
    },
    turnIsLoadingOff: (state) => {
      state.isLoading = false;
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
const getEventStatus = (startDate, endDate) => {
  const currentDate = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (currentDate > end) {
    return { status: "Done", badgeClass: "badge bg-label-success" };
  } else if (currentDate < start) {
    return { status: "Upcoming", badgeClass: "badge bg-label-primary" };
  } else {
    return { status: "Ongoing", badgeClass: "badge bg-label-warning" };
  }
};

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
  turnIsLoadingOff,
} = EventsSlice.actions;
export default EventsSlice.reducer;
