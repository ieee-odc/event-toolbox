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
      console.log("updated is edit to true 2");

      const { Data } = action.payload;
      state.selectedForm = {
        ...Data,
      };
    },
    setSelectedForm: (state, action) => {
      state.isEdit = true;
      console.log("updated is edit to true");
      state.selectedForm = action.payload;
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
    changeFormState: (state, action) => {
      state.isEdit = action.payload;
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
        if(newType==="select" || newType==="multi-select"){
          state.selectedForm.data[index].options=[
            "First Option","Second Option"
          ]
        }else if(newType==="input"){
          state.selectedForm.data[index].options=[]
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
      if (questionIndex >= 0 && questionIndex < state.selectedForm.data.length) {
        state.selectedForm.data[questionIndex].options.splice(optionIndex, 1);
      }
    },
    addOption: (state, action) => {
      const index = action.payload;
      if (index >= 0 && index < state.selectedForm.data.length) {
        state.selectedForm.data[index].options.push("");
      }
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
  switchQuestionType,
  updateQuestionOptions,
  removeOption,
  addOption
} = FormsSlice.actions;
export default FormsSlice.reducer;
