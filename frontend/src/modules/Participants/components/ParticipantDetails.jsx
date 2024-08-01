import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetParticipantModal, toggleParticipantDetails } from "../../../core/Features/Participants";

const ParticipantDetails = () => {
  const dispatch = useDispatch();
  const { isParticipantDetailsOpen, selectedParticipant } = useSelector(
    (store) => store.participantsStore
  );
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        dispatch(toggleParticipantDetails());
      }
    };

    if (isParticipantDetailsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isParticipantDetailsOpen, dispatch]);


  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "#56C28B";
      case "Pending":
        return "#FFC107";
      case "Canceled":
        return "#FF5A5F";
      default:
        return "#566A7F";
    }
  };

  return (

    isParticipantDetailsOpen && <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content" style={{ backgroundColor: "#f5f5f9", borderRadius: "8px" }}>
          <div className="modal-header" style={{ borderBottom: "1px solid #A1ACB8" }}>
            <h5 className="modal-title" style={{ color: "#566A7F" }}>{selectedParticipant.fullName}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => {
                dispatch(resetParticipantModal())
                dispatch(toggleParticipantDetails())
              }}
            ></button>
          </div>
          <div className="modal-body" style={{ color: "#566A7F" }}>
            <p>
              <strong>ID:</strong> {selectedParticipant.id}
            </p>
            <p>
              <strong>Email:</strong> {selectedParticipant.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {selectedParticipant.phoneNumber}
            </p>
            <p>
              <strong>Status:</strong>
              <span
                style={{ color: getStatusColor(selectedParticipant.status) }}
              >
                {selectedParticipant.status}
              </span>
            </p>
            <p>
              <strong>Event ID:</strong> {selectedParticipant.eventId}
            </p>
            {selectedParticipant.workshopId && (
              <p>
                <strong>Workshop ID:</strong> {selectedParticipant.workshopId}
              </p>
            )}
            {selectedParticipant.responses &&
              selectedParticipant.responses.length > 0 && (
                <div>
                  <h6 style={{ color: "#566A7F" }}>Responses:</h6>
                  <ul style={{ listStyleType: "none", padding: 0 }}>
                    {selectedParticipant.responses.map((response, index) => (
                      <li key={index} style={{ marginBottom: "10px" }}>
                        <strong>{response.question}:</strong> {response.answer}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
          <div
            className="modal-footer"
            style={{ borderTop: "1px solid #A1ACB8" }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                dispatch(resetParticipantModal())
                dispatch(toggleParticipantDetails())
              }}            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ParticipantDetails;
