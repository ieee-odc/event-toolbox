import React, { useEffect, useRef } from "react";
import "../Events.css";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  addEvent,
  changeFormState,
  editEvent,
  resetEventModal,
  toggleEventModal,
  updateSelectedEventField,
} from "../../../core/Features/Events";
import axiosRequest from "../../../utils/AxiosConfig";
import { UserData } from "./../../../utils/UserData";

function EventModal() {
  const dispatch = useDispatch();
  const userData = UserData();
  const modalRef = useRef(null);

  const { isModalOpen, selectedEvent, isEdit } = useSelector(
    (state) => state.eventsStore
  );
  const modalClassName = isModalOpen ? "modal fade show" : "modal fade";
  const validateFields = () => {
    const { name, description, location, startDate, endDate } = selectedEvent;
    if (!name || !description || !location || !startDate || !endDate) {
      toast.error("Please fill in all fields.");
      return false;
    }
    return true;
  };

  const handleAddEvent = async () => {
    try {
      if (!validateFields()) {
        return;
      }
      const response = await axiosRequest.post("/events/add", {
        ...selectedEvent,
        organizerId: userData.id,
      });
      dispatch(addEvent(response.data));
      dispatch(toggleEventModal());
      dispatch(
        updateSelectedEventField({
          organizerId: userData.id,
          name: "",
          description: "",
          location: "",
          startDate: "",
          endDate: "",
        })
      );
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleEditEvent = async (eventId) => {
    try {
      if (!validateFields()) {
        return;
      }
      const response = await axiosRequest.post(`/events/edit/${eventId}`, {
        organizerId: userData.id,
        ...selectedEvent,
      });
      dispatch(editEvent(response.data.event));
      dispatch(toggleEventModal());
      dispatch(
        updateSelectedEventField({
          organizerId: userData.id,
          name: "",
          description: "",
          location: "",
          startDate: "",
          endDate: "",
        })
      );
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleSubmit = () => {
    if (isEdit) {
      handleEditEvent(selectedEvent.id);
    } else {
      handleAddEvent();
    }
  };

  const handleInputChange = (e) => {
    const payload = e.target;
    dispatch(
      updateSelectedEventField({ id: payload.id, value: payload.value })
    );
  };
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      dispatch(toggleEventModal());
      if (isEdit) {
        dispatch(resetEventModal());
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
      <div
        className={modalClassName}
        id="basicModal"
        tabIndex="-1"
        style={{ display: isModalOpen ? "block" : "none" }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog" role="document" ref={modalRef}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel1">
                {isEdit ? "Edit" : "Add"} Event
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  dispatch(resetEventModal());
                  if (isEdit) {
                    dispatch(changeFormState(false));
                  }
                  dispatch(toggleEventModal());
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
                  placeholder="Enter Name"
                  value={selectedEvent.name}
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
                  placeholder="Enter Description"
                  value={selectedEvent.description}
                  onChange={handleInputChange}
                  style={{ maxHeight: "120px" }}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="location" className="form-label">
                  Location
                </label>
                <textarea
                  id="location"
                  className="form-control"
                  placeholder="Enter Location"
                  value={selectedEvent.location}
                  style={{ maxHeight: "80px" }}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="row g-2">
                <div className="col">
                  <label htmlFor="startDate" className="form-label">
                    Start Date
                  </label>
                  {typeof selectedEvent.startDate}
                  <input
                    type="date"
                    id="startDate"
                    className="form-control"
                    value={selectedEvent.startDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col">
                  <label htmlFor="endDate" className="form-label">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    className="form-control"
                    value={selectedEvent.endDate}
                    onChange={handleInputChange}
                    min={selectedEvent.startDate}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-label-secondary me-2"
                onClick={() => {
                  dispatch(resetEventModal());
                  dispatch(toggleEventModal());
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

export default EventModal;
