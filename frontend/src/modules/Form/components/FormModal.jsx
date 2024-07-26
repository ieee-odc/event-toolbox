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
  switchQuestionType,
  updateQuestionOptions,
  removeOption,
  addOption,
} from "../../../core/Features/Forms";
import { initializeEvents } from "../../../core/Features/Events";
import { useParams } from "react-router-dom";

function FormModal() {
  const dispatch = useDispatch();
  const userData = UserData();
  const { eventId, workshopId } = useParams();

  const { events } = useSelector((store) => store.eventsStore);
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
  const handleOptionChange = (questionIndex, optionIndex, newValue) => {
    const newOptions = [...selectedForm.data[questionIndex].options];
    newOptions[optionIndex] = newValue;
    dispatch(
      updateQuestionOptions({ index: questionIndex, options: newOptions })
    );
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
                    console.log("is edit");
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
                          dispatch(
                            switchQuestionType({
                              index,
                              newType: e.target.value,
                            })
                          );
                        }}
                        tabIndex="-1"
                        value={element.type}
                        aria-hidden="true"
                      >
                        <option value="input">Input</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="radio">Radio</option>
                        <option value="file">File Upload</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="date">Date</option>
                        <option value="time">Time</option>
                      </select>
                      <button
                        type="button"
                        id="deleteButton"
                        className="btn btn-danger mb-2"
                        onClick={() => dispatch(removeField(index))}
                      >
                        Remove
                      </button>
                    </div>

                    {element.options &&
                      element.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="form-check mt-3"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <input
                            name="default-radio-1"
                            className="form-check-input"
                            type="radio"
                            value=""
                            id="defaultRadio1"
                          />
                          <input
                            type="text"
                            id={`data.${index}.options.${optionIndex}`}
                            className="form-control"
                            placeholder={`Enter Option ${optionIndex + 1}`}
                            value={option || ""}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleOptionChange(
                                  index,
                                  optionIndex,
                                  e.target.value
                                );
                              }
                            }}
                            onBlur={(e) =>
                              handleOptionChange(
                                index,
                                optionIndex,
                                e.target.value
                              )
                            }
                          />
                          <button
                            type="button"
                            id="deleteButton"
                            className="btn btn-danger"
                            onClick={() =>
                              dispatch(
                                removeOption({
                                  questionIndex: index,
                                  optionIndex,
                                })
                              )
                            }
                          >
                            Remove Option
                          </button>
                        </div>
                      ))}

                    {element.type !== "input" && element.type !== "file" && (
                      <button
                        type="button"
                        id="addOption"
                        className="btn btn-primary mt-3"
                        onClick={() => dispatch(addOption(index))}
                      >
                        Add Option
                      </button>
                    )}
                  </div>
                ))}
              </>
              <button
                type="button"
                id="addQuestion"
                className="btn btn-primary mt-3"
                onClick={handleAddField}
              >
                Add Question
              </button>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                id="closeButton"
                className="btn me-2 btn-outline-secondary"
                onClick={() => {
                  dispatch(resetFormModal());
                  if (isEdit) {
                    console.log("is edit");
                    dispatch(changeFormState(false));
                  }
                  dispatch(toggleFormModal());
                }}
              >
                Close
              </button>
              <button
                type="button"
                id="saveButton"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FormModal;
