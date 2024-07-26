// RegistrationForm.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFormData, resetFormData, fetchFormData } from "../../../../core/Features/Registration";
import axiosRequest from "../../../../utils/AxiosConfig";
import Flatpickr from "react-flatpickr";
import { useParams } from "react-router-dom";
import "./RegistrationForm.css";

const base64UrlDecode = (str) => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
};

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const { token } = useParams();
  const { formFields, formData, loading, error } = useSelector((state) => state.registrationStore);
  const decodedToken = base64UrlDecode(token);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [eventId, setEventId] = useState(null);
  let tokenData;

  try {
    tokenData = JSON.parse(decodedToken);
  } catch (error) {
    console.error("Invalid token format", error);
  }

  useEffect(() => {
    const fetchData = async () => {
      const action = await dispatch(fetchFormData(tokenData.formId));
      if (fetchFormData.fulfilled.match(action)) {
        setEventId(action.payload.eventId);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    dispatch(updateFormData({ field: id, value }));
  };

  const handleMultiSelectChange = (e, field) => {
    const { value, checked } = e.target;
    const currentValues = formData[field.question] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((val) => val !== value);
    dispatch(updateFormData({ field: field.question, value: newValues }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const responses = formFields.map(field => ({
      question: field.question,
      answer: formData[field.question] || ""
    }));

    const submissionData = {
      fullName,
      email,
      phoneNumber,
      status: "Pending",
      eventId,
      responses
    };

    try {
      const response = await axiosRequest.post("/participant/submit", submissionData);
      console.log("Form data submitted: ", response.data);
      dispatch(resetFormData());
    } catch (error) {
      console.error("Error submitting form data: ", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container-fluid vh-100">
      <div className="row no-gutters h-100">
        <div className="col-md-6">
          <div className="card h-100 border-0">
            <div className="card-body">
              <h4 className="mb-2">Registration Form</h4>
              {formData.name && (
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <p>{formData.name}</p>
                </div>
              )}
              {formData.description && (
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <p>{formData.description}</p>
                </div>
              )}
              {formData.deadline && (
                <div className="mb-3">
                  <label className="form-label">Deadline</label>
                  <p>{new Date(formData.deadline).toLocaleString()}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                <div className="mb-3">
                  <label className="form-label" htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
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
                                checked={formData[field.question]?.includes(option) || false}
                                onChange={(e) => handleMultiSelectChange(e, field)}
                              />
                              <label className="form-check-label" htmlFor={`${field.question}-${idx}`}>
                                {option}
                              </label>
                            </div>
                          ))}
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
                                onChange={handleInputChange}
                              />
                              <label className="form-check-label" htmlFor={`${field.question}-${idx}`}>
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      {field.type === "file" && (
                        <input
                          type="file"
                          className="form-control"
                          id={field.question}
                          onChange={handleInputChange}
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
                          className="form-control"
                          id={field.question}
                          value={formData[field.question] || ""}
                          onChange={(date) => handleInputChange({ target: { id: field.question, value: date[0] } })}
                          options={{ dateFormat: "Y-m-d" }}
                        />
                      )}
                      {field.type === "time" && (
                        <Flatpickr
                          className="form-control"
                          id={field.question}
                          value={formData[field.question] || ""}
                          onChange={(time) => handleInputChange({ target: { id: field.question, value: time[0] } })}
                          options={{ enableTime: true, noCalendar: true, dateFormat: "H:i" }}
                        />
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
            </div>
          </div>
        </div>
        <div className="col-md-6 d-none d-md-block">
          <div className="bg-cover h-100" style={{ backgroundImage: "url('/assets/tsyp.jpg')" }}></div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
