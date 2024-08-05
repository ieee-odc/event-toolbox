import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetParticipantModal,
  toggleParticipantDetails,
} from "../../../core/Features/Participants";
import { Modal, Button, ListGroup, Badge } from "react-bootstrap";

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
        return "success";
      case "Pending":
        return "warning";
      case "Canceled":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <>
      {isParticipantDetailsOpen && (
        <div className="modal-backdrop fade show"></div>
      )}

      {isParticipantDetailsOpen && (
        <div
          className="modal fade show"
          id="modalCenter"
          tabIndex={-1}
          style={{ display: "block" }}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            ref={modalRef}
          >
            <div className="modal-content">
              <Modal.Header
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Modal.Title>{selectedParticipant.fullName}</Modal.Title>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    dispatch(toggleParticipantDetails());
                  }}
                />
              </Modal.Header>
              <Modal.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>ID:</strong> {selectedParticipant.id}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Email:</strong> {selectedParticipant.email}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Phone Number:</strong>{" "}
                    {selectedParticipant.phoneNumber}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Status:</strong>
                    <Badge
                      bg={getStatusColor(selectedParticipant.status)}
                      className="ms-2"
                    >
                      {selectedParticipant.status}
                    </Badge>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Event Name:</strong> {selectedParticipant.eventName}
                  </ListGroup.Item>
                  {selectedParticipant.eventResponses &&
                    selectedParticipant.eventResponses.length > 0 && (
                      <ListGroup.Item>
                        <strong>Event Responses:</strong>
                        <ul className="mt-2">
                          {selectedParticipant.eventResponses.map(
                            (response, index) => (
                              <li key={index}>
                                <strong>{response.question}:</strong>{" "}
                                {response.answer}
                              </li>
                            )
                          )}
                        </ul>
                      </ListGroup.Item>
                    )}
                  {selectedParticipant.workshops &&
                    selectedParticipant.workshops.length > 0 && (
                      <ListGroup.Item>
                        <strong>Workshops:</strong>
                        <ul className="mt-2">
                          {selectedParticipant.workshops.map(
                            (workshop, index) => (
                              <li key={index}>
                                <div className="border p-2 rounded">
                                  <p>
                                    <strong>Workshop Name:</strong>{" "}
                                    {workshop.workshopName}
                                  </p>
                                  {workshop.responses &&
                                    workshop.responses.length > 0 && (
                                      <ul className="mt-2">
                                        {workshop.responses.map(
                                          (response, i) => (
                                            <li key={i}>
                                              <strong>
                                                {response.question}:
                                              </strong>{" "}
                                              {response.answer}
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}
                                </div>
                              </li>
                            )
                          )}
                        </ul>
                      </ListGroup.Item>
                    )}
                </ListGroup>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => {
                    dispatch(resetParticipantModal());
                    dispatch(toggleParticipantDetails());
                  }}
                >
                  Close
                </Button>
              </Modal.Footer>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ParticipantDetails;
