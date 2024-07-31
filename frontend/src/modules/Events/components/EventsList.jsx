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
  addEvent,
  setEventsPerPage,
  turnIsLoadingOff,
} from "../../../core/Features/Events";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CustomButton from "../../../core/components/Button/Button";
import Pagination from "../../../core/components/Pagination/Pagination";

function EventsList() {
  const dispatch = useDispatch();
  const { events, filteredEvents, isLoading, filterStatus, eventsPerPage } =
    useSelector((store) => store.eventsStore);

  const userData = UserData();
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const handleDeleteEvent = async (eventId) => {
    try {
      await axiosRequest.delete(`/events/delete/${eventId}`);
      dispatch(deleteEvent(eventId));
      toast.success("Event Deleted Successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEditClick = (event) => {
    dispatch(selectEvent(event));
    dispatch(toggleEventModal());
  };

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

  const onAddEventClick = () => {
    dispatch(toggleEventModal());
  };

  const navigate = useNavigate();

  const handleDuplicateEvent = (event) => {
    try {
      axiosRequest.post(`/events/duplicate/${event.id}`).then((res) => {
        dispatch(addEvent(res.data.event));
        toast.success("Event Duplicated Successfully");
      });
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosRequest.get(
          `/events/get-organizer/${userData.id}`
        );
        console.log(response);
        dispatch(initializeEvents(response.data.events));
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        console.log("finnally");
        dispatch(turnIsLoadingOff());
      }
    };

    fetchEvents();
  }, [userData.id]);

  const handleEventsPerPageChange = (e) => {
    dispatch(setEventsPerPage(Number(e.target.value)));
    setCurrentPage(1); // Reset to the first page
  };

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
                <div className="d-flex flex-row align-items-start">
                  <div
                    className="dataTables_length"
                    id="DataTables_Table_0_length"
                  >
                    <label>
                      <select
                        name="DataTables_Table_0_length"
                        aria-controls="DataTables_Table_0"
                        className="form-select"
                        onChange={handleEventsPerPageChange}
                        value={eventsPerPage}
                      >
                        <option value={6}>6</option>
                        <option value={9}>9</option>
                        <option value={12}>12</option>
                        <option value={18}>18</option>
                      </select>
                    </label>
                  </div>
                  <div className="d-flex flex-column align-items-start ms-3">
                    <h5 className="mb-1">My Events</h5>
                    <p className="text-muted mb-0">
                      Total {events && events.length} events
                    </p>
                  </div>
                </div>
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
                    <option value="">All Events</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <CustomButton
                  text="Add Event"
                  backgroundColor="var(--primary-color)"
                  textColor="white"
                  hoverBackgroundColor="var(--secondary-color)"
                  hoverTextColor="white"
                  onClick={onAddEventClick}
                />
              </div>
            </div>
            <div className="card-body">
              <div
                className="row gy-4 mb-4"
                style={{ justifyContent: "center" }}
              >
                {isLoading ? (
                  <p>Loading events...</p>
                ) : (
                  currentEvents &&
                  currentEvents.map((event) => (
                    <div className="col-sm-6 col-lg-4" key={event._id}>
                      <div className="card p-2 h-100 shadow-none border">
                        <div className="rounded-2 text-center mb-3">
                          <div
                            onClick={() => {
                              handleDuplicateEvent(event);
                            }}
                            style={{
                              cursor: "pointer",
                              background: "var(--primary-color)",
                              padding: 5,
                              borderRadius: "50%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              position: "absolute",
                              top: 15,
                              right: 15,
                            }}
                          >
                            <i
                              className="bx bx-duplicate"
                              style={{ margin: 0, color: "white" }}
                            ></i>
                          </div>
                          <img
                            onClick={() => {
                              navigate(`/event/${event.id}`);
                            }}
                            className="img-fluid cursor-pointer"
                            src={
                              "https://demos.themeselection.com/sneat-bootstrap-html-admin-template/assets/img/pages/app-academy-tutor-3.png"
                            }
                            alt="tutor image 1"
                          />
                          <div
                            className="card-body p-3 pt-3 cursor-pointer"
                            id="eventCardBody"
                            onClick={() => {
                              navigate(`/event/${event.id}`);
                            }}
                          >
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
                            <div className="d-flex align-items-center ms-1 mb-3">
                              <p className="h4">{event.name}</p>
                            </div>
                            <div className="d-flex align-items-center mb-1">
                              <i className="bx bx-location-plus me-2"></i>

                              <b>
                                {" "}
                                <p className="d-flex align-items-center text mb-0">
                                  Location :
                                </p>
                              </b>
                              <p className="d-flex align-items-center mb-0 ms-1">
                                {event.location}
                              </p>
                            </div>

                            <div className="d-flex align-items-center mb-1">
                              <i className="bx bx-time-five me-2"></i>
                              <b>
                                <p className="d-flex align-items-center text mb-0">
                                  Duration :
                                </p>
                              </b>

                              <p className="d-flex align-items-center mb-0 ms-1">
                                {calculateDurationInDays(
                                  event.startDate,
                                  event.endDate
                                )}{" "}
                                days
                              </p>
                            </div>
                            <div className="d-flex align-items-center mb-1 date-container">
                              <i className="bx bx-calendar me-2 date-icon"></i>
                              <b>
                                <span className="text mb-0">Dates:</span>
                              </b>
                              <span className="dates-span d-flex align-items-center ms-2 mt-1">
                                <p className="mb-0 date">
                                  {formatDate(event.startDate)}
                                </p>
                                <span className="date-separator mx-1"> - </span>
                                <p className="mb-0 date">
                                  {formatDate(event.endDate)}
                                </p>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          id="button-container"
                          className="d-flex flex-column flex-md-row gap-2 text-nowrap pe-xl-3 pe-xxl-0 mt-1 mb-3 justify-content-center align-items-end"
                        >
                          <button
                            id="deleteButton"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <p className="mx-1">Delete</p>
                            <div className="centered">
                              {" "}
                              <i className="bx bxs-trash mx-1"></i>
                            </div>
                          </button>
                          <button
                            id="editButton"
                            onClick={() => {
                              handleEditClick(event);
                            }}
                          >
                            <p>Edit</p>
                            <div className="centered">
                              <i className="bx bx-chevron-right lh-1 scaleX-n1-rtl"></i>
                            </div>
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
              <div className="row mx-2" id="pagination-section">
                <div className="col-sm-12 col-md-6">
                  <div
                    className="dataTables_info"
                    id="DataTables_Table_0_info"
                    role="status"
                    aria-live="polite"
                  >
                    {`Showing ${indexOfFirstEvent + 1} to ${Math.min(
                      indexOfLastEvent,
                      filteredEvents.length
                    )} of ${filteredEvents.length} entries`}
                  </div>
                </div>
                <Pagination
                  unitsPerPage={eventsPerPage}
                  totalUnits={filteredEvents.length}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsList;
