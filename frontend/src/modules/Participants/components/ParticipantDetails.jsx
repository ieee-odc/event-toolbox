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
  console.log(selectedParticipant)

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
    isParticipantDetailsOpen && (
      <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
        <div className="modal-dialog">
          <div className="modal-content" style={{ backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
            <div className="modal-header" style={{ borderBottom: "1px solid #E5E7EB" }}>
              <h5 className="modal-title" style={{ color: "#111827" }}>{selectedParticipant.fullName}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  dispatch(resetParticipantModal());
                  dispatch(toggleParticipantDetails());
                }}
              ></button>
            </div>
            <div className="modal-body" style={{ padding: "20px", color: "#4B5563" }}>
              <div style={{ marginBottom: "20px" }}>
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
                  <span style={{ color: getStatusColor(selectedParticipant.status), marginLeft: "8px" }}>
                    {selectedParticipant.status}
                  </span>
                </p>
                <p>
                  <strong>Event Name:</strong> {selectedParticipant.eventName}
                </p>
                {selectedParticipant.responses && selectedParticipant.responses.length > 0 && (
                  <div>
                    <h6 style={{ color: "#111827", marginTop: "10px" }}>Event Responses:</h6>
                    <ul style={{ listStyleType: "none", padding: 0, marginLeft: "20px" }}>
                      {selectedParticipant.responses.map((response, index) => (
                        <li key={index} style={{ marginBottom: "10px" }}>
                          <strong>{response.question}:</strong> {response.answer}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {selectedParticipant.workshops && selectedParticipant.workshops.length > 0 && (
                <div>
                  <h6 style={{ color: "#111827", marginBottom: "15px" }}>Workshops:</h6>
                  {selectedParticipant.workshops.map((workshop, index) => (
                    <div key={index} style={{ marginBottom: "20px", padding: "15px", border: "1px solid #E5E7EB", borderRadius: "8px", backgroundColor: "#F9FAFB" }}>
                      <p style={{ marginBottom: "10px" }}>
                        <strong>Workshop Name:</strong> {workshop.workshopId}
                      </p>
                      {workshop.responses && workshop.responses.length > 0 && (
                        <ul style={{ listStyleType: "none", padding: 0, marginLeft: "20px" }}>
                          {workshop.responses.map((response, index) => (
                            <li key={index} style={{ marginBottom: "10px" }}>
                              <strong>{response.question}:</strong> {response.answer}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer" style={{ borderTop: "1px solid #E5E7EB" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  dispatch(resetParticipantModal());
                  dispatch(toggleParticipantDetails());
                }}
                style={{ backgroundColor: "#1F2937", color: "#FFFFFF" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ParticipantDetails;
