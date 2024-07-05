import React, { useState, useEffect } from "react";
import "../Events.css";
import axiosRequest from "../../../utils/AxiosConfig"; // Import Axios instance

function EditEventModal({
  isOpen,
  toggleModal,
  handleSubmit,
  eventId,
  handleInputChange,
}) {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [initialEventData, setInitialEventData] = useState(null); // To store initial data for comparison
  const [loading, setLoading] = useState(false);
  const [changesMade, setChangesMade] = useState(false); // State to track if changes have been made

  useEffect(() => {
    if (isOpen && eventId) {
      setLoading(true); // Set loading state
      // Fetch event data from the API
      const fetchEvent = async () => {
        try {
          const response = await axiosRequest.get(`/events/${eventId}`);
          setEventData({
            name: response.data.name,
            description: response.data.description,
            startDate: new Date(response.data.startDate)
              .toISOString()
              .split("T")[0],
            endDate: new Date(response.data.endDate)
              .toISOString()
              .split("T")[0],
          });
          setInitialEventData({
            name: response.data.name,
            description: response.data.description,
            startDate: new Date(response.data.startDate)
              .toISOString()
              .split("T")[0],
            endDate: new Date(response.data.endDate)
              .toISOString()
              .split("T")[0],
          });
          setLoading(false); // Clear loading state
        } catch (error) {
          console.error("Error fetching event data:", error);
          setLoading(false); // Clear loading state on error
        }
      };

      fetchEvent();
    }
  }, [isOpen, eventId]);

  useEffect(() => {
    // Check if changes have been made to eventData compared to initialEventData
    if (initialEventData) {
      const changes =
        eventData.name !== initialEventData.name ||
        eventData.description !== initialEventData.description ||
        eventData.startDate !== initialEventData.startDate ||
        eventData.endDate !== initialEventData.endDate;
      setChangesMade(changes);
    }
  }, [eventData, initialEventData]);

  const modalClassName = isOpen ? "modal fade show" : "modal fade";

  const onSubmit = async (e) => {
    e.preventDefault();
    if (changesMade) {
      try {
        setLoading(true);
        const response = await axiosRequest.patch(
          `/events/edit/${eventId}`,
          eventData
        );
        console.log("Event updated successfully:", response.data);
        setLoading(false);
        toggleModal(); // Close modal after successful update
      } catch (error) {
        console.error("Error updating event:", error);
        setLoading(false);
      }
    } else {
      toggleModal();
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    handleInputChange(e); // Notify parent component of input change if necessary
  };

  return (
    <>
      {isOpen && <div className="modal-backdrop fade show"></div>}
      <div
        className={modalClassName}
        id="basicModal"
        tabIndex="-1"
        style={{ display: isOpen ? "block" : "none" }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel1">
                Edit Event
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
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="form-control"
                        placeholder="Enter Name"
                        value={eventData.name}
                        onChange={handleChange}
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
                        value={eventData.description}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    <div className="row g-2">
                      <div className="col">
                        <label htmlFor="startDate" className="form-label">
                          Start Date
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          className="form-control"
                          value={eventData.startDate}
                          onChange={handleChange}
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
                          value={eventData.endDate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-label-secondary"
                  onClick={toggleModal}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!changesMade} // Disable save button if no changes made
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditEventModal;
