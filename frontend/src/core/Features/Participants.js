import { createSlice } from "@reduxjs/toolkit";


const groupParticipantsByEmail = (participants) => {
  const emailToParticipant = {};
  participants.forEach((participant) => {
    if (!emailToParticipant[participant.email]) {
      emailToParticipant[participant.email] = { ...participant };
    } else {
      // Aggregate statuses
      if (!emailToParticipant[participant.email].statuses) {
        emailToParticipant[participant.email].statuses = [emailToParticipant[participant.email].status];
      }
      emailToParticipant[participant.email].statuses.push(participant.status);

      // Aggregate phone numbers
      if (!emailToParticipant[participant.email].phoneNumbers) {
        emailToParticipant[participant.email].phoneNumbers = [emailToParticipant[participant.email].phoneNumber];
      }
      if (participant.phoneNumber && !emailToParticipant[participant.email].phoneNumbers.includes(participant.phoneNumber)) {
        emailToParticipant[participant.email].phoneNumbers.push(participant.phoneNumber);
      }

      // Aggregate responses
      if (!emailToParticipant[participant.email].responses) {
        emailToParticipant[participant.email].responses = [];
      }
      if (participant.responses) {
        emailToParticipant[participant.email].responses = emailToParticipant[participant.email].responses.concat(participant.responses);
      }
    }
  });
  return Object.values(emailToParticipant);
};

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
    initializeParticipants: (state, action) => {
      const groupedParticipants = groupParticipantsByEmail(action.payload);
      state.participants = groupedParticipants;
      state.filteredParticipants = groupedParticipants;
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
      state.selectedParticipant.data.splice(action.payload, 1); // Just splice, don't reassign
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
});


export const {
  initializeParticipants,
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
