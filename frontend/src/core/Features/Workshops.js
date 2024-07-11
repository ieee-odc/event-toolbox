import { createSlice } from "@reduxjs/toolkit";

const WorkshopsSlice = createSlice({
  name: "Workshops",
  initialState: {
    isLoading: false,
    workshops: [],
    filteredWorkshops: [],
    isEdit:false,
    isModalOpen: false,
    selectedWorkshop:{
      name: "",
      description: "",
      startTime: "",
      endTime: "",
      currentParticipants: 50,
      spaceId: "1",
      eventId: "1",
      organizerId: "",
    }
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
        const index = state.workshops.findIndex((workshop) => workshop.id === action.payload.id);
        state.workshops[index] = action.payload;
        state.filteredWorkshops[index] = action.payload;
        state.isEdit = false;
    },
    deleteWorkshop: (state, action) => {
        state.workshops = state.workshops.filter((workshop) => workshop.id!== action.payload);
        state.filteredWorkshops = state.filteredWorkshops.filter((workshop) => workshop.id!== action.payload);
    },
    toggleWorkshopModal:(state)=>{
        state.isModalOpen=!state.isModalOpen;
    },
    filterWorkshops:(state,action)=>{
      state.filteredWorkshops=state.workshops.filter((workshop) => workshop.name.toLowerCase().includes(action.payload.toLowerCase()));
    },
    updateSelectedWorkshopField: (state, action) => {
      const { id, value } = action.payload;
      state.selectedWorkshop[id] = value;
      if (id === "startDate") {
        state.selectedWorkshop.endDate = "";
      }
    },
    
  },
});

export const {
initializeWorkshops,
addWorkshop,
  editWorkshop,
  deleteWorkshop,
  toggleWorkshopModal,
  filterWorkshops,
  updateSelectedWorkshopField
} = WorkshopsSlice.actions;
export default WorkshopsSlice.reducer;
