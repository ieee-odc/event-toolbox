import React from "react";
import "./Card.css"; // Assuming you put the provided styles in this CSS file

const Card = ({
  title,
  formText,
  date,
  endTime,
  description,
  badgeText,
  personCount,
  personCapacity,
  progress,
}) => {
  return (
    <div className="custom-card">
      <div className="card-header">
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center">
            <div className="avatar me-2 d-flex align-items-center">
              <i className="bx bx-notepad ms-2"></i>{" "}
            </div>
            <div className="me-1">
              <span className="mb-0">
                <h4 style={{ fontSize: "20px" }} className="mb-0">
                  {title}
                </h4>
              </span>
            </div>
          </div>
          <div className="ms-auto">
            <div className="dropdown">
              <a
                href="javascript:;"
                className="btn dropdown-toggle hide-arrow text-body p-0"
              >
                <i className="bx bx-dots-vertical-rounded"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="d-flex flex-column align-items-center justify-content-between mb-3">
          <div className="text-start mt-3 mb-4 ">
            <div className="d-flex align-items-center flex-wrap">
              <i className="bx bx-time me-1"></i>
              <div>
                <h5 className="mb-0">
                  Deadline:{" "}
                  <span className="h5 mt-1 f">
                    {date} {endTime}
                  </span>
                </h5>
              </div>
            </div>
          </div>
          <div className="bg-lighter p-2 rounded mb-2">
            <h6 className="mb-1">
              <span className="text-body fw-normal">Form</span>
              <span>{formText}</span>
            </h6>
          </div>
        </div>

        <h6 style={{ fontSize: "18px" }}>{description}</h6>
      </div>
      <div className="card-body border-top">
        <div className="d-flex align-items-center mb-3">{badgeText}</div>
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
    </div>
  );
};

export default Card;
