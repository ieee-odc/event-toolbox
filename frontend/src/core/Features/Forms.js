import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosRequest from "../../utils/AxiosConfig";

export const fetchShareLinks = createAsyncThunk(
  "Forms/fetchShareLinks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosRequest.get("/links");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const generateShareLink = createAsyncThunk(
  "Forms/generateShareLink",
  async ({ formId }, { rejectWithValue }) => {
    try {
      const response = await axiosRequest.post("/link/create", {
        formId,
      });
      return { formId, link: response.data.link };
    } catch (error) {
      return rejectWithValue({ formId, error: error.response.data });
    }
  }
);

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
    shareLinks: {},
  },
  reducers: {
    initializeForms: (state, action) => {
      state.forms = action.payload;
      state.filteredForms = action.payload;
    },
    addForm: (state, action) => {
      state.forms = [...state.forms, action.payload];
      state.filteredForms = [...state.filteredForms, action.payload];
      state.shareLinks[action.payload.id] = {}; // Initialize shareLinks for new form
    },
    deleteForm: (state, action) => {
      state.forms = state.forms.filter((form) => form.id !== action.payload);
      state.filteredForms = state.filteredForms.filter(
        (form) => form.id !== action.payload
      );
      delete state.shareLinks[action.payload]; // Delete share link information
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
      state.selectedForm = { ...action.payload };
    },
    setSelectedForm: (state, action) => {
      state.isEdit = true;
      state.selectedForm = action.payload;
    },
    updateSelectedFormField: (state, action) => {
      const { id, value } = action.payload;
      state.selectedForm[id] = value;
    },
    updateData: (state, action) => {
      state.selectedForm.data = action.payload;
    },
    resetFormModal: (state) => {
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
    addField: (state, action) => {
      state.selectedForm.data = [...state.selectedForm.data, action.payload];
    },
    removeField: (state, action) => {
      state.selectedForm.data.splice(action.payload, 1);
    },
    changeFormState: (state, action) => {
      state.isEdit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShareLinks.fulfilled, (state, action) => {
        action.payload.forEach(link => {
          state.shareLinks[link.formId] = { link: `${process.env.BASE_URL}/forms/${link.link}` };
        });
      })
      .addCase(generateShareLink.fulfilled, (state, action) => {
        const { formId, link } = action.payload;
        state.shareLinks[formId] = { link };
      })
      .addCase(generateShareLink.rejected, (state, action) => {
        const { formId, error } = action.payload;
        state.shareLinks[formId] = { error };
      });
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
