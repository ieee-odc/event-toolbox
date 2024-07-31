import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosRequest from "../../utils/AxiosConfig";

// Async thunk to fetch form data by form ID
export const fetchFormData = createAsyncThunk(
  "registration/fetchFormData",
  async (formId) => {
    const response = await axiosRequest.get(`/form/${formId}`);
    console.log("API response data:", response.data.form.workshopId);
    return {
      form: response.data.form,
      eventId: response.data.form.eventId,
      workshopId: response.data.form.workshopId,
    };
  }
);

const registrationSlice = createSlice({
  name: "registration",
  initialState: {
    formFields: [],
    formData: {},
    loading: false,
    error: null,
    workshopsIds: [],
    formWorkshops: [],
    eventId: null,
    workshopId: null,
  },
  reducers: {
    updateFormData: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    resetFormData: (state) => {
      state.formData = {};
    },
    initializeWorkshops: (state, action) => {
      state.formWorkshops = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFormData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormData.fulfilled, (state, action) => {
        state.loading = false;
        state.formFields = action.payload.form.data;

        const workshopIdsSet = new Set(state.workshopsIds); // Create a Set to store unique workshop IDs

        for (let i = 0; i < action.payload.form.data.length; i++) {
          if (action.payload.form.data[i].type === "workshop-selection") {
            action.payload.form.data[i].options.forEach((option) => {
              workshopIdsSet.add(option);
            });
          }
        }

        state.workshopsIds = Array.from(workshopIdsSet);
        state.eventId = action.payload.form.eventId;
        state.workshopId = action.payload.form.workshopId;
        state.formData = {
          name: action.payload.form.name,
          description: action.payload.form.description,
          deadline: action.payload.form.deadline,
        };
      })

      .addCase(fetchFormData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  updateFormData,
  initializeWorkshops,
  resetFormData,
  setHeadData,
} = registrationSlice.actions;

export default registrationSlice.reducer;
