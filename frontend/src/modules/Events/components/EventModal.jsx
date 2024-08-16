
import React, { useEffect, useRef, useState } from "react";
import "../Events.css";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Flatpickr from "react-flatpickr";
import {
  addEvent,
  changeFormState,
  editEvent,
  resetEventModal,
  toggleEventModal,
  updateSelectedEventField,
} from "../../../core/Features/Events";
import axiosRequest from "../../../utils/AxiosConfig";
import { UserData } from "./../../../utils/UserData";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import Firebase storage

function EventModal() {
  const dispatch = useDispatch();
  const userData = UserData();
  const modalRef = useRef(null);
  const flatpickrRefStart = useRef(null);
  const flatpickrRefEnd = useRef(null);
  const [priceEnabled, setPriceEnabled] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);

  const { isModalOpen, selectedEvent, isEdit } = useSelector(
    (state) => state.eventsStore
  );
  const [coverPhoto, setCoverPhoto] = useState(null); // State for cover photo
  const [photoPreview, setPhotoPreview] = useState(null); // State for photo preview

  const modalClassName = isModalOpen ? "modal fade show" : "modal fade";

  const validateFields = () => {
    const { name, description, location, startDate, endDate, status, price } = selectedEvent;
    if (!name || !description || !location || !startDate || !endDate) {
      toast.error("Please fill in all fields.");
      return false;
    }
    if (status === "paid" && (!price || parseFloat(price) <= 0)) {
      toast.error("Please provide a valid price for paid events.");
      return false;
    }

    return true;
  };
  const handleAddEvent = async (photoURL = null) => {
    try {
      if (!validateFields()) {
        return;
      }

      const response = await axiosRequest.post("/events/add", {
        ...selectedEvent,
        coverPhoto: photoURL,
        organizerId: userData.id,
        status: selectedEvent.status || "free",
        price: selectedEvent.status === "free" ? 0 : selectedEvent.price || 0,
      });

      dispatch(addEvent(response.data));
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleEditEvent = async (eventId, photoURL = null) => {
    try {
      if (!validateFields()) {
        return;
      }

      const response = await axiosRequest.post(`/events/edit/${eventId}`, {
        organizerId: userData.id,
        coverPhoto: photoURL, // Save photo URL in the event data
        ...selectedEvent,
        status: selectedEvent.status || "free",
        price: selectedEvent.status === "free" ? 0 : selectedEvent.price || 0,
      });

      dispatch(editEvent(response.data.event));

    } catch (error) {
      console.error("Error editing event:", error);
    }
  };

  const handleSubmit = () => {

    if (isFormComplete) {
      if (coverPhoto) {
        handleImageUpload();
      } else if (isEdit) {
        handleEditEvent(selectedEvent.id);
      } else {
        handleAddEvent();
      }
      dispatch(toggleEventModal());
      dispatch(resetEventModal());
      setPriceEnabled(false);
    }
  };
  const handleStatusChange = (e) => {
    const value = e.target.value;
    setPriceEnabled(value === "paid");
    dispatch(updateSelectedEventField({ id: "status", value }));
    console.log("daz")
    console.log(value)
    if (value === "free") {
      dispatch(updateSelectedEventField({ id: "price", value: null }));
    }
  };
  useEffect(() => {
    if (isEdit && selectedEvent.status === "paid") {
      setPriceEnabled(true);
    } else {
      setPriceEnabled(false);
    }
  }, [isEdit, selectedEvent.status]);
  const handleInputChange = (e) => {
    const payload = e.target;
    dispatch(
      updateSelectedEventField({ id: payload.id, value: payload.value })
    );
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setCoverPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleImageUpload = () => {
    const storage = getStorage();
    const storageRef = ref(storage, `events/${coverPhoto.name}`);
    const uploadTask = uploadBytesResumable(storageRef, coverPhoto);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle progress if needed
      },
      (error) => {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (isEdit) {
            handleEditEvent(selectedEvent.id, downloadURL);
          } else {
            handleAddEvent(downloadURL);
          }
        });
      }
    );
  };

  const handleClickOutside = (event) => {
    const flatpickrNodeStart =
      flatpickrRefStart.current?.flatpickr?.calendarContainer;
    const flatpickrNodeEnd =
      flatpickrRefEnd.current?.flatpickr?.calendarContainer;
    if (
      modalRef.current &&
      !modalRef.current.contains(event.target) &&
      flatpickrNodeStart &&
      !flatpickrNodeStart.contains(event.target) &&
      flatpickrNodeEnd &&
      !flatpickrNodeEnd.contains(event.target)
    ) {
      dispatch(toggleEventModal());
      if (isEdit) {
        dispatch(toggleEventModal());
      }
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      setPriceEnabled(false);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  useEffect(() => {
    const today = new Date().toISOString();
    if (!isEdit) {
      dispatch(
        updateSelectedEventField({
          id: "startDate",
          value: today,
        })
      );
      dispatch(
        updateSelectedEventField({
          id: "endDate",
          value: today,
        })
      );
    }
  }, [isModalOpen]);

  useEffect(() => {
    const allFieldsFilled =
      selectedEvent.name &&
      selectedEvent.description &&
      selectedEvent.location &&
      selectedEvent.startDate &&
      selectedEvent.endDate &&
      (priceEnabled ? selectedEvent.price && selectedEvent.price > 0 : true);
    setIsFormComplete(allFieldsFilled);
  }, [
    selectedEvent.name,
    selectedEvent.description,
    selectedEvent.location,
    selectedEvent.startDate,
    selectedEvent.endDate,
    selectedEvent.price,
    priceEnabled
  ]);
  return (
    <>
      {isModalOpen && <div className="modal-backdrop fade show"></div>}
      <div
        className={modalClassName}
        id="basicModal"
        tabIndex="-1"
        style={{ display: isModalOpen ? "block" : "none" }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog" role="document" ref={modalRef}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel1">
                {isEdit ? "Edit" : "Add"} Event
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  dispatch(resetEventModal());
                  if (isEdit) {
                    dispatch(changeFormState(false));
                  }
                  dispatch(toggleEventModal());
                }}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  placeholder="Enter Name"
                  value={selectedEvent.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  className="form-control"
                  placeholder="Enter Description"
                  value={selectedEvent.description}
                  onChange={handleInputChange}
                  style={{ maxHeight: "120px" }}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="location" className="form-label">
                  Location
                </label>
                <textarea
                  id="location"
                  className="form-control"
                  placeholder="Enter Location"
                  value={selectedEvent.location}
                  style={{ maxHeight: "80px" }}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="coverPhoto" className="form-label">
                  Cover Photo
                </label>
                <input
                  type="file"
                  id="coverPhoto"
                  className="form-control"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
              {
                photoPreview && (
                  <div className="mb-3 text-center">
                    <img
                      src={photoPreview}
                      alt="Cover Preview"
                      className="img-thumbnail"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                )
              }
              <div className="grid-container">
                <div className="col mb-3">
                  <label htmlFor="emailWithTitle" className="form-label">
                    Status
                  </label>
                  <select
                    id="status"
                    className="select2 form-select form-select-md select2-hidden-accessible"
                    data-allow-clear="true"
                    data-select2-id="select2Basic"
                    tabIndex={-1}
                    aria-hidden="true"
                    value={selectedEvent.status}
                    onChange={handleStatusChange}

                  >
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>

                  </select>
                </div>
                <div className="col mb-3">
                  <label htmlFor="spaceCapacity" className="form-label">
                    Price (TND)
                  </label>
                  <input
                    value={priceEnabled || isEdit ? selectedEvent.price : null}
                    onChange={handleInputChange}
                    type="number"
                    id="price"
                    className="form-control"
                    disabled={!priceEnabled || selectedEvent.status === "free"}
                    placeholder="Enter Price"
                  />
                </div>
              </div>
              <div className="grid-container">
                <div className="col">
                  <label htmlFor="startDate" className="form-label">
                    Start Date
                  </label>
                  <Flatpickr
                    id={"startDate"}
                    ref={flatpickrRefStart}
                    value={selectedEvent.startDate || new Date()}
                    onChange={(date) => {
                      const myDate = date[0].toISOString();
                      dispatch(
                        updateSelectedEventField({
                          id: "startDate",
                          value: myDate,
                        })
                      );
                    }}
                    options={{ dateFormat: "Y-m-d" }}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col">
                  <label htmlFor="endDate" className="form-label">
                    End Date
                  </label>
                  <Flatpickr
                    id={"endDate"}
                    ref={flatpickrRefEnd}
                    value={selectedEvent.endDate || new Date()}
                    onChange={(date) => {
                      const myDate = date[0].toISOString();
                      dispatch(
                        updateSelectedEventField({
                          id: "endDate",
                          value: myDate,
                        })
                      );
                    }}
                    options={{ dateFormat: "Y-m-d" }}
                    className="form-control"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-label-secondary me-2"
                onClick={() => {
                  dispatch(resetEventModal());
                  dispatch(toggleEventModal());
                  setPriceEnabled(false);
                }}
              >
                Close
              </button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={!isFormComplete} >
                {isEdit ? "Save" : "Create"}
              </button>
            </div>
          </div >
        </div >
      </div >
    </>
  );
}

export default EventModal;
