import { createSlice } from "@reduxjs/toolkit";

const FormsSlice = createSlice({
  name: "Forms",
  initialState: {
    forms: [],
    isLoading: false,
    isEdit: false,
    isFormModalOpen: false,
    selectedForm: {
      organizerId: "",
      name: "",
      description: "",
      data: {},
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
      const { Data } = action.payload;
      state.selectedForm = {
        ...Data,
      };
    },
    setSelectedForm: (state, action) => {
      state.selectedForm = action.payload;
    },
    updateSelectedFormField: (state, action) => {
      const { id, value } = action.payload;
      state.selectedForm[id] = value;
      // if (id === "startDate") {
      //   state.selectedForm.endDate = "";
      // }
      if (id.startsWith("data.")) {
        const field = id.split(".")[1];
        const Data = {
          ...state.selectedForm.data,
          [field]: value,
        };
        state.selectedForm.data = Data;
      }
    },
    addField: (state) => {
      const newField = `field${Object.keys(state.currentForm.data).length + 1}`;
      state.currentForm.data[newField] = "";
    },
    removeField: (state, action) => {
      const fieldName = action.payload;
      const { [fieldName]: _, ...newData } = state.selectedForm.data;
      state.selectedForm.data = newData;
    },
    resetFormModal: (state) => {
      state.selectedForm = {
        organizerId: "",
        name: "",
        description: "",
        data: {},
      };
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
  resetFormModal,
  changeFormState,
  //   removeField,
} = FormsSlice.actions;
export default FormsSlice.reducer;
