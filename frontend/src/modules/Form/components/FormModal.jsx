import React, { useState, useEffect } from "react";
import "../Form.css";
import toast from "react-hot-toast";
import Flatpickr from "react-flatpickr";
import { useDispatch, useSelector } from "react-redux";

import axiosRequest from "../../../utils/AxiosConfig";
import { UserData } from "../../../utils/UserData";
import "./DatePicker.css";
import {
  addForm,
  editForm,
  toggleFormModal,
  updateSelectedFormField,
  addField,
  removeField,
  changeFormState,
  resetFormModal,
  updateData,
} from "../../../core/Features/Forms";
import { initializeEvents } from "../../../core/Features/Events";

function FormModal() {
  const dispatch = useDispatch();
  const userData = UserData();

  const { events } = useSelector((store) => store.eventsStore)
  const { isFormModalOpen, selectedForm, isEdit } = useSelector(
    (store) => store.formsStore
  );
  const modalClassName = isFormModalOpen ? "modal fade show" : "modal fade";

  const validateFields = () => {
    const { name, description, deadline } = selectedForm;
    if (!name || !description || !deadline) {
      toast.error("Please fill in all fields.");
      return false;
    }
    return true;
  };

  const handleAddForm = async () => {
    try {
      if (!validateFields()) {
        return;
      }

      const response = await axiosRequest.post("/form/add", {
        ...selectedForm,
        organizerId: userData.id,
      });
      dispatch(addForm(response.data));
      dispatch(toggleFormModal());
      dispatch(resetFormModal());

      toast.success("Form added successfully")

      // Fetch events every time the "Create Form" button is clicked
      const eventsResponse = await axiosRequest.get(
        `/events/get-organizer/${userData.id}`
      );
      initializeEvents(eventsResponse.data.events)
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };

  const handleEditForm = async (formId) => {
    try {
      if (!validateFields()) {
        return;
      }
      const response = await axiosRequest.post(`/form/edit/${formId}`, {
        organizerId: userData.id,
        ...selectedForm,
      });
      dispatch(editForm(response.data.form));
      dispatch(toggleFormModal());
      dispatch(resetFormModal());

      toast.success("Form edited successfully")

    } catch (error) {
      console.error("Error editing form:", error);
    }
  };

  const handleSubmit = () => {
    if (isEdit) {
      handleEditForm(selectedForm.id);
    } else {
      handleAddForm();
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    dispatch(updateSelectedFormField({ id, value }));
  };

  const handleAddField = () => {
    dispatch(addField());
  };

  const handleRemoveField = (index) => {
    dispatch(removeField(index));
  };

  const handleDateChange = (selectedDates) => {
    const selectedDate = selectedDates[0]; // Assuming single date selection
    if (selectedDate) {
      handleInputChange({
        target: {
          id: "deadline",
          value: selectedDate instanceof Date ? selectedDate.toISOString() : "",
        },
      });
    }
  };

  return (
    <>
      {isFormModalOpen && <div className="modal-backdrop fade show"></div>}
      <div
        className={modalClassName}
        id="basicModal"
        tabIndex="-1"
        style={{ display: isFormModalOpen ? "block" : "none" }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel1">
                {isEdit ? "Edit" : "Add"} Form
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  dispatch(resetFormModal());
                  if (isEdit) {
                    console.log("is edit")
                    dispatch(changeFormState(false));
                  }
                  dispatch(toggleFormModal());
                }}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  placeholder="Enter Form Name"
                  value={selectedForm.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  className="form-control"
                  placeholder="Enter Form Description"
                  value={selectedForm.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Deadline</label>
                <Flatpickr
                  id="deadline"
                  value={selectedForm.deadline}
                  options={{
                    enableTime: true,
                    dateFormat: "Y-m-d H:i",
                  }}
                  className="form-control"
                  onChange={handleDateChange}
                />
              </div>

          
              <>
                {selectedForm.data.map((element, index) => (
                  <div className="mb-3" key={index}>
                    <label htmlFor={index} className="form-label">
                      Question {index + 1}:
                    </label>
                    <div className="d-flex">
                      <input
                        type="text"
                        id={`data.${index}`}
                        className="form-control"
                        placeholder={`Enter Question ${index + 1}`}
                        value={element || ""}
                        onChange={(e)=>{
                          const newDataArray = [...selectedForm.data];
                          newDataArray[index] = e.target.value;
                          dispatch(updateData(newDataArray));
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger ms-2"
                        onClick={() => handleRemoveField(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

              </>


              <div className="d-flex justify-content-center mb-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAddField}
                >
                  Add Field
                </button>
              </div>

            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-label-secondary"
                onClick={() => {
                  dispatch(toggleFormModal());
                }}
              >
                Close
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {isEdit ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FormModal;
