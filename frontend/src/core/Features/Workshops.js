import { createSlice } from "@reduxjs/toolkit";

const WorkshopsSlice = createSlice({
  name: "Workshops",
  initialState: {
    isLoading: false,
    workshops: [],
    filteredWorkshops: [],
    isEdit: false,
    isModalOpen: false,
    selectedWorkshop: {
      name: "",
      description: "",
      startTime: "",
      endTime: "",
      organizerId: "",
      spaceId:"",
      formId:"",
      date: new Date()
    },
    workshopsPerPage: 6,

  },
  reducers: {
    initializeWorkshops: (state, action) => {
      state.workshops = action.payload;
      state.filteredWorkshops = action.payload;
    },
    addWorkshop: (state, action) => {
      state.workshops.push(action.payload);
      state.filteredWorkshops.push(action.payload);
    },
    editWorkshop: (state, action) => {
      const index = state.workshops.findIndex(
        (workshop) => workshop.id === action.payload.id
      );
      state.workshops[index] = action.payload;
      state.filteredWorkshops[index] = action.payload;
      state.isEdit = false;
    },
    deleteWorkshop: (state, action) => {
      state.workshops = state.workshops.filter(
        (workshop) => workshop.id !== action.payload
      );
      state.filteredWorkshops = state.filteredWorkshops.filter(
        (workshop) => workshop.id !== action.payload
      );
    },
    toggleWorkshopModal: (state) => {
      state.isModalOpen = !state.isModalOpen;
    },
    filterWorkshops: (state, action) => {
      state.filteredWorkshops = state.workshops.filter((workshop) =>
        workshop.name.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    setSelectedWorkshop: (state, action) => {
      state.isEdit = true;
      state.selectedWorkshop = action.payload;

    },
    updateSelectedWorkshopField: (state, action) => {
      const { id, value } = action.payload;
      state.selectedWorkshop[id] = value;
      if (id === "startDate") {
        state.selectedWorkshop.endDate = "";
      }
    },
    resetWorkshopModal: (state) => {
      state.isEdit = false;
      const newSelectedSpace={
        ...state.selectedWorkshop,
        name: "",
        description: "",
        startTime: "",
        endTime: "",
        organizerId: "",
      }
      state.selectedWorkshop = newSelectedSpace;
    },
    setWorkshopsPerPage: (state, action) => {
      state.workshopsPerPage = action.payload;
    },
    toggleWorkshopsIsLoading: (state) => {
      state.isLoading = !state.isLoading;
    },
  },
});

export const {
  initializeWorkshops,
  addWorkshop,
  editWorkshop,
  deleteWorkshop,
  toggleWorkshopModal,
  resetWorkshopModal,
  filterWorkshops,
  updateSelectedWorkshopField,
  setSelectedWorkshop,
  setWorkshopsPerPage,
  toggleWorkshopsIsLoading,
  isLoading,
} = WorkshopsSlice.actions;
export default WorkshopsSlice.reducer;
