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
  const flatpickrRef = useRef();

  const dispatch = useDispatch();
  const userData = UserData();
  const { eventId, workshopId } = useParams();
  const { workshops } = useSelector((store) => store.workshopsStore);
  const {
    isFormModalOpen,
    selectedForm,
    isEdit,
    selectedWorkshops,
    optionsArray,
  } = useSelector((store) => store.formsStore);
  const modalClassName = isFormModalOpen ? "modal fade show" : "modal fade";
  const modalRef = useRef(null);

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

      if (optionsArray.includes(type)) {
        if (
          !options ||
          options.length < 2 ||
          options.some((option) => option === "")
        ) {
          toast.error(
            `Please provide at least two valid options for Question ${i + 1}.`
          );
          return false;
        }
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
      handleEditForm(selectedForm?.id);
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
    const newOptions = [...selectedForm?.data[questionIndex].options];
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
                  value={selectedForm?.name}
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
                  value={selectedForm?.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Deadline</label>
                <Flatpickr
                  ref={flatpickrRef}
                  id="deadline"
                  value={selectedForm?.deadline}
                  options={{
                    enableTime: true,
                    dateFormat: "Y-m-d H:i",
                  }}
                  className="form-control"
                  onChange={handleDateChange}
                />
              </div>
              <div className="mb-3" id="pre-set-q-container">
                <label className="form-label mb-2">Base Questions:</label>
                <div className="mb-1  ">
                  <input
                    type="text"
                    id="fullName"
                    style={{
                      cursor: "not-allowed",
                      opacity: "0.9",
                      backgroundColor: "rgb(211, 211, 211, 0.6)"
                    }}
                    className="form-control m-0"
                    value="Full Name"
                    readOnly
                  /></div>
                <div className="mb-1">
                  <input
                    type="text"
                    id="fullName"

                    style={{
                      cursor: "not-allowed",
                      opacity: "0.9",
                      backgroundColor: "rgb(211, 211, 211, 0.6)"
                    }}
                    className="form-control"
                    value="Email"
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    id="fullName"

                    style={{
                      cursor: "not-allowed",
                      opacity: "0.9",
                      backgroundColor: "rgb(211, 211, 211, 0.6)"
                    }}
                    className="form-control"
                    value="Phone Number"
                    readOnly
                  />
                </div>
              </div>
              <>
                {selectedForm?.data.map((element, index) => (
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
                          const newDataArray = [...selectedForm?.data];
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
                            toast.error("You should have at least 2 sessions");
                            return;
                          }

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
                        <option value="workshop-selection">
                          Session selection
                        </option>
                      </select>
                      <button
                        type="button"
                        id="deleteButton"
                        className="btn btn-danger mb-2"
                        onClick={() => {
                          if (element.type === "workshop-selection") {
                            dispatch(resetSelectedWorkshops());
                          }
                          dispatch(removeField(index));
                        }}
                      >
                        Remove
                      </button>
                    </div>

                    {element.type !== "workshop-selection" &&
                      element.options &&
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
                            id="deleteButton"
                            className="btn btn-danger"
                            onClick={() => {
                              dispatch(
                                removeOption({
                                  questionIndex: index,
                                  optionIndex,
                                })
                              );
                            }}
                          >
                            Remove Option
                          </button>
                        </div>
                      ))}

                    {element.type === "workshop-selection" &&
                      element.options &&
                      element.options.map((option, optionIndex) => {
                        const currentWorkshop = workshops.find((workshop) => {
                          return workshop.id.toString() === option;
                        });
                        return (
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
                              readOnly
                            />
                            <input
                              type="text"
                              id={`data.${index}.options.${optionIndex}`}
                              className="form-control"
                              placeholder={`Enter Option ${optionIndex + 1}`}
                              value={currentWorkshop?.name || ""}
                              readOnly
                            />
                            <button
                              type="button"
                              id="deleteButton"
                              className="btn btn-danger"
                              onClick={() => {
                                dispatch(
                                  removeOption({
                                    questionIndex: index,
                                    optionIndex,
                                  })
                                );
                                dispatch(removeOneSelectedWorkshop(option));
                              }}
                            >
                              Remove Option
                            </button>
                          </div>
                        );
                      })}

                    {element.type === "workshop-selection" &&
                      selectedWorkshops.length !== workshops.length && (
                        <select
                          id="select2_course_select"
                          className="select2 form-select me-2  mb-2"
                          data-placeholder="All Courses"
                          onChange={(e) => {
                            dispatch(selectAWorkshop(e.target.value));

                            dispatch(
                              addOption({
                                index,
                                value: e.target.value,
                              })
                            );
                          }}
                          tabIndex="-1"
                          value={element.type}
                          aria-hidden="true"
                        >
                          <option value={-1}>Select Session</option>
                          {workshops &&
                            workshops.map((workshop) => {
                              if (
                                !selectedWorkshops.includes(
                                  workshop.id.toString()
                                )
                              ) {
                                return (
                                  <option value={workshop.id}>
                                    {workshop.name}
                                  </option>
                                );
                              } else {
                                return;
                              }
                            })}
                        </select>
                      )}

                    {optionsArray.includes() && (
                      <button
                        type="button"
                        id="addOption"
                        className="btn btn-primary mt-3"
                        onClick={() =>
                          dispatch(
                            addOption({
                              index,
                              value: "",
                            })
                          )
                        }
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
      </div >
    </>
  );
}

export default FormModal;
