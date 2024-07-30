import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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
      data: [],
    },
    selectedWorkshops: [],
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
    setSelectedForm: (state, action) => {
      state.isEdit = true;
      state.selectedForm = action.payload;

      state.selectedWorkshops = [];

      action.payload.data.forEach((field) => {
        if (field.type === "workshop-selection") {
          state.selectedWorkshops.push(...field.options);
        }
      });
    },

    updateSelectedFormField: (state, action) => {
      const { id, value } = action.payload;
      state.selectedForm[id] = value;
    },
    updateData: (state, action) => {
      state.selectedForm.data = action.payload;
    },

    removeField: (state, action) => {
      const fieldName = action.payload;
      const { [fieldName]: _, ...newData } = state.selectedForm.data;
      state.selectedForm.data = newData;
    },
    resetFormModal: (state) => {
      state.isEdit = false;
      state.selectedForm = {
        organizerId: "",
        name: "",
        description: "",
        deadline: "",
        data: [],
      };
    },
    addField: (state, action) => {
      state.selectedForm.data = [
        ...state.selectedForm.data,
        {
          type: "input",
          question: "",
        },
      ];
    },
    switchQuestionType: (state, action) => {
      const { index, newType } = action.payload;
      if (index >= 0 && index < state.selectedForm.data.length) {
        state.selectedForm.data[index].type = newType;
        const optionsArray = ["checkbox", "radio", "dropdown"];
        if (optionsArray.includes(newType)) {
          state.selectedForm.data[index].options = [
            "First Option",
            "Second Option",
          ];
        } else {
          state.selectedForm.data[index].options = [];
        }
      }
    },
    updateQuestionOptions: (state, action) => {
      const { index, options } = action.payload;
      if (index >= 0 && index < state.selectedForm.data.length) {
        state.selectedForm.data[index].options = options;
      }
    },
    removeOption: (state, action) => {
      const { questionIndex, optionIndex } = action.payload;
      if (
        questionIndex >= 0 &&
        questionIndex < state.selectedForm.data.length
      ) {
        state.selectedForm.data[questionIndex].options.splice(optionIndex, 1);
      }
    },
    addOption: (state, action) => {
      const { index, value } = action.payload;
      if (index >= 0 && index < state.selectedForm.data.length) {
        state.selectedForm.data[index].options.push(value);
      }
    },
    removeField: (state, action) => {
      state.selectedForm.data.splice(action.payload, 1); // Just splice, don't reassign
    },
    resetSelectedWorkshops: (state) => {
      state.selectedWorkshops = [];
    },
    removeOneSelectedWorkshop: (state, action) => {
      state.selectedWorkshops = state.selectedWorkshops.filter(
        (item) => item.toString() !== action.payload
      );
    },

    selectAWorkshop: (state, action) => {
      state.selectedWorkshops = [...state.selectedWorkshops, action.payload];
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
  setSelectedForm,
  updateSelectedFormField,
  addField,
  updateData,
  removeField,
  resetFormModal,
  changeFormState,
  switchQuestionType,
  updateQuestionOptions,
  removeOption,
  addOption,
  resetSelectedWorkshops,
  removeOneSelectedWorkshop,
  selectAWorkshop,
} = FormsSlice.actions;
export default FormsSlice.reducer;
