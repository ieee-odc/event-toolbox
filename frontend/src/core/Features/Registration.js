import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosRequest from "../../utils/AxiosConfig";

// Async thunk to fetch form data by form ID
export const fetchFormData = createAsyncThunk(
  "registration/fetchFormData",
  async (formId) => {
    const response = await axiosRequest.get(`/form/${formId}`);
    console.log("API response data:", response.data.form.eventId);
    return {form: response.data.form, eventId: response.data.form.eventId };
  }
);

const registrationSlice = createSlice({
  name: "registration",
  initialState: {
    formFields: [],
    formData: {},
    loading: false,
    error: null,
  },
  reducers: {
    updateFormData: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    resetFormData: (state) => {
      state.formData = {};
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
        console.log(action.payload)
        state.formFields = action.payload.form.data;
        state.formData = {
          name: action.payload.form.name,
          description: action.payload.form.description,
          deadline: action.payload.form.deadline
        }
      })
      .addCase(fetchFormData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateFormData, resetFormData } = registrationSlice.actions;

export default registrationSlice.reducer;
