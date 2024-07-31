import React, { useState, useEffect, useRef } from "react";
import axiosRequest from "../../../utils/AxiosConfig";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { UserData } from "./../../../utils/UserData";
import {
  addWorkshop,
  editWorkshop,
  resetWorkshopModal,
  toggleWorkshopModal,
  updateSelectedWorkshopField,
} from "../../../core/Features/Workshops";
import { initializeSpaces } from "../../../core/Features/Spaces";
import { useParams } from "react-router-dom";

function WorkshopModal() {
  const { eventId } = useParams();
  const { selectedWorkshop, isModalOpen, isEdit } = useSelector(
    (state) => state.workshopsStore
  );
  const { spaces } = useSelector((state) => state.spacesStore);
  const dispatch = useDispatch();
  const userData = UserData();

  const [selectedSpace, setSelectedSpace] = useState(null);
  const [attendees, setAttendees] = useState(0);
  const [capacityMessage, setCapacityMessage] = useState("");
  const [isFormComplete, setIsFormComplete] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    axiosRequest.get(`/space/get-event/${eventId}`).then((res) => {
      dispatch(initializeSpaces(res.data.spaces));
      if (res.data.spaces.length > 0) {
        dispatch(
          updateSelectedWorkshopField({
            id: "spaceId",
            value: res.data.spaces[0].id,
          })
        );
        setSelectedSpace(res.data.spaces[0]);
      }
    });
  }, [dispatch, eventId]);

  useEffect(() => {
    if (selectedSpace && attendees) {
      if (attendees > selectedSpace.capacity) {
        setCapacityMessage(
          "The selected space does not have enough capacity for the attendees."
        );
      } else {
        setCapacityMessage("The selected space has enough capacity.");
      }
    } else {
      setCapacityMessage("");
    }
  }, [selectedSpace, attendees]);

  useEffect(() => {
    const allFieldsFilled =
      selectedWorkshop.name &&
      selectedWorkshop.description &&
      selectedWorkshop.spaceId &&
      selectedWorkshop.date &&
      selectedWorkshop.startTime &&
      selectedWorkshop.endTime &&
      attendees > 0 &&
      selectedSpace &&
      attendees <= selectedSpace.capacity;

    setIsFormComplete(allFieldsFilled);
  }, [
    selectedWorkshop.name,
    selectedWorkshop.description,
    selectedWorkshop.spaceId,
    selectedWorkshop.date,
    selectedWorkshop.startTime,
    selectedWorkshop.endTime,
    attendees,
    selectedSpace,
  ]);

  const validateTime = (value, length) => {
    if (length === 1) {
      return value === "0" || value === "1" || value === "2";
    } else if (length === 3) {
      const firstChar = value.charAt(0);
      if (firstChar === "2") {
        const secondChar = value.charAt(1);
        return (
          secondChar === "0" ||
          secondChar === "1" ||
          secondChar === "2" ||
          secondChar === "3"
        );
      }
    } else if (length === 4) {
      const minutesFirstChar = value.charAt(3);
      return ["0", "1", "2", "3", "4", "5"].includes(minutesFirstChar);
    } else if (length === 5) {
      const minutesSecondChar = value.charAt(4);
      return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(
        minutesSecondChar
      );
    }
    return true;
  };

  const handleChangeTime = (field, value, dispatch, selectedWorkshopField) => {
    let isDelete = selectedWorkshopField.length > value.length;
    if (isDelete) {
      dispatch(
        updateSelectedWorkshopField({
          id: field,
          value: value,
        })
      );
      return;
    }

    if (value.length >= 6) {
      return;
    }
    if (value.length === 2) {
      value += ":";
    }

    if (!validateTime(value, value.length)) {
      return;
    }

    dispatch(
      updateSelectedWorkshopField({
        id: field,
        value: value,
      })
    );
  };

  const handleChangeStartTime = (e) => {
    handleChangeTime(
      "startTime",
      e.target.value,
      dispatch,
      selectedWorkshop.startTime
    );
  };

  const handleChangeEndTime = (e) => {
    handleChangeTime(
      "endTime",
      e.target.value,
      dispatch,
      selectedWorkshop.endTime
    );
  };

  const handleAddWorkshop = () => {
    if (attendees > selectedSpace.capacity) {
      toast.error("Number of attendees exceeds the space capacity.");
      return;
    }
    const startDate = new Date(selectedWorkshop.date);
    const [startHours, startMinutes] = selectedWorkshop.startTime.split(":");
    startDate.setHours(parseInt(startHours, 10));
    startDate.setMinutes(parseInt(startMinutes, 10));

    const endDate = new Date(selectedWorkshop.date);
    const [endHours, endMinutes] = selectedWorkshop.endTime.split(":");
    endDate.setHours(parseInt(endHours, 10));
    endDate.setMinutes(parseInt(endMinutes, 10));

    const reqBody = {
      organizerId: userData.id,
      name: selectedWorkshop.name,
      description: selectedWorkshop.description,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      spaceId: selectedWorkshop.spaceId,
      eventId,
      attendees,
    };
    axiosRequest
      .post("/workshop/add", reqBody)
      .then((res) => {
        toast.success("Successfully created!");
        dispatch(toggleWorkshopModal());
        resetAttendees();
        dispatch(addWorkshop(res.data.workshop));
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to add workshop");
      });
  };

  const handleEditWorkshop = () => {
    if (attendees > selectedSpace.capacity) {
      toast.error("Number of attendees exceeds the space capacity.");
      return;
    }
    const startDate = new Date(selectedWorkshop.date);
    const [startHours, startMinutes] = selectedWorkshop.startTime.split(":");
    startDate.setHours(parseInt(startHours, 10));
    startDate.setMinutes(parseInt(startMinutes, 10));

    const endDate = new Date(selectedWorkshop.date);
    const [endHours, endMinutes] = selectedWorkshop.endTime.split(":");
    endDate.setHours(parseInt(endHours, 10));
    endDate.setMinutes(parseInt(endMinutes, 10));

    const reqBody = {
      organizerId: userData.id,
      name: selectedWorkshop.name,
      description: selectedWorkshop.description,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      spaceId: selectedWorkshop.spaceId,
      eventId,
      attendees,
    };

    axiosRequest
      .post(`/workshop/edit/${selectedWorkshop.id}`, reqBody)
      .then((res) => {
        toast.success("Successfully Edited!");
        dispatch(toggleWorkshopModal());
        resetAttendees();
        dispatch(editWorkshop(res.data.workshop));
      })
      .catch((err) => {
        toast.error("Failed to edit workshop");
      });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "attendees") {
      setAttendees(value);
    } else {
      dispatch(updateSelectedWorkshopField({ id, value }));
      if (id === "spaceId") {
        const selected = spaces.find((space) => space.id === Number(value));
        if (selected) {
          setSelectedSpace(selected);
        } else {
          console.error("Selected space not found or spaces array is empty.", {
            value,
            spaces,
          });
        }
      }
    }
  };

  const handleDateChange = (date) => {
    dispatch(updateSelectedWorkshopField({ id: "date", value: date }));
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      dispatch(toggleWorkshopModal());
      resetAttendees();
      if (isEdit) {
        dispatch(resetWorkshopModal());
      }
    }
  };

  const resetAttendees = () => {
    setAttendees(0);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      resetAttendees();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <>
      {isModalOpen && <div className="modal-backdrop fade show"></div>}

      {isModalOpen && (
        <div
          className="modal fade show"
          id="modalCenter"
          tabIndex={-1}
          style={{ display: "block" }}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            ref={modalRef}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalCenterTitle">
                  {isEdit ? "Edit" : "Add"} Workshop
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    dispatch(toggleWorkshopModal());
                    resetAttendees();
                    if (isEdit) {
                      dispatch(resetWorkshopModal());
                    }
                  }}
                />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col mb-3">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      value={selectedWorkshop.name}
                      onChange={handleInputChange}
                      type="text"
                      id="name"
                      className="form-control"
                      placeholder="Enter Name"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col mb-3">
                    <label htmlFor="nameWithTitle" className="form-label">
                      Description
                    </label>
                    <div className="input-group input-group-merge form-send-message">
                      <textarea
                        value={selectedWorkshop.description}
                        onChange={handleInputChange}
                        className="form-control message-input"
                        placeholder="Enter Description"
                        id="description"
                        rows="2"
                        style={{
                          maxHeight: "120px",
                        }}
                      ></textarea>
                      <span className="message-actions input-group-text">
                        <i className="bx bx-bot cursor-pointer speech-to-text"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col mb-3">
                    <label htmlFor="emailWithTitle" className="form-label">
                      Space
                    </label>
                    <select
                      id="spaceId"
                      className="select2 form-select form-select-md select2-hidden-accessible"
                      data-allow-clear="true"
                      data-select2-id="select2Basic"
                      tabIndex={-1}
                      aria-hidden="true"
                      value={selectedWorkshop.spaceId}
                      onChange={handleInputChange}
                    >
                      {spaces.map((space) => (
                        <option key={space.id} value={space.id}>
                          {space.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col mb-3">
                    <label htmlFor="spaceCapacity" className="form-label">
                      Capacity
                    </label>
                    <input
                      type="text"
                      id="spaceCapacity"
                      className="form-control"
                      value={selectedSpace ? selectedSpace.capacity : ""}
                      readOnly
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col mb-3">
                    <label htmlFor="attendees" className="form-label">
                      Number of Attendees
                    </label>
                    <input
                      type="number"
                      id="attendees"
                      className="form-control"
                      value={attendees}
                      onChange={handleInputChange}
                      placeholder="Enter number of attendees"
                    />
                    {capacityMessage && (
                      <p
                        className={`mt-2 ${
                          attendees > selectedSpace?.capacity
                            ? "text-danger"
                            : "text-success"
                        }`}
                      >
                        {capacityMessage}
                      </p>
                    )}
                  </div>
                </div>
                <div className="row mb-3 g-2">
                  <div className="col mb-0">
                    <label htmlFor="start-time" className="form-label">
                      Start Time
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="startTime"
                      placeholder="HH:MM"
                      value={selectedWorkshop.startTime}
                      onChange={handleChangeStartTime}
                    />
                  </div>
                  <div className="col mb-0">
                    <label htmlFor="end-time" className="form-label">
                      End Time
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="endTime"
                      placeholder="HH:MM"
                      value={selectedWorkshop.endTime}
                      onChange={handleChangeEndTime}
                    />
                  </div>
                </div>
                <div className="row">
                  <div
                    className="col mb-3"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <label htmlFor="nameWithTitle" className="form-label">
                      Date
                    </label>
                    <DatePicker
                      selected={selectedWorkshop.date}
                      onChange={handleDateChange}
                      dateFormat="dd/MM/yyyy"
                      locale="en"
                      placeholderText="Choose a date"
                      minDate={new Date()}
                      type="date"
                      id="nameWithTitle"
                      className="form-control"
                      placeholder="Enter Name"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-label-secondary me-2"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    dispatch(toggleWorkshopModal());
                    resetAttendees();
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={isEdit ? handleEditWorkshop : handleAddWorkshop}
                  disabled={!isFormComplete}
                >
                  {isEdit ? "Save Changes" : "Create Workshop"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WorkshopModal;
