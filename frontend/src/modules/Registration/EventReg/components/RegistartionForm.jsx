import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFormData,
  resetFormData,
  fetchFormData,
  initializeWorkshops,
  setAllFull,
  setIsEventForm,
} from "../../../../core/Features/Registration";
import axiosRequest from "../../../../utils/AxiosConfig";
import Flatpickr from "react-flatpickr";
import { useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { storage } from "../../../../utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./RegistrationForm.css";

import socketIOClient from "socket.io-client";
import HeadComponent from "../../../../core/components/Head/CustomHead";
import toast from "react-hot-toast";
import { base64UrlDecode } from "../../../../utils/helpers/base64Helper";

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const { token } = useParams();
  const {
    formFields,
    formData,
    workshopsIds,
    formWorkshops,
    eventId,
    allFull,
    hasMultiSelectForm,
    isEventForm,
  } = useSelector((state) => state.registrationStore);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fileError, setFileError] = useState("");

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const [validated, setValidated] = useState(false);
  const decodedToken = base64UrlDecode(token);
  const [tokenData, setTokenData] = useState();
  useEffect(() => {
    try {
      setTokenData(JSON.parse(decodedToken));
    } catch (error) {
      console.error("Invalid token format", error);
    }
  }, [token]);

  useEffect(() => {
    if (!tokenData) {
      return;
    }
    dispatch(fetchFormData(tokenData.formId));
  }, [tokenData]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    dispatch(updateFormData({ field: id, value }));
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    const currentValues = formData[field.question] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((val) => val !== value);
    dispatch(updateFormData({ field: field.question, value: newValues }));
  };

  const handleRadioChange = (e, field) => {
    const { value } = e.target;
    dispatch(updateFormData({ field: field.question, value }));
  };

  const handleFileChange = async (e) => {
    const { id, files } = e.target;
    const file = files[0];

    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFileError("File size must not exceed 10MB.");
        setIsSubmitDisabled(true);
        return;
      } else {
        setFileError("");
        setIsSubmitDisabled(false);
      }

      const storageRef = ref(storage, `files/${file.name}`);
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        dispatch(updateFormData({ field: id, value: downloadURL }));
      } catch (error) {
        console.error("Error uploading file: ", error);
      }
    }
  };
  // CHECK WORKSHOP STATUS
  const checkWorkshopAndFetchFormData = async () => {
    dispatch(fetchFormData(tokenData.formId));
    try {
      if (formData.workshopId) {
        const workshopResponse = await axiosRequest.get(`/workshop/${formData.workshopId}`);
        const workshopDetails = workshopResponse.data.workshop;
        if (workshopDetails.status === 'open') {
          return true;
        }

        const eventResponse = await axiosRequest.get(`/events/${formData.eventId}`);
        const eventDetails = eventResponse.data.event;
        if (eventDetails.status === 'paid') {
          const hasPaid = await checkPaymentStatus(email);
          if (!hasPaid) {
            return false;
          }
        }
        const emailIsAllowed = eventDetails.allowedList.some((e) => e === email);
        if (!emailIsAllowed) {
          toast.error("Email is not allowed for this event.");
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("Error fetching form or workshop data:", error);
      toast.error("Error fetching form or workshop data.");
      return false; // Stop further processing on error
    }
  };
  const checkPaymentStatus = async (email) => {
    try {
      const response = await axiosRequest.get(`/participant/get-event/ ${eventId}`);
      const data = response.data.participants;
      const participant = data.find((p) => p.email === email);
      if (!participant) {
        console.error("Participant not found")
        return false;
      }

      if (participant.status !== "Paid") {
        toast.error("You must complete the payment to register for this session.");
        return false;
      }
      return true;

    } catch (error) {
      console.error("Error fetching participants: ", error);
      return false;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const verif = await checkWorkshopAndFetchFormData()
    if (!verif) {
      e.stopPropagation();
      return
    }

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(false);

    const responses = formFields.map((field) => ({
      question: field.question,
      answer: formData[field.question] || "",
    }));

    const baseSubmissionData = {
      fullName,
      email,
      phoneNumber,
      status: "Pending",
      eventId,
      responses,
    };

    try {
      if (isEventForm) {
        try {
          const response = await axiosRequest.post(
            "/participant/add",
            baseSubmissionData
          );

          axiosRequest
            .post("/notification/add", {
              from: response.data.participant.id,
              to: formData.event.organizerId,
              type: "EventRegistration",
              message: `A new participant has registered for your event: ${formData.event.name}`,
              read: false,
            })
            .then((res) => {
              socket.emit("create-notification", {
                organizerId: formData.event.organizerId,
                notification: res.data.notification,
              });
            });

          if (socket) {
            socket.emit("addEventParticipant", {
              participant: response.data.participant,
              roomId: `${eventId}`,
            });
          }
        } catch (err) {
          toast.error("Participant already registered for this event");
          return;
        }
      } else {
        const workshopQuestions = formFields
          .filter((field) => field.type === "workshop-selection")
          .map((field) => field.question);
        const selectedWorkshops = [];
        workshopQuestions.forEach((question) => {
          // Step 3: Accumulate the selected workshop IDs from formData
          if (formData[question]) {
            selectedWorkshops.push(...formData[question]);
          }
        });
        if (hasMultiSelectForm && selectedWorkshops.length === 0) {
          toast.error("Please select at least one workshop");
          return;
        }
        if (hasMultiSelectForm) {
          for (const workshopId of selectedWorkshops) {
            const submissionData = {
              ...baseSubmissionData,
              workshopId: workshopId,
            };
            const response = await axiosRequest.post(
              "/participant/submit",
              submissionData
            );

            if (socket) {
              socket.emit("addEventParticipant", {
                participant: response.data.participant,
                roomId: `${eventId}/${workshopId}`,
              });
            }
          }
        } else {
          for (const workshopId of workshopsIds) {
            const submissionData = {
              ...baseSubmissionData,
              workshopId: workshopId,
            };
            const response = await axiosRequest.post(
              "/participant/submit",
              submissionData
            );

            if (socket) {
              socket.emit("addEventParticipant", {
                participant: response.data.participant,
                roomId: `${eventId}/${workshopId}`,
              });
            }
          }
        }
      }

      const { name, description, deadline } = formData;
      dispatch(updateFormData({ field: "name", value: name }));
      dispatch(updateFormData({ field: "description", value: description }));
      dispatch(updateFormData({ field: "deadline", value: deadline }));

      const { event } = formData;

      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setShowModal(true);
    } catch (error) {
      console.log(error)
      toast.error("An unexpected error occurred. Please try again.");

    }
  };

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = socketIOClient(
      import.meta.env.VITE_BACKEND.split("/api")[0]
    );
    setSocket(newSocket);
    newSocket.on("connect", () => {
      if (eventId) {
        newSocket.emit("joinRoom", `${eventId}`);
      }
      if (workshopsIds) {
        workshopsIds.forEach((workshopId) => {
          newSocket.emit("joinRoom", `${eventId}/${workshopId}`);
        });
      }
    });

    return () => newSocket.disconnect();
  }, [eventId, workshopsIds]);

  useEffect(() => {
    if (workshopsIds && workshopsIds.length !== 0) {
      axiosRequest
        .post("/workshop/get-many", {
          workshopsIds,
        })
        .then((res) => {
          dispatch(initializeWorkshops(res.data.workshops));
          var allFull = true;
          for (let i = 0; i < res.data.workshops.length; i++) {
            const workshop = res.data.workshops[i];
            if (workshop.numberOfAttendees > workshop.currentParticipants) {
              allFull = false;
              break;
            }
          }
          dispatch(setAllFull(allFull));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          return;
        });
    } else {
      dispatch(setIsEventForm(true));
      dispatch(setAllFull(false));
    }
  }, [workshopsIds]);

  useEffect(() => {
    if (workshopsIds && workshopsIds.length !== 0) {
      dispatch(setIsEventForm(false));
      dispatch(setAllFull(false));
    }
  }, [workshopsIds]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  return (
    <div className="container-fluid ">


      <HeadComponent
        title={formData.event ? formData.event.name : "Event Registration"}
        description={formData.event ? formData.event.description : "Register for the event"}
        image="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/assets/img/pages/app-academy-tutor-3.png"
      />

      <div className="form-container d-flex justify-content-center align-items-center">
        <div className="card border-0" style={{ width: '100%', maxWidth: '900px' }}>
          <div className="card-body">
            {formData.event && (
              <>
                <div className="form-section">
                  <h4 className="form-title mb-2">{formData.event.name}</h4>
                </div>
              </>
            )}
            {/* Image Banner */}
            <div className="image-banner">
              <img
                src="/assets/tsyp.jpg"
                alt="Event Banner"
                className="img-fluid"
              />
            </div>
            {formData.event && (
              <>
                <div className="form-section">
                  <div className="form-section-header">Event Name</div>
                  <p className="form-section-content">{formData.event.name}</p>
                </div>
                <div className="form-section">
                  <div className="form-section-header">Description</div>
                  <p className="form-section-content">{formData.event.description}</p>
                </div>
                <div className="form-section">
                  <div className="form-section-header">Deadline</div>
                  <p className="form-section-content">
                    {new Date(formData.deadline).toLocaleString()}
                  </p>
                </div>
              </>
            )}
            {allFull ? (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <span style={{ textAlign: "center" }}>
                  {hasMultiSelectForm
                    ? "All sessions are full"
                    : "Session is full"}
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className={`needs-validation ${validated ? "was-validated" : ""
                  }`}
              >
                <div className="mb-3">
                  <label className="form-label" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <div className="invalid-feedback">
                    Full Name is required.
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                  <div className="invalid-feedback">Email is required.</div>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="phoneNumber">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <div className="invalid-feedback">
                    Phone Number is required.
                  </div>
                </div>
                {formFields && formFields.length > 0 ? (
                  formFields.map((field, index) => (
                    <div key={index} className="mb-3">
                      <label className="form-label" htmlFor={field.question}>
                        {field.question}
                      </label>
                      {field.type === "input" && (
                        <input
                          type="text"
                          className="form-control"
                          id={field.question}
                          value={formData[field.question] || ""}
                          onChange={handleInputChange}
                          required
                        />
                      )}
                      {field.type === "checkbox" && (
                        <div>
                          {field.options.map((option, idx) => (
                            <div key={idx} className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id={`${field.question}-${idx}`}
                                value={option}
                                checked={
                                  formData[field.question]?.includes(
                                    option
                                  ) || false
                                }
                                onChange={(e) =>
                                  handleCheckboxChange(e, field)
                                }
                                required
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`${field.question}-${idx}`}
                              >
                                {option}
                              </label>
                            </div>
                          ))}
                          <div className="invalid-feedback">
                            {field.question} is required.
                          </div>
                        </div>
                      )}
                      {field.type === "radio" && (
                        <div>
                          {field.options.map((option, idx) => (
                            <div key={idx} className="form-check">
                              <input
                                type="radio"
                                className="form-check-input"
                                name={field.question}
                                id={`${field.question}-${idx}`}
                                value={option}
                                checked={formData[field.question] === option}
                                onChange={(e) => handleRadioChange(e, field)}
                                required
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`${field.question}-${idx}`}
                              >
                                {option}
                              </label>
                            </div>
                          ))}
                          <div className="invalid-feedback">
                            {field.question} is required.
                          </div>
                        </div>
                      )}
                      {field.type === "file" && (
                        <div>
                          <input
                            type="file"
                            className="form-control"
                            id={field.question}
                            onChange={handleFileChange}
                            required={field.required}
                          />
                          {fileError && (
                            <div className="invalid-feedback d-block">
                              {fileError}
                            </div>
                          )}
                        </div>
                      )}
                      {field.type === "dropdown" && (
                        <select
                          className="form-select"
                          id={field.question}
                          value={formData[field.question] || ""}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select {field.question}</option>
                          {field.options.map((option, idx) => (
                            <option key={idx} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}
                      {field.type === "date" && (
                        <Flatpickr
                          id={field.question}
                          value={formData[field.question] || ""}
                          onChange={(date) =>
                            dispatch(
                              updateFormData({
                                field: field.question,
                                value: date[0],
                              })
                            )
                          }
                          options={{ dateFormat: "Y-m-d" }}
                          className="form-control"
                          required
                        />
                      )}
                      {field.type === "time" && (
                        <Flatpickr
                          id={field.question}
                          value={formData[field.question] || ""}
                          onChange={(time) =>
                            dispatch(
                              updateFormData({
                                field: field.question,
                                value: time[0],
                              })
                            )
                          }
                          options={{
                            enableTime: true,
                            noCalendar: true,
                            dateFormat: "H:i",
                          }}
                          className="form-control"
                          required
                        />
                      )}
                      {field.type === "workshop-selection" && (
                        <div className="form-check" required>
                          {field.options.map((option, idx) => {
                            const workshop = formWorkshops.find(
                              (element) =>
                                element.id.toString() === option.toString()
                            );
                            const isFull =
                              workshop?.numberOfAttendees <=
                              workshop?.currentParticipants;
                            return (
                              !isFull && (
                                <div key={idx}>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`${field.question}-${idx}`}
                                    value={option}
                                    checked={
                                      formData[field.question]?.includes(
                                        option
                                      ) || false
                                    }
                                    onChange={(e) =>
                                      handleCheckboxChange(e, field)
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`${field.question}-${idx}`}
                                  >
                                    {workshop?.name}
                                  </label>
                                </div>
                              )
                            );
                          })}
                          <div className="invalid-feedback">
                            {field.question} is required.
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div>No fields to display</div>
                )}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitDisabled}
                >
                  Submit
                </button>
              </form>
            )}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Registration Successful</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Thank you! Your registration is successful.
              </Modal.Body>
              <Modal.Footer>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );

};



export default RegistrationForm;