import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosRequest from "../../utils/AxiosConfig";
import { act } from "react";

// Async thunk to fetch form data by form ID
export const fetchFormData = createAsyncThunk(
  "registration/fetchFormData",
  async (formId) => {
    const response = await axiosRequest.get(`/form/${formId}`);
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
    hasMultiSelectForm: false,
    allFull: true,
    isEventForm: false,
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
    setAllFull: (state, action) => {
      state.allFull = action.payload;
    },
    setIsEventForm: (state, action) => {
      state.isEventForm = action.payload;
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

        const workshopIdsSet = new Set(); // Create an empty Set to store unique workshop IDs

        for (let i = 0; i < action.payload.form.data.length; i++) {
          if (action.payload.form.data[i].type === "workshop-selection") {
            action.payload.form.data[i].options.forEach((option) => {
              if (option !== undefined) {
                workshopIdsSet.add(option);
              }
            });
          }
        }

        if (action.payload.form.workshopId !== undefined) {
          workshopIdsSet.add(action.payload.form.workshopId);
        }

        // Convert the Set to an array and filter out undefined values
        state.workshopsIds = Array.from(workshopIdsSet).filter(
          (id) => id !== undefined
        );

        state.eventId = action.payload.form.eventId;
        state.hasMultiSelectForm = action.payload.form.data.some(
          (question) => question.type === "workshop-selection"
        );
        state.formData = action.payload.form;
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
  setAllFull,
  setHeadData,
  setIsEventForm,
} = registrationSlice.actions;

export default registrationSlice.reducer;
