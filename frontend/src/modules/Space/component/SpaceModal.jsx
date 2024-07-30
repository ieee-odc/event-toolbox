import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import axiosRequest from "../../../utils/AxiosConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  addSpace,
  deleteSpace,
  editSpace,
  resetSpaceModal,
  toggleSpaceModal,
  updateSelectedSpaceField,
} from "../../../core/Features/Spaces";
import toast from "react-hot-toast";
import { UserData } from "../../../utils/UserData";
import { useParams } from "react-router-dom";
import { initializeWorkshops } from "../../../core/Features/Workshops";

function SpaceModal() {
  const dispatch = useDispatch();
  const { eventId } = useParams();

  const { isModalOpen, selectedSpace, isEdit } = useSelector(
    (store) => store.spacesStore
  );
  const { workshops } = useSelector((store) => store.workshopsStore);

  const modalClassName = isModalOpen ? "modal fade show" : "modal fade";
  const userData = UserData();
  const modalRef = useRef(null);

  const handleDelete = async () => {
    try {
      axiosRequest.delete(`/space/delete/${selectedSpace.id}`).then((res) => {
        const updatedWorkshops = workshops.map((workshop) => {
          if (workshop.spaceId === selectedSpace.id) {
            return { ...workshop, spaceId: null, space: null }; // Update the spaceId to null
          }
          return workshop;
        });

        dispatch(initializeWorkshops(updatedWorkshops));
        dispatch(deleteSpace(selectedSpace.id));
        dispatch(toggleSpaceModal());
        toast.success("Space deleted successfully");
      });
    } catch (error) {}
  };

  const handleInputChange = (e) => {
    const payload = e.target;
    dispatch(
      updateSelectedSpaceField({ id: payload.id, value: payload.value })
    );
  };

  const handleCreateSpace = () => {
    axiosRequest
      .post("/space/add", {
        ...selectedSpace,
        eventId,
        organizerId: userData.id,
      })
      .then((res) => {
        dispatch(toggleSpaceModal());
        dispatch(resetSpaceModal());
        dispatch(addSpace(res.data.space));
        toast.success("Space added successfully");
      });
  };

  const handleEditSpace = () => {
    axiosRequest
      .post(`/space/edit/${selectedSpace.id}`, {
        ...selectedSpace,
        organizerId: userData.id,
      })
      .then((res) => {
        dispatch(editSpace(res.data.space));
        dispatch(toggleSpaceModal());
        dispatch(resetSpaceModal());
        toast.success("Space edited successfully");
      });
  };
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      dispatch(toggleSpaceModal());
      if (isEdit) {
        dispatch(resetSpaceModal());
      }
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <>
      {isModalOpen && <div className="modal-backdrop fade show"></div>}
      <div
        className={modalClassName}
        id="spaceModal"
        tabIndex="-1"
        style={{ display: isModalOpen ? "block" : "none", zIndex: 99999 }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog" role="document" ref={modalRef}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {isEdit ? "Update Venue" : "Add Venue"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  dispatch(toggleSpaceModal());
                  dispatch(resetSpaceModal());
                }}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="spaceName" className="form-label">
                  Space Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  placeholder="Enter Space Name"
                  value={selectedSpace.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="spaceCapacity" className="form-label">
                  Capacity
                </label>
                <input
                  type="number"
                  id="capacity"
                  className="form-control"
                  placeholder="Enter Capacity"
                  value={selectedSpace.capacity}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-label-secondary me-2"
                onClick={() => {
                  dispatch(toggleSpaceModal());
                  dispatch(resetSpaceModal());
                }}
              >
                Close
              </button>
              <button
                className="btn btn-primary ms-2"
                onClick={isEdit ? handleEditSpace : handleCreateSpace}
              >
                {isEdit ? "Save Changes" : "Create"}
              </button>
              {selectedSpace.id && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SpaceModal;
