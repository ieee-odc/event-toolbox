import { createSlice } from "@reduxjs/toolkit";

const SpacesSlice = createSlice({
  name: "Spaces",
  initialState: {
    isLoading: false,
    spaces: [],
    isEdit: false,
    filteredSpaces: [],
    isModalOpen: false,
    filterStatus: "",
    selectedSpace: {
      organizerId: "",
      name: "",
      capacity: 0,
    },
  },
  reducers: {
    initializeSpaces: (state, action) => {
      state.spaces = action.payload;
      state.filteredSpaces = action.payload;
    },
    addSpace: (state, action) => {
      state.spaces = [...state.spaces, action.payload];
      state.filteredSpaces = [...state.filteredSpaces, action.payload];
    },
    deleteSpace: (state, action) => {
      state.isEdit = false;
      state.selectedSpace = {
        organizerId: "",
        name: "",
        capacity: 0,
      };
      state.spaces = state.spaces.filter(
        (space) => space.id !== action.payload
      );
      state.filteredSpaces = state.filteredSpaces.filter(
        (space) => space.id !== action.payload
      );
    },
    editSpace: (state, action) => {
      const updatedSpaces = state.spaces.map((space) =>
        space.id === action.payload.id ? action.payload : space
      );
      state.spaces = updatedSpaces;
      state.filteredSpaces = updatedSpaces;
    },
    filterSpaces: (state, action) => {
      state.filterStatus = action.payload;
      state.filteredSpaces = state.spaces.filter((space) =>
        space.status.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    toggleSpacesIsLoading: (state) => {
      state.isLoading = !state.isLoading;
    },
    selectSpace: (state, action) => {
      state.isEdit = true;
      state.selectedSpace = action.payload;
    },
    updateSelectedSpaceField: (state, action) => {
      const { id, value } = action.payload;
      state.selectedSpace[id] = value;
    },
    resetSpaceModal: (state) => {
      state.isEdit = false;
      state.selectedSpace = {
        organizerId: "",
        name: "",
        capacity: 0,
      };
    },
    changeFormState: (state, action) => {
      state.isEdit = action.payload;
    },
    setIsSpacesLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  initializeSpaces,
  addSpace,
  deleteSpace,
  editSpace,
  toggleSpaceModal,
  filterSpaces,
  selectSpace,
  setSelectedSpace,
  updateSelectedSpaceField,
  resetSpaceModal,
  changeFormState,
  setIsSpacesLoading,
} = SpacesSlice.actions;
export default SpacesSlice.reducer;
