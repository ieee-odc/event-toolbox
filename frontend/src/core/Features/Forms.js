import { createSlice } from "@reduxjs/toolkit";

const FormsSlice = createSlice({
  name: "Forms",
  initialState: {
    forms: [],
    isLoading: false,
    isEdit: false,
    isFormModalOpen: false,
    filterStatus: "",
    filteredForms: [],
    selectedForm: {
      organizerId: "",
      name: "",
      deadline: "",
      description: "",
      eventId:"",
      data: [],
    },
  },
  reducers: {
    initializeForms: (state, action) => {
      state.forms = action.payload;
      state.filteredForms = action.payload;
    },
    addForm: (state, action) => {
      state.forms = [...state.forms, action.payload];
      state.filteredForms = [...state.filteredForms, action.payload];
    },
    deleteForm: (state, action) => {
      state.forms = state.forms.filter((form) => form.id !== action.payload);
      state.filteredForms = state.filteredForms.filter(
        (form) => form.id !== action.payload
      );
    },
    editForm: (state, action) => {
      const updatedForms = state.forms.map((form) =>
        form.id === action.payload.id ? action.payload : form
      );
      state.forms = updatedForms;
      state.filteredForms = updatedForms;
    },
    toggleFormModal: (state) => {
      state.isFormModalOpen = !state.isFormModalOpen;
    },
    toggleFormsIsLoading: (state) => {
      state.isLoading = !state.isLoading;
    },
    selectForm: (state, action) => {
      state.isEdit = true;
      console.log("updated is edit to true 2")

      const { Data } = action.payload;
      state.selectedForm = {
        ...Data,
      };
    },
    setSelectedForm: (state, action) => {
      state.isEdit = true;
      console.log("updated is edit to true")
      state.selectedForm = action.payload;
    },
    updateSelectedFormField: (state, action) => {
      const { id, value } = action.payload;
      state.selectedForm[id] = value;
    },
    updateData: (state, action) => {
      state.selectedForm.data = action.payload
    },

    removeField: (state, action) => {
      const fieldName = action.payload;
      const { [fieldName]: _, ...newData } = state.selectedForm.data;
      state.selectedForm.data = newData;
    },
    resetFormModal: (state) => {
      console.log("reseting form")
      console.log("updated is edit to false")

      state.isEdit = false;
      state.selectedForm = {
        organizerId: "",
        name: "",
        description: "",
        deadline: "",
        eventId:"",
        data: [],
      };
    },
    changeFormState: (state, action) => {
      state.isEdit = action.payload;
    },
    addField: (state, action) => {
      state.selectedForm.data=[...state.selectedForm.data,action.payload]
    },
    removeField: (state, action) => {
      state.selectedForm.data.splice(action.payload, 1); // Just splice, don't reassign
      
    },
    changeFormState: (state, action) => {
      state.isEdit = action.payload;
    },
  },
});

export const {
  initializeForms,
  addForm,
  deleteForm,
  editForm,
  toggleFormModal,
  toggleFormsIsLoading,
  selectForm,
  setSelectedForm,
  updateSelectedFormField,
  addField,
  updateData,
  removeField,
  resetFormModal,
  changeFormState,
} = FormsSlice.actions;
export default FormsSlice.reducer;