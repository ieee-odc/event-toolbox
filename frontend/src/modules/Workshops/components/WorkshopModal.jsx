import React, { useState, useEffect, useRef } from "react";
import axiosRequest from "../../../utils/AxiosConfig";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import Flatpickr from "react-flatpickr";

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
import { useParams } from "react-router-dom";

function WorkshopModal() {
  const { eventId } = useParams();
  const { selectedWorkshop, isModalOpen, isEdit } = useSelector(
    (state) => state.workshopsStore
  );
  const { spaces } = useSelector((state) => state.spacesStore);
  const flatpickrRefStart = useRef(null);
  const flatpickrRefEnd = useRef(null);
  const flatpickrRefDate = useRef(null);
  const [selectedSpace, setSelectedSpace] = useState();
  const dispatch = useDispatch();
  const userData = UserData();
  const [priceEnabled, setPriceEnabled] = useState(false);
  const [capacityMessage, setCapacityMessage] = useState("");
  const [isFormComplete, setIsFormComplete] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    dispatch(
      updateSelectedWorkshopField({
        id: "spaceId",
        value: spaces[0]?.id,
      })
    );
  }, [spaces]);

  useEffect(() => {
    if (selectedWorkshop.spaceId) {
      setSelectedSpace(
        spaces.find((space) => space.id == selectedWorkshop.spaceId)
      );
    }
  }, [selectedWorkshop.spaceId]);
  const prevAttendeesRef = useRef(selectedWorkshop.numberOfAttendees);
  useEffect(() => {
    if (prevAttendeesRef.current !== selectedWorkshop.numberOfAttendees && selectedWorkshop.numberOfAttendees !== "") {
      if (selectedWorkshop.numberOfAttendees > selectedSpace?.capacity) {
        setCapacityMessage(
          "The selected space does not have enough capacity for the attendees."
        );
      } else {
        setCapacityMessage("The selected space has enough capacity.");
      }
    } else {
      setCapacityMessage("");
    }
    prevAttendeesRef.current = selectedWorkshop.numberOfAttendees;
  }, [selectedWorkshop.numberOfAttendees, selectedSpace]);

  useEffect(() => {
    const allFieldsFilled =
      selectedWorkshop.name &&
      selectedWorkshop.description &&
      selectedWorkshop.spaceId &&
      selectedWorkshop.date &&
      selectedWorkshop.startTime &&
      selectedWorkshop.endTime &&
      selectedWorkshop.numberOfAttendees > 0 &&
      selectedWorkshop.spaceId &&
      (priceEnabled ? selectedWorkshop.price && selectedWorkshop.price > 0 : true);
    setIsFormComplete(allFieldsFilled);
  }, [
    selectedWorkshop.name,
    selectedWorkshop.description,
    selectedWorkshop.spaceId,
    selectedWorkshop.date,
    selectedWorkshop.startTime,
    selectedWorkshop.endTime,
    selectedWorkshop.numberOfAttendees,
    selectedWorkshop.space,
    selectedWorkshop.price,
    priceEnabled
  ]);

  const handleWorkshop = () => {
    if (selectedWorkshop.numberOfAttendees > selectedSpace?.capacity) {
      toast.error("Number of attendees exceeds the space capacity.");
      return;
    }

    const startDate = new Date(selectedWorkshop.date);
    const [startHours, startMinutes] = selectedWorkshop.startTime
      .split("T")[1]
      .split(":");
    startDate.setHours(parseInt(startHours, 10));
    startDate.setMinutes(parseInt(startMinutes, 10));

    const endDate = new Date(selectedWorkshop.date);
    const [endHours, endMinutes] = selectedWorkshop.endTime
      .split("T")[1]
      .split(":");
    endDate.setHours(parseInt(endHours, 10));
    endDate.setMinutes(parseInt(endMinutes, 10));

    if (startDate >= endDate) {
      toast.error("Start time must be before end time.");
      return;
    }

    const reqBody = {
      organizerId: userData.id,
      name: selectedWorkshop.name,
      description: selectedWorkshop.description,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      spaceId: selectedWorkshop.spaceId,
      eventId,
      numberOfAttendees: selectedWorkshop.numberOfAttendees,
      price: priceEnabled ? parseFloat(selectedWorkshop.price) : 0,
      status: priceEnabled ? "paid" : "free",
    };

    const url = isEdit
      ? `/workshop/edit/${selectedWorkshop.id}`
      : "/workshop/add";

    axiosRequest
      .post(url, reqBody)
      .then((res) => {
        toast.success(
          `Workshop Successfully ${isEdit ? "edited" : "created"}!`
        );
        dispatch(toggleWorkshopModal());
        if (isEdit) {
          dispatch(editWorkshop(res.data.workshop));
        } else {
          dispatch(addWorkshop(res.data.workshop));
        }
      })
      .catch((err) => {
        toast.error(`Failed to ${isEdit ? "edit" : "add"} workshop`);
      });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    dispatch(updateSelectedWorkshopField({ id, value }));
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setPriceEnabled(value === "paid");
    dispatch(updateSelectedWorkshopField({ id: "status", value }));
    if (value === "free") {
      dispatch(updateSelectedWorkshopField({ id: "price", value: "Free" }));
    }
  };
  const handleClickOutside = (event) => {
    const flatpickrNodeStart =
      flatpickrRefStart.current?.flatpickr?.calendarContainer;
    const flatpickrNodeEnd =
      flatpickrRefEnd.current?.flatpickr?.calendarContainer;
    const flatpickrNodeDate =
      flatpickrRefDate.current?.flatpickr?.calendarContainer;
    if (
      modalRef.current &&
      !modalRef.current.contains(event.target) &&
      flatpickrNodeStart &&
      !flatpickrNodeStart.contains(event.target) &&
      flatpickrNodeEnd &&
      !flatpickrNodeEnd.contains(event.target) &&
      flatpickrNodeDate &&
      !flatpickrNodeDate.contains(event.target)
    ) {
      dispatch(toggleWorkshopModal());
      if (isEdit) {
        dispatch(toggleWorkshopModal());
      }
    }
  };


  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
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
                  {isEdit ? "Edit" : "Add"} Session
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    dispatch(toggleWorkshopModal());
                    dispatch(resetWorkshopModal());
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
                <div className="grid-container-1">
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
                      value={selectedSpace?.capacity}

                      style={{
                        cursor: 'not-allowed',
                      }}
                      readOnly
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col mb-2">
                    <label htmlFor="numberOfAttendees" className="form-label">
                      Number of Attendees
                    </label>
                    <input
                      type="number"
                      id="numberOfAttendees"
                      className="form-control"
                      value={selectedWorkshop.numberOfAttendees}
                      onChange={handleInputChange}
                      placeholder="Enter number of attendees"
                    />
                    {capacityMessage && (
                      <p
                        className={`mt-2 ${selectedWorkshop.numberOfAttendees >
                          selectedSpace?.capacity
                          ? "text-danger"
                          : "text-success"
                          }`}
                      >
                        {capacityMessage}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid-container-2">
                  <div className="col mb-3">
                    <label htmlFor="emailWithTitle" className="form-label">
                      Status
                    </label>
                    <select
                      id="price"
                      className="select2 form-select form-select-md select2-hidden-accessible"
                      data-allow-clear="true"
                      data-select2-id="select2Basic"
                      tabIndex={-1}
                      aria-hidden="true"
                      value={selectedWorkshop.status}
                      onChange={handleStatusChange}

                    >
                      <option value="free">Free</option>
                      <option value="paid">Paid</option>

                    </select>
                  </div>
                  <div className="col mb-3">
                    <label htmlFor="spaceCapacity" className="form-label">
                      Price (TND)
                    </label>
                    <input
                      value={priceEnabled ? selectedWorkshop.price : "free"}
                      onChange={handleInputChange}
                      type="number"
                      id="price"
                      className="form-control"
                      disabled={!priceEnabled}
                      placeholder="Enter Price"
                    />
                  </div>
                </div>
                <div className="grid-container-2 mb-3">
                  <div className="col mb-0">
                    <label htmlFor="start-time" className="form-label">
                      Start Time
                    </label>
                    <Flatpickr
                      id={"startTime"}
                      value={selectedWorkshop.startTime}
                      ref={flatpickrRefStart}
                      onChange={(time) => {
                        const myType = time[0].toISOString();
                        dispatch(
                          updateSelectedWorkshopField({
                            id: "startTime",
                            value: myType,
                          })
                        );
                      }}
                      options={{
                        enableTime: true,
                        noCalendar: true,
                        dateFormat: "H:i",
                      }}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col mb-0">
                    <label htmlFor="end-time" className="form-label">
                      End Time
                    </label>
                    <Flatpickr
                      id={"endTime"}
                      value={selectedWorkshop.endTime}
                      ref={flatpickrRefEnd}
                      onChange={(time) => {
                        const myType = time[0].toISOString();

                        dispatch(
                          updateSelectedWorkshopField({
                            id: "endTime",
                            value: myType,
                          })
                        );
                      }}
                      options={{
                        enableTime: true,
                        noCalendar: true,
                        dateFormat: "H:i",
                      }}
                      className="form-control"
                      required
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
                    <Flatpickr
                      id={"date"}
                      ref={flatpickrRefDate}
                      value={selectedWorkshop.date || new Date()}
                      onChange={(date) => {
                        const myDate = date[0].toISOString();
                        dispatch(
                          updateSelectedWorkshopField({
                            id: "date",
                            value: myDate,
                          })
                        );
                      }}
                      options={{ dateFormat: "Y-m-d" }}
                      className="form-control"
                      required
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
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleWorkshop}
                  disabled={!isFormComplete}
                >
                  {isEdit ? "Save Changes" : "Create Session"}
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
