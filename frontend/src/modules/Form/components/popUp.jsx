import React, { useState, useEffect } from "react";
import "../Form.css";
import toast from "react-hot-toast";
import Flatpickr from "react-flatpickr";
import "./DatePicker.css";
import axiosRequest from "../../../utils/AxiosConfig";

function EventModal({
  isOpen,
  toggleModal,
  handleSubmit,
  newEvent,
  handleInputChange,
  isEditMode,
  addField,
  removeField,
  eventId,
}) {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [eventDates, setEventDates] = useState({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    if (eventId) {
      fetchEventDates(eventId);
    }
  }, [eventId]);

  const fetchEventDates = async (eventId) => {
    try {
      const response = await axiosRequest.get(`/events/${eventId}`);
      if (response.data && response.data.startDate && response.data.endDate) {
        setEventDates({
          startDate: new Date(response.data.startDate),
          endDate: new Date(response.data.endDate),
        });
      } else {
        throw new Error("Invalid response data");
      }
    } catch (error) {
      console.error("Error fetching event data:", error);
      toast.error("Failed to fetch event dates");
    }
  };

  const modalClassName = isOpen ? "modal fade show" : "modal fade";

  const validateFields = () => {
    const { name, description, data } = newEvent;
    if (!name || !description || !data) {
      toast.error("Please fill in all fields.");
      return false;
    }
    return true;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      handleSubmit();
    }
  };

  const handleDateTimeChange = (dates) => {
    setSelectedDateTime(dates[0]);
    handleInputChange({
      target: {
        id: "deadline",
        value: dates[0].toISOString(),
      },
    });
  };

  return (
    <>
      {isOpen && <div className="modal-backdrop fade show"></div>}
      <div
        className={modalClassName}
        id="basicModal"
        tabIndex="-1"
        style={{ display: isOpen ? "block" : "none", zIndex: 99999 }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel1">
                {isEditMode ? "Update Form" : "Create Form"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={toggleModal}
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={onSubmit}>
              <div className="modal-body">
                {!isEditMode && <div className="mb-3"></div>}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Enter Form Name"
                    value={newEvent.name || ""}
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
                    value={newEvent.description || ""}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Deadline</label>
                  <Flatpickr
                    value={selectedDateTime}
                    onChange={handleDateTimeChange}
                    options={{
                      enableTime: true,
                      dateFormat: "Y-m-d H:i",
                      minDate: eventDates.startDate,
                      maxDate: eventDates.endDate
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

                {Object.keys(newEvent.data || {}).map((key) => (
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
                        onClick={() => removeField(key)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={addField}
                >
                  Add Field
                </button>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-label-secondary"
                  onClick={toggleModal}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditMode ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventModal;
