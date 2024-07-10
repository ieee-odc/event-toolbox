import React from "react";
import "../Form.css";
import toast from "react-hot-toast";
import Flatpickr from "react-flatpickr";
import { useDispatch, useSelector } from "react-redux";
import axiosRequest from "../../../utils/AxiosConfig";
import { UserData } from "./../../../utils/UserData";
import {
  addForm,
  //   changeFormState,
  editForm,
  //   resetFormModal,
  toggleFormModal,
  updateSelectedFormField,
  //   removeField,
} from "../../../core/Features/Forms";

function FormModal() {
  const dispatch = useDispatch();
  //   console.log({ isFormModalOpen });
  const userData = UserData();
  const { isFormModalOpen, selectedForm, isEdit } = useSelector(
    (store) => store.formsStore
  );
  const modalClassName = isFormModalOpen ? "modal fade show" : "modal fade";
  const validateFields = () => {
    const { name, description } = selectedForm;
    if (!name || !description) {
      {
        /* ADD EVENTID & DEADLINE LATER */
      }
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
      //   dispatch(
      //     updateSelectedEventField({
      //       organizerId: userData.id,
      //       name: "",
      //       description: "",
      //       location: "",
      //       startDate: "",
      //       endDate: "",
      //     })
      //   );
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  //   const handleEditEvent = async (eventId) => {
  //     try {
  //       if (!validateFields()) {
  //         return;
  //       }
  //       const response = await axiosRequest.post(`/events/edit/${eventId}`, {
  //         organizerId: userData.id,
  //         ...selectedEvent,
  //       });
  //       console.log(response.data.event);
  //       dispatch(editEvent(response.data.event));
  //       dispatch(toggleEventModal());
  //       dispatch(
  //         updateSelectedEventField({
  //           organizerId: userData.id,
  //           name: "",
  //           description: "",
  //           location: "",
  //           startDate: "",
  //           endDate: "",
  //         })
  //       );
  //     } catch (error) {
  //       console.error("Error creating event:", error);
  //     }
  //   };

  const handleSubmit = () => {
    handleAddForm();
    // if (isEdit) {
    //   handleEditEvent(selectedEvent.id);
    // } else {
    //   handleAddEvent();
    // }
  };

  const handleInputChange = (e) => {
    const payload = e.target;
    dispatch(updateSelectedFormField({ id: payload.id, value: payload.value }));
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
                  //   dispatch(resetFormModal());
                  if (isEdit) {
                    dispatch(changeFormState(false));
                  }
                  dispatch(toggleFormModal());
                }}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* {!isEditMode && <div className="mb-3"></div>} */}
              <div className="mb-3"></div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
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
                  //   value={selectedDateTime}
                  //   onChange={handleDateChange}
                  options={{
                    enableTime: true,
                    dateFormat: "Y-m-d H:i",
                    minDate: selectedForm.startDate,
                    maxDate: selectedForm.endDate
                      ? new Date(
                          eventDates.endDate.getFullYear(),
                          eventDates.endDate.getMonth(),
                          eventDates.endDate.getDate(),
                          23,
                          59,
                          59,
                          999
                        )
                      : null,
                  }}
                  className="form-control"
                />
              </div>

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
                      value={newEvent.data[key] || ""}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      className="btn btn-danger ms-2"
                      // onClick={() => removeField(key)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary"
                // onClick={addField}
              >
                {/*  removeField: (state, action) => {
      const fieldName = action.payload;
      const { [fieldName]: _, ...newData } = state.currentForm.data;
      state.currentForm.data = newData;
    }, */}
                Add Field
              </button>
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
