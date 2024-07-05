import React, { useState, useRef } from "react";
import axiosRequest from "../../../utils/AxiosConfig";
import toast from "react-hot-toast";
import Flatpickr from "react-flatpickr";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
function WorkshopModal({ isModalOpen, setIsModalOpen, setWorkshops }) {
  const [eventId, setEventId] = useState("1"); // set the first event id after fetching it

  const [name, setName] = useState(""); // set the first event id after fetching it
  const [description, setDescription] = useState(""); // set the first event id after fetching it
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState("");


  const handleChangeStartTime = (e) => {
    handleChangeTime(e, startTime, setStartTime);
  };

  const handleChangeTime = (e, time, setTime) => {
    let value = e.target.value;

    let isDelete = time.length > value.length;
    if (isDelete) {
      setTime(value);
      return;
    }

    if (value.length >= 6) {
      return;
    }
    if (value.length === 2) {
      value += ":";
    }

    // Handle hours
    if (value.length === 1) {
      if (value !== "0" && value !== "1" && value !== "2") {
        return;
      }
    } else if (value.length === 3) {
      const firstChar = value.charAt(0);
      if (firstChar === "2") {
        if (
          value.charAt(1) !== "0" &&
          value.charAt(1) !== "1" &&
          value.charAt(1) !== "2" &&
          value.charAt(1) !== "3"
        ) {
          return;
        }
      }
    }

    if (value.length === 4) {
      const minutesFirstChar = value.charAt(3);
      if (
        minutesFirstChar !== "0" &&
        minutesFirstChar !== "1" &&
        minutesFirstChar !== "2" &&
        minutesFirstChar !== "3" &&
        minutesFirstChar !== "4" &&
        minutesFirstChar !== "5"
      ) {
        return;
      }
    } else if (value.length === 5) {
      const minutesFirstChar = value.charAt(4);
      if (
        minutesFirstChar !== "0" &&
        minutesFirstChar !== "1" &&
        minutesFirstChar !== "2" &&
        minutesFirstChar !== "3" &&
        minutesFirstChar !== "4" &&
        minutesFirstChar !== "5" &&
        minutesFirstChar !== "6" &&
        minutesFirstChar !== "7" &&
        minutesFirstChar !== "8" &&
        minutesFirstChar !== "9"
      ) {
        return;
      }
    }

    // If all validations pass, update the startTime state
    setTime(value);
  };

  const handleChangeEndTime = (e) => {
    handleChangeTime(e, endTime, setEndTime);
  };

  const handleAddWorkshop = () => {
    const reqBody = {
      email,
      fullName,
      eventId,
    };
    axiosRequest
      .post("/workshop/add", reqBody)
      .then((res) => {
        toast.success("Successfully created!");
        console.log(res.data);
        setIsModalOpen(false);
        setWorkshops((workshops) => [...workshops, res.data.workshop]);
      })
      .catch((err) => {
        toast.error("Failed to add workshop");
      });
  };

  return (
    isModalOpen && (
      <div
        className="modal fade show"
        id="modalCenter"
        tabIndex={-1}
        style={{ display: "block" }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalCenterTitle">
                Add Workshop
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setIsModalOpen(false)}
              />
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col mb-3">
                  <label htmlFor="nameWithTitle" className="form-label">
                    Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    id="nameWithTitle"
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
                  <div class="input-group input-group-merge form-send-message">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      class="form-control message-input"
                      placeholder="Enter Description"
                      rows="2"
                    ></textarea>
                    <span class="message-actions input-group-text">
                      <i class="bx bx-bot cursor-pointer speech-to-text"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="row mb-3 g-2">
                <div className="col mb-0">
                  <label htmlFor="emailWithTitle" className="form-label">
                    Space
                  </label>
                  <select
                    id="select2Basic"
                    className="select2 form-select form-select-md select2-hidden-accessible"
                    data-allow-clear="true"
                    data-select2-id="select2Basic"
                    tabIndex={-1}
                    aria-hidden="true"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                  >
                    <option value="1" data-select2-id={2}>
                      Room 1
                    </option>
                    <option value="2" data-select2-id={54}>
                      Room 2
                    </option>
                    <option value="3" data-select2-id={55}>
                      Room 3
                    </option>
                  </select>
                </div>
                <div className="col mb-0">
                  <label htmlFor="emailWithTitle" className="form-label">
                    Event
                  </label>
                  <select
                    id="select2Basic"
                    className="select2 form-select form-select-md select2-hidden-accessible"
                    data-allow-clear="true"
                    data-select2-id="select2Basic"
                    tabIndex={-1}
                    aria-hidden="true"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                  >
                    <option value="1" data-select2-id={2}>
                      Alaska
                    </option>
                    <option value="2" data-select2-id={54}>
                      Hawaii
                    </option>
                    <option value="3" data-select2-id={55}>
                      California
                    </option>
                  </select>
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
                    id="start-time"
                    placeholder="HH:MM"
                    value={startTime}
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
                    id="start-time"
                    placeholder="HH:MM"
                    value={endTime}
                    onChange={handleChangeEndTime}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col mb-3" style={{display:"flex",flexDirection:"column"}}>
                  <label htmlFor="nameWithTitle" className="form-label">
                    Date
                  </label>
                  <DatePicker
                    selected={date}
                    onChange={(date) => setDate(date)}
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
                className="btn btn-label-secondary"
                data-bs-dismiss="modal"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddWorkshop}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default WorkshopModal;
