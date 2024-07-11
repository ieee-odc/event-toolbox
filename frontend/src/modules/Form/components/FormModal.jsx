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
} from "../../../core/Features/Forms";

function FormModal() {
  const dispatch = useDispatch();
  const userData = UserData();
  const [events, setEvents] = useState([]);
  const { isFormModalOpen, selectedForm, isEdit } = useSelector(
    (store) => store.formsStore
  );
  const modalClassName = isFormModalOpen ? "modal fade show" : "modal fade";
  const [newFieldKey, setNewFieldKey] = useState("");
  const [showDynamicFields, setShowDynamicFields] = useState(false);

  // Fetch user's events on component mount
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await axiosRequest.get(
          `/events/get-organizer/${userData.id}`
        );
        setEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    fetchEvents();
  }, [userData.id]);

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
      const response = await axiosRequest.post("/forms/add", {
        ...selectedForm,
        organizerId: userData.id,
      });
      dispatch(addForm(response.data));
      dispatch(toggleFormModal());
      dispatch(
        updateSelectedFormField({
          organizerId: userData.id,
          name: "",
          description: "",
          deadline: "",
          data: {},
        })
      );

      // Fetch events every time the "Create Form" button is clicked
      const eventsResponse = await axiosRequest.get(
        `/events/get-organizer/${userData.id}`
      );
      setEvents(eventsResponse.data.events);
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };

  const handleEditForm = async (formId) => {
    try {
      if (!validateFields()) {
        return;
      }
      const response = await axiosRequest.post(`/forms/edit/${formId}`, {
        organizerId: userData.id,
        ...selectedForm,
      });
      dispatch(editForm(response.data.form));
      dispatch(toggleFormModal());
      dispatch(
        updateSelectedFormField({
          organizerId: userData.id,
          name: "",
          deadline: "",
          description: "",
          data: {},
        })
      );
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
    if (!showDynamicFields) {
      setShowDynamicFields(true);
      return;
    }
    if (newFieldKey && !selectedForm.data[newFieldKey]) {
      dispatch(addField({ key: newFieldKey, value: "" }));
      setNewFieldKey("");
    } else {
      toast.error("Field key is empty or already exists.");
    }
  };

  const handleRemoveField = (key) => {
    dispatch(removeField(key));
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

              <div className="mb-3">
                <label htmlFor="event" className="form-label">
                  Event
                </label>
                <select
                  id="event"
                  className="form-select"
                  value={selectedForm.event}
                  onChange={handleInputChange}
                >
                  <option value="">Select Event</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </select>
              </div>

              {showDynamicFields && (
                <>
                  {Object.keys(selectedForm.data || {}).map((key) => (
                    <div className="mb-3" key={key}>
                      <label htmlFor={key} className="form-label">
                        {key}
                      </label>
                      <div className="d-flex">
                        <input
                          type="text"
                          id={`data.${key}`}
                          className="form-control"
                          placeholder={`Enter ${key}`}
                          value={selectedForm.data[key] || ""}
                          onChange={handleInputChange}
                        />
                        <button
                          type="button"
                          className="btn btn-danger ms-2"
                          onClick={() => handleRemoveField(key)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="d-flex mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="New Field Key"
                      value={newFieldKey}
                      onChange={(e) => setNewFieldKey(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary ms-2"
                      onClick={handleAddField}
                    >
                      Add Field
                    </button>
                  </div>
                </>
              )}
              {!showDynamicFields && (
                <div className="d-flex justify-content-center mb-3">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleAddField}
                  >
                    Add Field
                  </button>
                </div>
              )}
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
