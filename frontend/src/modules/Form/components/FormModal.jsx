import React, { useState, useEffect, useRef } from "react";
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
  switchQuestionType,
  updateQuestionOptions,
  removeOption,
  addOption,
  resetSelectedWorkshops,
  selectAWorkshop,
  removeOneSelectedWorkshop,
} from "../../../core/Features/Forms";
import { initializeEvents } from "../../../core/Features/Events";
import { useParams } from "react-router-dom";

function FormModal() {
  const dispatch = useDispatch();
  const userData = UserData();
  const { eventId, workshopId } = useParams();
  const { workshops } = useSelector((store) => store.workshopsStore);
  const { isFormModalOpen, selectedForm, isEdit, selectedWorkshops } =
    useSelector((store) => store.formsStore);
  const modalClassName = isFormModalOpen ? "modal fade show" : "modal fade";
  const modalRef = useRef(null);
  const flatpickrRef = useRef(null); // Ref for Flatpickr

  const validateFields = () => {
    const { name, description, deadline, data } = selectedForm;
    if (!name || !description || !deadline) {
      toast.error("Please fill in all fields.");
      return false;
    }

    for (let i = 0; i < data.length; i++) {
      const { question, options, type } = data[i];

      if (!question) {
        toast.error(`Please fill in text for Question ${i + 1}.`);
        return false;
      }

      if (
        ["checkbox", "radio", "dropdown", "workshop-selection"].includes(
          type
        ) &&
        (!options || options.length < 2)
      ) {
        toast.error(
          `Please provide at least two options for Question ${i + 1}.`
        );
        return false;
      }
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
        eventId,
      });
      dispatch(addForm(response.data));
      dispatch(toggleFormModal());
      dispatch(resetFormModal());

      toast.success("Form added successfully");

      const eventsResponse = await axiosRequest.get(
        `/events/get-organizer/${userData.id}`
      );
      initializeEvents(eventsResponse.data.events);
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
        ...selectedForm,
        organizerId: userData.id,
        eventId,
      });
      dispatch(editForm(response.data.form));
      dispatch(toggleFormModal());
      dispatch(resetFormModal());

      toast.success("Form edited successfully");
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

  const handleOptionChange = (questionIndex, optionIndex, newValue) => {
    const newOptions = [...selectedForm.data[questionIndex].options];
    newOptions[optionIndex] = newValue;
    dispatch(
      updateQuestionOptions({ index: questionIndex, options: newOptions })
    );
  };

  const handleClickOutside = (event) => {
    const flatpickrNode = flatpickrRef.current?.flatpickr?.calendarContainer;
    if (
      modalRef.current && 
      !modalRef.current.contains(event.target) &&
      flatpickrNode &&
      !flatpickrNode.contains(event.target)
    ) {
      dispatch(toggleFormModal());
      if (isEdit) {
        dispatch(resetFormModal());
      }
    }
  };

  useEffect(() => {
    if (isFormModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFormModalOpen]);

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
        <div className="modal-dialog" role="document" ref={modalRef}>
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
                  ref={flatpickrRef} // Assign the ref directly
                />
              </div>

              <>
                {selectedForm.data.map((element, index) => (
                  <div className="mb-3" key={index}>
                    <label htmlFor={index} className="form-label">
                      Question {index + 1}:
                    </label>
                    <div className="d-flex justify-content-center flex-wrap">
                      <input
                        type="text"
                        id={`data.${index}`}
                        className="form-control me-2 mb-2"
                        placeholder={`Enter Question ${index + 1}`}
                        value={element.question || ""}
                        onChange={(e) => {
                          const newDataArray = [...selectedForm.data];
                          newDataArray[index] = {
                            ...newDataArray[index],
                            question: e.target.value,
                          };
                          dispatch(updateData(newDataArray));
                        }}
                      />
                      <select
                        id="select2_course_select"
                        className="select2 form-select me-2  mb-2"
                        data-placeholder="All Courses"
                        onChange={(e) => {
                          if (
                            e.target.value === "workshop-selection" &&
                            workshops.length < 2
                          ) {
                            toast.error("You should have at least 2 workshops");
                            return;
                          }

                          dispatch(
                            switchQuestionType({
                              index,
                              type: e.target.value,
                            })
                          );
                        }}
                        value={element.type || ""}
                      >
                        <option>Select Type</option>
                        <option value="text">Text</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="radio">Radio</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="workshop-selection">
                          Workshop Selection
                        </option>
                      </select>
                      <button
                        type="button"
                        className="btn btn-danger mb-2"
                        onClick={() => {
                          dispatch(removeField(index));
                        }}
                      >
                        <i className="bx bx-trash"></i>
                      </button>
                    </div>

                    {["checkbox", "radio", "dropdown"].includes(
                      element.type
                    ) &&
                      element.options &&
                      element.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="mb-2 d-flex">
                          <input
                            type="text"
                            className="form-control me-2"
                            placeholder={`Option ${optionIndex + 1}`}
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(
                                index,
                                optionIndex,
                                e.target.value
                              )
                            }
                          />
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                              dispatch(removeOption({ index, optionIndex }));
                            }}
                          >
                            <i className="bx bx-trash"></i>
                          </button>
                        </div>
                      ))}

                    {element.type === "workshop-selection" &&
                      selectedWorkshops.length > 0 && (
                        <>
                          <select
                            id="select2_course_select"
                            className="select2 form-select"
                            data-placeholder="All Courses"
                            onChange={(e) => {
                              const selectedWorkshopId = e.target.value;
                              const selectedWorkshop = workshops.find(
                                (w) => w._id === selectedWorkshopId
                              );

                              if (
                                selectedWorkshop &&
                                selectedWorkshops.find(
                                  (w) => w._id === selectedWorkshopId
                                )
                              ) {
                                toast.error("Workshop already selected.");
                                return;
                              }

                              dispatch(selectAWorkshop(selectedWorkshop));
                            }}
                            value=""
                          >
                            <option>Select a workshop</option>
                            {workshops.map((workshop) => (
                              <option key={workshop._id} value={workshop._id}>
                                {workshop.title}
                              </option>
                            ))}
                          </select>

                          <ul className="list-group mt-2">
                            {selectedWorkshops.map((workshop) => (
                              <li
                                key={workshop._id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                              >
                                {workshop.title}
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() => {
                                    dispatch(
                                      removeOneSelectedWorkshop(workshop._id)
                                    );
                                  }}
                                >
                                  <i className="bx bx-trash"></i>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    <button
                      type="button"
                      className="btn btn-primary mt-3"
                      onClick={() => dispatch(addOption({ index }))}
                    >
                      Add Option
                    </button>
                  </div>
                ))}
              </>

              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={handleAddField}
              >
                Add Question
              </button>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
                onClick={() => {
                  dispatch(resetFormModal());
                  if (isEdit) {
                    dispatch(changeFormState(false));
                  }
                  dispatch(toggleFormModal());
                }}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                {isEdit ? "Edit" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FormModal;
