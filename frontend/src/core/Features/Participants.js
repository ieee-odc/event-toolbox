import { createSlice } from "@reduxjs/toolkit";

const ParticipantsSlice = createSlice({
  name: "Participants",
  initialState: {
    participants: [],
    isLoading: false,
    isEdit: false,
    isParticipantModalOpen: false,
    filterStatus: "",
    filteredParticipants: [],
    selectedParticipant: {},
    participantsPerPage: 10,
  },
  reducers: {
    initializeParticipants: (state, action) => {
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
    },
    toggleParticipantModal: (state) => {
      state.isParticipantModalOpen = !state.isParticipantModalOpen;
    },
    setSelectedParticipant: (state, action) => {
      state.selectedParticipant = action.payload;
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
    resetParticipantModal: (state) => {
      state.isEdit = false;
      state.selectedParticipant = {};
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
    changeParticipantState: (state, action) => {
      state.isEdit = action.payload;
    },
    setParticipantsPerPage: (state, action) => {
      state.participantsPerPage = action.payload;
    },
  },
});

export const {
  initializeParticipants,
  addParticipant,
  deleteParticipant,
  editParticipant,
  toggleParticipantModal,
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
} = ParticipantsSlice.actions;

export default ParticipantsSlice.reducer;
