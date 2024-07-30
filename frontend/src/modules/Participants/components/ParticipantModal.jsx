import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleParticipantModal } from "../../../core/Features/Participants";

const ParticipantModal = () => {
  const dispatch = useDispatch();
  const { isParticipantModalOpen, selectedParticipant } = useSelector(
    (store) => store.participantsStore
  );

  const handleAddParticipant = () => {
    const reqBody = {
      email: selectedParticipant.email,
      fullName: selectedParticipant.fullName,
      eventId,
      workshopId,
    };
    axiosRequest
      .post("/participant/add", reqBody)
      .then((res) => {
        dispatch(addParticipant(res.data.participant));
        dispatch(resetParticipantModal());
        dispatch(toggleParticipantModal());
        toast.success("Participant Successfully Created!");
      })
      .catch((err) => {
        toast.error("Failed to add participant");
      });
  };

  if (!isParticipantModalOpen) return null;
  console.log(selectedParticipant)

  return (
    <div className="modal show" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{selectedParticipant.fullName}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => dispatch(toggleParticipantModal())}
            ></button>
          </div>
          <div className="modal-body">
            <p><strong>ID:</strong> {selectedParticipant.id}</p>
            <p><strong>Email:</strong> {selectedParticipant.email}</p>
            <p><strong>Phone Number:</strong> {selectedParticipant.phoneNumber}</p>
            <p><strong>Status:</strong> {selectedParticipant.status}</p>
            <p><strong>Event ID:</strong> {selectedParticipant.eventId}</p>
            {selectedParticipant.workshopId && (
              <p><strong>Workshop ID:</strong> {selectedParticipant.workshopId}</p>
            )}
            {selectedParticipant.responses && selectedParticipant.responses.length > 0 && (
              <div>
                <h6>Responses:</h6>
                <ul>
                  {selectedParticipant.responses.map((response, index) => (
                    <li key={index}>
                      <strong>{response.question}:</strong> {response.answer} 
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => dispatch(toggleParticipantModal())}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantModal;
