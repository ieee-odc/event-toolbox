import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosRequest from "../../utils/AxiosConfig";

// Function to fetch event data
export const fetchEventData = createAsyncThunk(
  "Participant/fetchEventData",
  async (eventId) => {
    const response = await axiosRequest.get(`/events/${eventId}`);
    return response.data;
  }
);

// Function to fetch workshop data
export const fetchWorkshopData = createAsyncThunk(
  "Participant/fetchWorkshopData",
  async (workshopId) => {
    const response = await axiosRequest.get(`/workshop/${workshopId}`);
    return response.data;
  }
);

// Function to initialize participants
export const initializeParticipants = createAsyncThunk(
  "Participants/initializeParticipants",
  async (participants, { dispatch }) => {
    const emailToParticipant = {};
    console.log(participants)
    for (const participant of participants) {
      const eventId = participant.eventId;
      const workshopId = participant.workshopId;

      if (!emailToParticipant[participant.email]) {
        const eventResponse = await dispatch(fetchEventData(eventId));
        emailToParticipant[participant.email] = {
          ...participant,
          eventName: eventResponse.payload.event.name,
          eventResponses: participant.responses || [],
          workshops: [],
        };
      }

      if (workshopId) {
        const workshopResponse = await dispatch(fetchWorkshopData(workshopId));
        emailToParticipant[participant.email].workshops.push({
          workshopId,
          workshopName: workshopResponse.payload.workshop.name,
          responses: participant.responses || [],
        });
      }
    }
    return Object.values(emailToParticipant);
  }
);
const ParticipantsSlice = createSlice({
  name: "Participants",
  initialState: {
    participants: [],
    isLoading: false,
    isEdit: false,
    isParticipantModalOpen: false,
    isParticipantDetailsOpen: false,
    filterStatus: "",
    filteredParticipants: [],
    selectedParticipant: {
      email: '',
      fullName: '',
      phoneNumber: '',
    },
    participantsPerPage: 10,
    searchQuery: "",
  },
  reducers: {
    setParticipants: (state, action) => {
      state.participants = action.payload;
      state.filteredParticipants = action.payload;
    },
    addParticipant: (state, action) => {
      state.participants = [...state.participants, action.payload];
      state.filteredParticipants = [
        ...state.filteredParticipants,
        action.payload,
      ];
    },
    toggleParticipantDetails: (state) => {
      state.isParticipantDetailsOpen = !state.isParticipantDetailsOpen;
    },
    deleteParticipant: (state, action) => {
      state.participants = state.participants.filter(
        (participant) => participant.id !== action.payload
      );
      state.filteredParticipants = state.filteredParticipants.filter(
        (participant) => participant.id !== action.payload
      );
    },
    editParticipant: (state, action) => {
      const updatedParticipants = state.participants.map((participant) =>
        participant.id === action.payload.id ? action.payload : participant
      );
      state.participants = updatedParticipants;
      state.filteredParticipants = updatedParticipants;
      state.isEdit = false;
    },
    toggleParticipantModal: (state) => {
      state.isParticipantModalOpen = !state.isParticipantModalOpen;
    },
    resetParticipantModal: (state) => {
      state.selectedParticipant = { email: '', fullName: '', phoneNumber: '' };
      state.isEdit = false;
    },
    toggleParticipantsIsLoading: (state) => {
      state.isLoading = !state.isLoading;
    },
    selectParticipant: (state, action) => {
      state.isEdit = true;
      const { Data } = action.payload;
      state.selectedParticipant = {
        ...Data,
      };
    },
    setSelectedParticipant: (state, action) => {
      state.isEdit = true;
      state.selectedParticipant = action.payload;
    },
    updateSelectedParticipantField: (state, action) => {
      const { id, value } = action.payload;
      state.selectedParticipant[id] = value;
    },
    updateData: (state, action) => {
      state.selectedParticipant.data = action.payload;
    },
    removeField: (state, action) => {
      const fieldName = action.payload;
      const { [fieldName]: _, ...newData } = state.selectedParticipant.data;
      state.selectedParticipant.data = newData;
    },
    changeParticipantState: (state, action) => {
      state.isEdit = action.payload;
    },
    addField: (state, action) => {
      state.selectedParticipant.data = [
        ...state.selectedParticipant.data,
        action.payload,
      ];
    },
    removeField: (state, action) => {
      state.selectedParticipant.data.splice(action.payload, 1);
    },
    setParticipantsPerPage: (state, action) => {
      state.participantsPerPage = action.payload;
    },
    filterParticipants: (state, action) => {
      state.filterStatus = action.payload;
      state.filteredParticipants = action.payload
        ? state.participants.filter(
          (participant) => participant.status === action.payload
        )
        : state.participants;
    },
    setSearchQuery: (state, action) => {
      const query = action.payload.toLowerCase();
      state.searchQuery = query;

      state.filteredParticipants = state.participants.filter((participant) =>
        participant.fullName.toLowerCase().includes(query) ||
        participant.email.toLowerCase().includes(query)
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeParticipants.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeParticipants.fulfilled, (state, action) => {
        state.isLoading = false;
        state.participants = action.payload;
        state.filteredParticipants = action.payload;
      })
      .addCase(initializeParticipants.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchEventData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEventData.fulfilled, (state, action) => {
        state.isLoading = false;
        // Process event data if needed
      })
      .addCase(fetchEventData.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchWorkshopData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWorkshopData.fulfilled, (state, action) => {
        state.isLoading = false;
        // Process workshop data if needed
      })
      .addCase(fetchWorkshopData.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const {
  setParticipants,
  addParticipant,
  deleteParticipant,
  editParticipant,
  toggleParticipantModal,
  toggleParticipantDetails,
  toggleParticipantsIsLoading,
  selectParticipant,
  setSelectedParticipant,
  updateSelectedParticipantField,
  addField,
  updateData,
  removeField,
  resetParticipantModal,
  changeParticipantState,
  setParticipantsPerPage,
  filterParticipants,
  setSearchQuery,
} = ParticipantsSlice.actions;

export default ParticipantsSlice.reducer;
