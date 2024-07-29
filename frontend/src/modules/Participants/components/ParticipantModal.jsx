import React, { useState } from "react";
import axiosRequest from "../../../utils/AxiosConfig";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  addParticipant,
  resetParticipantModal,
  toggleParticipantModal,
  updateSelectedParticipantField,
} from "../../../core/Features/Participants";
import { useParams } from "react-router-dom";

function ParticipantModal() {
  const dispatch = useDispatch();
  const { eventId,workshopId} = useParams();
  const { isParticipantModalOpen, selectedParticipant, isEdit } = useSelector(
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

  const handleInputChange = (e) => {
    const payload = e.target;
    dispatch(
      updateSelectedParticipantField({ id: payload.id, value: payload.value })
    );
  };

  // TODO: add fetching events based on organizerID
  return (
    <>
      {isParticipantModalOpen && (
        <div className="modal-backdrop fade show"></div>
      )}

      {isParticipantModalOpen && (
        <div
          className="modal fade show"
          id="modalCenter"
          tabIndex={-1}
          style={{ display: "block" }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalCenterTitle">
                  Add Participant
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    dispatch(toggleParticipantModal());
                  }}
                />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col mb-3">
                    <label htmlFor="nameWithTitle" className="form-label">
                      Full Name
                    </label>
                    <input
                      value={selectedParticipant.fullName}
                      onChange={handleInputChange}
                      type="text"
                      id="fullName"
                      className="form-control"
                      placeholder="Enter Name"
                    />
                  </div>
                </div>
                <div className="row g-2">
                  <div className="col mb-0">
                    <label htmlFor="emailWithTitle" className="form-label">
                      Email
                    </label>
                    <input
                      value={selectedParticipant.email}
                      onChange={handleInputChange}
                      type="email"
                      id="email"
                      className="form-control"
                      placeholder="xxxx@xxx.xx"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-label-secondary me-2"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    dispatch(toggleParticipantModal());
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddParticipant}
                >
                  {isEdit ? "Save Changes" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ParticipantModal;
