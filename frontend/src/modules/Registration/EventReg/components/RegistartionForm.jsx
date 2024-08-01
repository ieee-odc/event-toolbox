import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFormData,
  resetFormData,
  fetchFormData,
  initializeWorkshops,
} from "../../../../core/Features/Registration";
import axiosRequest from "../../../../utils/AxiosConfig";
import Flatpickr from "react-flatpickr";
import { useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { storage } from "../../../../utils/firebaseConfig"; // Adjust the path as needed
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./RegistrationForm.css";

import socketIOClient from "socket.io-client";
import HeadComponent from "../../../../core/components/Head/CustomHead";

const base64UrlDecode = (str) => {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
};

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const { token } = useParams();
  const {
    formFields,
    formData,
    loading,
    error,
    workshopsIds,
    workshopId,
    formWorkshops,
    eventId,
  } = useSelector((state) => state.registrationStore);
  const decodedToken = base64UrlDecode(token);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [checkboxValidation, setCheckboxValidation] = useState({});
  let tokenData;

  try {
    tokenData = JSON.parse(decodedToken);
  } catch (error) {
    console.error("Invalid token format", error);
  }

  useEffect(() => {
    const fetchData = async () => {
      const action = dispatch(fetchFormData(tokenData.formId));
    };
    fetchData();
  }, [tokenData.formId]);

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

    setCheckboxValidation((prevState) => ({
      ...prevState,
      [field.question]: newValues.length > 0,
    }));
  };

  const handleRadioChange = (e, field) => {
    const { value } = e.target;
    dispatch(updateFormData({ field: field.question, value }));
  };

  const handleFileChange = async (e) => {
    const { id, files } = e.target;
    const file = files[0];

    if (file) {
      const storageRef = ref(storage, `files/${file.name}`);
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        console.log(downloadURL);
        dispatch(updateFormData({ field: id, value: downloadURL }));
      } catch (error) {
        console.error("Error uploading file: ", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    let valid = true;
    const newCheckboxValidation = {};
    formFields.forEach((field) => {
      if (field.type === "checkbox") {
        const isValid =
          formData[field.question] && formData[field.question].length > 0;
        newCheckboxValidation[field.question] = isValid;
        if (!isValid) valid = false;
      }
    });
    setCheckboxValidation(newCheckboxValidation);

    if (form.checkValidity() === false || !valid) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

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
      workshopId,
      responses,
    };

    try {
      // Check if formWorkshops exist and have items
      if (formWorkshops && formWorkshops.length > 0) {
        for (const workshop of formWorkshops) {
          const submissionData = {
            ...baseSubmissionData,
            workshopId: workshop.id,
          };

          const response = await axiosRequest.post(
            "/participant/submit",
            submissionData
          );

          if (socket) {
            socket.emit("addEventParticipant", response.data.participant);
          }
        }
      } else {
        // Submit without workshopId if formWorkshops is empty or not provided
        const response = await axiosRequest.post(
          "/participant/submit",
          baseSubmissionData
        );

        if (socket) {
          socket.emit("addEventParticipant", response.data.participant);
        }
      }

      const { name, description, deadline } = formData;
      dispatch(resetFormData());
      dispatch(updateFormData({ field: "name", value: name }));
      dispatch(updateFormData({ field: "description", value: description }));
      dispatch(updateFormData({ field: "deadline", value: deadline }));

      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setCheckboxValidation({});
      setValidated(false);
      setShowModal(true);
    } catch (error) {
      console.error("Error submitting form data: ", error);
    }
  };

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = socketIOClient(import.meta.env.VITE_BACKEND);
    setSocket(newSocket);
    if (eventId) {
      newSocket.emit("joinRoom", eventId);
    }
    return () => newSocket.disconnect();
  }, [eventId]);

  useEffect(() => {
    if (workshopsIds.length !== 0) {
      axiosRequest
        .post("/workshop/get-many", {
          workshopsIds,
        })
        .then((res) => {
          dispatch(initializeWorkshops(res.data.workshops));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [workshopsIds]);
  return (
    <div className="container-fluid vh-100">
      <HeadComponent
        title={formData.name}
        description={formData.description}
        image="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/assets/img/pages/app-academy-tutor-3.png"
      />

      <div className="row no-gutters h-100">
        <div className="col-md-6">
          <div className="card h-100 border-0">
            <div className="card-body">
              <h4 className="form-title mb-2">Registration Form</h4>
              {formData.name && (
                <div className="form-section">
                  <div className="form-section-header">Name</div>
                  <p className="form-section-content">{formData.name}</p>
                </div>
              )}
              {formData.description && (
                <div className="form-section">
                  <div className="form-section-header">Description</div>
                  <p className="form-section-content">{formData.description}</p>
                </div>
              )}
              {formData.deadline && (
                <div className="form-section">
                  <div className="form-section-header">Deadline</div>
                  <p className="form-section-content">
                    {new Date(formData.deadline).toLocaleString()}
                  </p>
                </div>
              )}
              <form
                onSubmit={handleSubmit}
                className={`needs-validation ${validated ? "was-validated" : ""
                  }`}
                noValidate
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
                  <div className="invalid-feedback">Full Name is required.</div>
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
                    onChange={(e) => setEmail(e.target.value)}
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
                                  formData[field.question]?.includes(option) ||
                                  false
                                }
                                onChange={(e) => handleCheckboxChange(e, field)}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`${field.question}-${idx}`}
                              >
                                {option}
                              </label>
                            </div>
                          ))}
                          <div
                            className="invalid-feedback"
                            style={{
                              display:
                                validated && !checkboxValidation[field.question]
                                  ? "block"
                                  : "none",
                            }}
                          >
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
                        <input
                          type="file"
                          className="form-control"
                          id={field.question}
                          onChange={handleFileChange}
                          required
                        />
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
                        <div>
                          {field.options.map((option, idx) => {
                            const workshop = formWorkshops.find(
                              (element) =>
                                element.id.toString() === option.toString()
                            );
                            return (
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
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`${field.question}-${idx}`}
                                >
                                  {workshop?.name}
                                </label>
                              </div>
                            );
                          })}
                          <div
                            className="invalid-feedback"
                            style={{
                              display:
                                validated && !checkboxValidation[field.question]
                                  ? "block"
                                  : "none",
                            }}
                          >
                            {field.question} is required.
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div>No fields to display</div>
                )}
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
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
        <div className="col-md-6 d-none d-md-block">
          <div
            className="bg-cover h-100"
            style={{ backgroundImage: "url('/assets/tsyp.jpg')" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
