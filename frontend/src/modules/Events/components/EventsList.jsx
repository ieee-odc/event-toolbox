import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Events.css";
import axiosRequest from "../../../utils/AxiosConfig";
import { UserData } from "./../../../utils/UserData";
import { useDispatch, useSelector } from "react-redux";
import {
  filterEvents,
  initializeEvents,
  deleteEvent,
  toggleEventsIsLoading,
  toggleEventModal,
  selectEvent,
} from "../../../core/Features/Events";

function EventsList() {
  const dispatch = useDispatch();
  const { events, filteredEvents, isLoading, filterStatus } = useSelector(
    (store) => store.eventsStore
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6);
  const userData = UserData();

  const handleDeleteEvent = async (eventId) => {
    try {
      await axiosRequest.delete(`/events/delete/${eventId}`);
      dispatch(deleteEvent(eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEditClick=(event)=>{
    dispatch(selectEvent(event))
    console.log(event)
    dispatch(toggleEventModal())
  }

  const calculateDurationInDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInMilliseconds = end - start;
    const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);
    return Math.round(durationInDays);
  };
  const formatDate = (passedDate) => {
    const dateObj = new Date(passedDate);
    const day = dateObj.getUTCDate().toString().padStart(2, "0");
    const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
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

  const handleStatusChange = (e) => {
    dispatch(filterEvents(e.target.value));
  };


const onAddEventClick=()=>{
  dispatch(toggleEventModal())
}


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosRequest.get(
          `/events/get-organizer/${userData.id}`
        );
        dispatch(initializeEvents(response.data.events));
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        dispatch(toggleEventsIsLoading());
      }
    };

    fetchEvents();
  }, []);


  return (
    <div className="content-wrapper">
      <div
        className="container-xxl flex-grow-1 container-p-y"
        id="eventsContainer"
      >
        <h4 className="py-3 mb-4">
          <span className="text-muted fw-light">{userData.username}/</span>{" "}
          Events
        </h4>

        <div className="app-academy">
          <div className="card mb-4">
            <div className="card-header d-flex flex-wrap justify-content-between gap-3">
              <div className="card-title mb-0 me-1">
                <h5 className="mb-1">My Events</h5>
                <p className="text-muted mb-0">Total {events.length} events</p>
              </div>
              <div className="d-flex justify-content-md-end align-items-center gap-3 flex-wrap">
                <div className="position-relative">
                  <select
                    id="select2_course_select"
                    className="select2 form-select select2-hidden-accessible"
                    data-placeholder="All Courses"
                    onChange={handleStatusChange}
                    tabIndex="-1"
                    aria-hidden="true"
                  >
                    <option
                      className="select2-results__option"
                      id="select2-select2_course_select-result-1rbs-seo"
                      value=""
                    >
                      All Events
                    </option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Done">Done</option>
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

                <button className="btn btn-primary" onClick={onAddEventClick}>
                  Add Event
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="row gy-4 mb-4">
                {isLoading ? (
                  <p>Loading events...</p>
                ) : (
                  filteredEvents &&
                  filteredEvents.map((event) => (
                    <div className="col-sm-6 col-lg-4" key={event._id}>
                      <div className="card p-2 h-100 shadow-none border">
                        <div className="rounded-2 text-center mb-0"></div>
                        {/* <div className="rounded-2 text-center mb-3">
                          <a href="">
                            <img
                              className="img-fluid"
                              src={tutorImage}
                              alt="tutor image 1"
                            />
                          </a>
                        </div> */}
                        <div className="card-body p-3 pt-3" id="eventCardBody">
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
                            </span>
                            {/* Number of participants  */}
                            {/* <h6 className="d-flex align-items-center justify-content-center gap-1 mb-0">
                              <span className="text-muted"> (34)</span>
                            </h6> */}
                          </div>
                          <p className="h5">{event.name}</p>
                          <p className="mt-2">{event.description}</p>
                          <div className="d-flex align-items-center mb-1">
                            <p className="d-flex align-items-center text mb-0">
                              Location :
                            </p>
                            <p className="d-flex align-items-center mb-0 ms-1">
                              {event.location}
                            </p>
                          </div>

                          <div className="d-flex align-items-center mb-1">
                            <p className="d-flex align-items-center text mb-0">
                              Duration :
                            </p>
                            <i className="bx bx-time-five ms-2"></i>
                            <p className="d-flex align-items-center mb-0 ms-1">
                              {calculateDurationInDays(
                                event.startDate,
                                event.endDate
                              )}{" "}
                              days
                            </p>
                          </div>
                          <div className="d-flex align-items-center mb-1">
                            <p className="d-flex align-items-center text mb-0">
                              Starts :
                            </p>
                            <p className="d-flex align-items-center mb-0 ms-1">
                              {formatDate(event.startDate)}
                            </p>
                          </div>
                          <div className="d-flex align-items-center">
                            <p className="d-flex align-items-center text mb-0">
                              Ends :
                            </p>
                            <p className="d-flex align-items-center mb-0 ms-1">
                              {formatDate(event.endDate)}
                            </p>
                          </div>
                        </div>
                        <div
                          id="button-container"
                          className="d-flex flex-column flex-md-row gap-2 text-nowrap pe-xl-3 pe-xxl-0 mt-1 mb-3 justify-content-center align-items-end"
                        >
                          <button
                            id="deleteButton"
                            className="app-academy-md-50 btn btn-label-secondary me-md-0 d-flex align-items-center"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <i className="bx bxs-trash me-2"></i>Delete
                          </button>
                          <button
                            id="editButton"
                            className="app-academy-md-50 btn btn-label-primary d-flex align-items-center"
                            onClick={()=>{
                              handleEditClick(event)
                            }}
                          >
                            Edit
                            <i className="bx bx-chevron-right lh-1 scaleX-n1-rtl"></i>
                          </button>
                          {/* <a
                            className="app-academy-md-50 btn btn-label-primary d-flex align-items-center"
                            href="app-academy-course-details.html"
                          >
                            <span className="me-0">Continue</span>
                            <i className="bx bx-chevron-right lh-1 scaleX-n1-rtl"></i>
                          </a> */}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {/* Pagination */}
              <nav className="mt-4" aria-label="...">
                <ul className="pagination">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage - 1)}
                      tabIndex="-1"
                      aria-disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from(
                    {
                      length: Math.ceil(filteredEvents.length / eventsPerPage),
                    },
                    (_, index) => (
                      <li
                        key={index}
                        className={`page-item ${
                          currentPage === index + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => paginate(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    )
                  )}
                  <li
                    className={`page-item ${
                      currentPage ===
                      Math.ceil(filteredEvents.length / eventsPerPage)
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsList;
