import React, { useState, useEffect, useRef } from "react";
import "./Card.css"; // Assuming you put the provided styles in this CSS file
import { formatTime } from "../../../utils/helpers/FormatDateWithTime";
import { formatDateWithNumbers } from "../../../utils/helpers/FormatDate";
import axiosRequest from "../../../utils/AxiosConfig";
import {
  deleteWorkshop,
  setSelectedWorkshop,
  toggleWorkshopModal,
} from "../../Features/Workshops";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast"; // Add this import

const Card = ({
  title,
  formText,
  date,
  startTime,
  endTime,
  description,
  badgeText,
  personCount,
  personCapacity,
  progress,
  workshop,
  status
}) => {
  const { eventId } = useParams();
  const dropdownRef = useRef(null);

  const [dropdownStates, setDropdownStates] = useState({});

  const toggleDropdown = (workshopId) => {
    setDropdownStates({
      ...dropdownStates,
      [workshopId]: !dropdownStates[workshopId],
    });
  };
  const handleEditWorkshop = (workshop) => {
    const newDate = new Date(workshop.startTime).toISOString();
    dispatch(
      setSelectedWorkshop({
        ...workshop,
        startTime: workshop.startTime,
        endTime: workshop.endTime,
        date: newDate,
      })
    );
    dispatch(toggleWorkshopModal());
    setDropdownStates({
      ...dropdownStates,
      [workshop.id]: false,
    });
  };
  const handleDeleteWorkshop = (workshopId) => {
    axiosRequest.post(`/workshop/delete/${workshopId}`).then((res) => {
      dispatch(deleteWorkshop(workshopId));
      toast.success("Workshop deleted successfully");
    });
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownStates({});
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="custom-card">
      <div className="card-header">
        <div className="d-flex align-items-start">
          <div className="d-flex align-items-center mb-3">
            <div className="avatar me-3">
              <img
                src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/assets/img/icons/brands/social-label.png"
                alt="Avatar"
                className="rounded-circle"
              />
            </div>
            <div className="me-2">
              <h5 className="mb-1 workshop-title">
                <span className="h5">{workshop.name}</span>
              </h5>
            </div>
          </div>
          <div className="ms-auto">
            <div className="dropdown" ref={dropdownRef}>
              <a
                className="btn dropdown-toggle hide-arrow text-body p-0"
                onClick={() => toggleDropdown(workshop.id)}
                aria-expanded={dropdownStates[workshop.id]}
              >
                <i className="bx bx-dots-vertical-rounded" />
              </a>
              {dropdownStates[workshop.id] && (
                <div
                  className="dropdown-menu dropdown-menu-end"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <a className="dropdown-item">Download</a>
                  <a
                    onClick={() => {
                      handleEditWorkshop(workshop);
                    }}
                    className="dropdown-item"
                  >
                    Edit
                  </a>
                  <a className="dropdown-item">Duplicate</a>
                  <a
                    onClick={() => {
                      handleDeleteWorkshop(workshop.id);
                    }}
                    style={{ cursor: "pointer" }}
                    className="dropdown-item delete-record text-danger"
                  >
                    Delete
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="card-body"
        style={{ cursor: "pointer" }}
        onClick={() => {
          dispatch(setSelectedWorkshop(workshop));
          navigate(`/event/${eventId}/workshop/${workshop.id}`);
        }}
      >
        <div
          className="d-flex align-items-start flex-wrap mb-2"
          style={{
            flexDirection: "column",
          }}
        >
          <div className="bg-lighter p-2 rounded me-auto mb-3">
            <h6 className="mb-1">
              <span className="text-body fw-normal">
                {workshop.formId ? `Form` : "No form"}
              </span>{" "}
              {workshop.formId && <span>#{workshop.formId}</span>}
            </h6>
          </div>
          <div className="text-start mb-3" id="info-box">
            <h6 className="mb-2">
              Starts:{" "}
              <span className="text-body fw-normal">
                {formatTime(workshop.startTime)}{" "}
                {formatDateWithNumbers(workshop.startTime)}
              </span>
            </h6>
            <h6 className="mb-1">
              Ends: &nbsp;
              <span className="text-body fw-normal">
                {" "}
                {formatTime(workshop.endTime)}{" "}
                {formatDateWithNumbers(workshop.endTime)}{" "}
              </span>
            </h6>
            <h6 className="mb-1">
              Status: &nbsp;
              <span className="text-body fw-normal">
                {" "}
                {workshop.status === "exclusive" ? "Exclusive" : "Open for all"}
              </span>
            </h6>
          </div>
        </div>
        <h6 style={{ fontSize: "14px" }}>{workshop.description}</h6>
      </div>
      <div className="card-body border-top">
        <div className="d-flex align-items-center mb-3">{badgeText}</div>
        {workshop.space ? (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <small>
                Capacity: {personCount}/{personCapacity}
              </small>
              <small>{progress}% Full</small>
            </div>
            <div className="progress mb-3" style={{ height: 8 }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        ) : (
          <div>No space assigned</div>
        )}
      </div>
    </div>
  );
};

export default Card;
