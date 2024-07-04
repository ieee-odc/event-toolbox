import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Events.css";
import axiosRequest from "../../../utils/AxiosConfig";

function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axiosRequest.get("/events");
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await axiosRequest.delete(`/events/delete/${eventId}`);
      setEvents(events.filter((event) => event._id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const toggleCreateEvent = () => {
    setShowCreateEvent(!showCreateEvent);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  const createEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:6001/events/create",
        newEvent
      );
      setEvents([...events, response.data]);
      setShowCreateEvent(false);
      setNewEvent({ name: "", description: "" });
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const calculateDurationInDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInMilliseconds = end - start;
    const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);
    return Math.round(durationInDays);
  };

  const getEventStatus = (startDate, endDate) => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (currentDate > end) {
      return { status: "Done", badgeClass: "badge bg-label-success" };
    } else if (currentDate < start) {
      return { status: "Upcoming", badgeClass: "badge bg-label-primary" };
    } else {
      return { status: "Ongoing", badgeClass: "badge bg-label-warning" };
    }
  };

  return (
    <div className="content-wrapper">
      <div className="container-xxl flex-grow-1 container-p-y">
        <h4 className="py-3 mb-4">
          <span className="text-muted fw-light">Academy/</span> My Courses
        </h4>

        <div className="app-academy">
          <div className="card mb-4">
            <div className="card-header d-flex flex-wrap justify-content-between gap-3">
              <div className="card-title mb-0 me-1">
                <h5 className="mb-1">My Courses</h5>
                <p className="text-muted mb-0">
                  Total {events.length} courses you have purchased
                </p>
              </div>
              <div className="d-flex justify-content-md-end align-items-center gap-3 flex-wrap">
                <div className="position-relative">
                  <select
                    id="select2_course_select"
                    className="select2 form-select select2-hidden-accessible"
                    data-placeholder="All Courses"
                    tabIndex="-1"
                    aria-hidden="true"
                  >
                    <option value="">All Courses</option>
                    <option value="all courses">All Courses</option>
                    <option value="ui/ux">UI/UX</option>
                    <option value="seo">SEO</option>
                    <option value="web">Web</option>
                    <option value="music">Music</option>
                    <option value="painting">Painting</option>
                  </select>
                  <span
                    className="select2 select2-container select2-container--default"
                    dir="ltr"
                    style={{ width: "126px" }}
                  >
                    <span
                      className="selection"
                      aria-haspopup="true"
                      aria-expanded="false"
                      tabIndex="0"
                      aria-disabled="false"
                    >
                      <span
                        className="select2-selection select2-selection--single"
                        role="combobox"
                      >
                        <span
                          className="select2-selection__arrow"
                          role="presentation"
                        >
                          <b role="presentation"></b>
                        </span>
                      </span>
                    </span>
                    <span
                      className="dropdown-wrapper"
                      aria-hidden="true"
                    ></span>
                  </span>
                </div>

                {/* Add Event Button */}
                <button className="btn btn-primary" onClick={toggleCreateEvent}>
                  Add Event
                </button>
              </div>
            </div>
            <div className="card-body">
              {showCreateEvent && (
                <form onSubmit={createEvent}>
                  <div className="mb-3">
                    <label className="form-label">Event Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={newEvent.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Event Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={newEvent.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-success">
                    Create Event
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={toggleCreateEvent}
                  >
                    Cancel
                  </button>
                </form>
              )}
              <div className="row gy-4 mb-4">
                {loading ? (
                  <p>Loading courses...</p>
                ) : (
                  events.map((event) => (
                    <div className="col-sm-6 col-lg-4" key={event._id}>
                      <div className="card p-2 h-100 shadow-none border">
                        <div className="rounded-2 text-center mb-0">
                          <a href="app-academy-course-details.html">
                            <img
                              className="img-fluid"
                              src={event.imageUrl}
                              alt={event.tutorName}
                            />
                          </a>
                        </div>
                        <div className="card-body p-3 pt-2">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span
                              className={
                                getEventStatus(event.startDate, event.endDate)
                                  .badgeClass
                              }
                            >
                              {
                                getEventStatus(event.startDate, event.endDate)
                                  .status
                              }
                            </span>{" "}
                            <h6 className="d-flex align-items-center justify-content-center gap-1 mb-0">
                              <span className="text-muted"> (34)</span>
                            </h6>
                          </div>
                          <a
                            href="app-academy-course-details.html"
                            className="h5"
                          >
                            {event.Name}
                          </a>
                          <p className="mt-2">{event.Description}</p>
                          <div className="d-flex align-items-center">
                            <i className="bx bx-time-five me-2"></i>
                            <p className="d-flex align-items-center text mb-0">
                              Duration :
                            </p>
                            <p className="d-flex align-items-center mb-0 ms-1">
                              {calculateDurationInDays(
                                event.startDate,
                                event.endDate
                              )}{" "}
                              days
                            </p>
                          </div>
                          {/* 
      <div className="progress mb-4" style={{ height: "8px" }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${event.progress}%` }}
          aria-valuenow={event.progress}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div> */}
                        </div>
                        <div className="d-flex flex-column flex-md-row gap-2 text-nowrap pe-xl-3 pe-xxl-0 mt-1 mb-3 justify-content-center align-items-end">
                          <button
                            className="app-academy-md-50 btn btn-label-secondary me-md-2 d-flex align-items-center"
                            onClick={() => deleteEvent(event._id)}
                          >
                            <i className="bx bxs-trash me-2"></i>Delete
                          </button>
                          <button className="app-academy-md-50 btn btn-primary d-flex align-items-center">
                            <i className="bx bx-continue me-2"></i>Continue
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsList;
