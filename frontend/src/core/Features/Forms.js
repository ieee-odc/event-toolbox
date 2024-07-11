import { createSlice } from "@reduxjs/toolkit";
import { UserData } from "../../utils/UserData";

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
      organizerId: UserData().id,
      name: "",
      deadline: "",
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
      state.filteredForms = updatedEvents;
    },
    // editForm: (state, action) => {
    //   const index = state.forms.findIndex((form) => form.id === action.payload.id);
    //   if (index !== -1) {
    //     state.forms[index] = action.payload;
    //   }
    // },
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

      // Update directly if id matches top-level keys in selectedForm
      if (state.selectedForm.hasOwnProperty(id)) {
        state.selectedForm[id] = value;
      } else if (id.startsWith("data.")) {
        // Update nested data field
        const field = id.split(".")[1];
        state.selectedForm.data = {
          ...state.selectedForm.data,
          [field]: value,
        };
      } else {
        console.warn(`Unhandled field update: ${id}`);
      }
    },

    // addField: (state) => {
    //   const newField = `field${
    //     Object.keys(state.selectedForm.data).length + 1
    //   }`;
    //   state.selectedForm.data[newField] = "";
    // },
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
        deadline: "",
        data: {},
      };
    },
    changeFormState: (state, action) => {
      state.isEdit = action.payload;
    },
    addField: (state, action) => {
      const { key, value } = action.payload;
      state.selectedForm.data[key] = value;
    },
    removeField: (state, action) => {
      const key = action.payload;
      delete state.selectedForm.data[key];
    },
    resetFormModal: (state, action) => {
      state.selectedForm = {
        organizerId: UserData().id,
        name: "",
        deadline: "",
        description: "",
        data: {},
      };
    },
    changeFormState: (state, action) => {
      state.isEdit = action.payload;
    },
    // selectForm: (state, action) => {
    //   state.isEdit = true;
    //   const { deadline, ...otherFields } = action.payload;
    //   state.selectedForm = {
    //     ...state.selectedForm,
    //     ...otherFields,
    //     deadline,
    //   };
    // },
    setSelectedForm: (state, action) => {
      state.selectedForm = action.payload;
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
  removeField,
  resetFormModal,
  changeFormState,
} = FormsSlice.actions;
export default FormsSlice.reducer;
