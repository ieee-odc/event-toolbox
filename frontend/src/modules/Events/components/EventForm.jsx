import React, { useState } from "react";

function EventForm() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <h4 className="py-3 mb-4">
        <span className="text-muted fw-light">Forms /</span> Horizontal Layouts
      </h4>

      {/* Basic Layout & Basic with Icons */}
      <div className="row">
        {/* Basic Layout */}
        <div className="col-xxl">
          <div className="card mb-4">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="mb-0">Basic Layout</h5>
              <small className="text-muted float-end">Default label</small>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <label className="col-sm-2 col-form-label" htmlFor="name">
                    Name
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-2 col-form-label" htmlFor="company">
                    Company
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      id="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="ACME Inc."
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-2 col-form-label" htmlFor="email">
                    Email
                  </label>
                  <div className="col-sm-10">
                    <div className="input-group input-group-merge">
                      <input
                        type="text"
                        id="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john.doe"
                        aria-label="john.doe"
                        aria-describedby="email-addon"
                      />
                      <span className="input-group-text" id="email-addon">
                        @example.com
                      </span>
                    </div>
                    <div className="form-text">
                      You can use letters, numbers &amp; periods
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-2 col-form-label" htmlFor="phone">
                    Phone No
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      id="phone"
                      className="form-control phone-mask"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="658 799 8941"
                      aria-label="658 799 8941"
                      aria-describedby="phone-addon"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-2 col-form-label" htmlFor="message">
                    Message
                  </label>
                  <div className="col-sm-10">
                    <textarea
                      id="message"
                      className="form-control"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Hi, Do you have a moment to talk Joe?"
                      aria-label="Hi, Do you have a moment to talk Joe?"
                      aria-describedby="message-addon"
                    ></textarea>
                  </div>
                </div>
                <div className="row justify-content-end">
                  <div className="col-sm-10">
                    <button type="submit" className="btn btn-primary">
                      Send
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-xxl">
          <div className="card mb-4">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="mb-0">Basic with Icons</h5>
              <small className="text-muted float-end">Merged input group</small>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <label
                    className="col-sm-2 col-form-label"
                    htmlFor="icon-name"
                  >
                    Name
                  </label>
                  <div className="col-sm-10">
                    <div className="input-group input-group-merge">
                      <span className="input-group-text" id="icon-name-addon">
                        <i className="bx bx-user"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="icon-name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        aria-label="John Doe"
                        aria-describedby="icon-name-addon"
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    className="col-sm-2 col-form-label"
                    htmlFor="icon-company"
                  >
                    Company
                  </label>
                  <div className="col-sm-10">
                    <div className="input-group input-group-merge">
                      <span
                        id="icon-company-addon"
                        className="input-group-text"
                      >
                        <i className="bx bx-buildings"></i>
                      </span>
                      <input
                        type="text"
                        id="icon-company"
                        className="form-control"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="ACME Inc."
                        aria-label="ACME Inc."
                        aria-describedby="icon-company-addon"
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    className="col-sm-2 col-form-label"
                    htmlFor="icon-email"
                  >
                    Email
                  </label>
                  <div className="col-sm-10">
                    <div className="input-group input-group-merge">
                      <span className="input-group-text">
                        <i className="bx bx-envelope"></i>
                      </span>
                      <input
                        type="text"
                        id="icon-email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john.doe"
                        aria-label="john.doe"
                        aria-describedby="icon-email-addon"
                      />
                      <span id="icon-email-addon" className="input-group-text">
                        @example.com
                      </span>
                    </div>
                    <div className="form-text">
                      You can use letters, numbers &amp; periods
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-2 form-label" htmlFor="icon-phone">
                    Phone No
                  </label>
                  <div className="col-sm-10">
                    <div className="input-group input-group-merge">
                      <span id="icon-phone-addon" className="input-group-text">
                        <i className="bx bx-phone"></i>
                      </span>
                      <input
                        type="text"
                        id="icon-phone"
                        className="form-control phone-mask"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="658 799 8941"
                        aria-label="658 799 8941"
                        aria-describedby="icon-phone-addon"
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-2 form-label" htmlFor="icon-message">
                    Message
                  </label>
                  <div className="col-sm-10">
                    <div className="input-group input-group-merge">
                      <span
                        id="icon-message-addon"
                        className="input-group-text"
                      >
                        <i className="bx bx-comment"></i>
                      </span>
                      <textarea
                        id="icon-message"
                        className="form-control"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Hi, Do you have a moment to talk Joe?"
                        aria-label="Hi, Do you have a moment to talk Joe?"
                        aria-describedby="icon-message-addon"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="row justify-content-end">
                  <div className="col-sm-10">
                    <button type="submit" className="btn btn-primary">
                      Send
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Form */}
      <div className="card mb-4">
        <h5 className="card-header">Horizontal Form</h5>
        <div className="card-body">
          <form>
            <div className="row mb-3">
              <label
                className="col-sm-2 col-form-label"
                htmlFor="horizontal-name"
              >
                Name
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  id="horizontal-name"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                className="col-sm-2 col-form-label"
                htmlFor="horizontal-email"
              >
                Email
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  id="horizontal-email"
                  className="form-control"
                  placeholder="john.doe@example.com"
                  aria-label="john.doe@example.com"
                  aria-describedby="horizontal-email-addon"
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                className="col-sm-2 col-form-label"
                htmlFor="horizontal-password"
              >
                Password
              </label>
              <div className="col-sm-10">
                <input
                  type="password"
                  id="horizontal-password"
                  className="form-control"
                  placeholder="********"
                  aria-label="********"
                  aria-describedby="horizontal-password-addon"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-10 offset-sm-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="horizontal-remember-me"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="horizontal-remember-me"
                  >
                    Remember Me
                  </label>
                </div>
              </div>
            </div>
            <div className="row justify-content-end">
              <div className="col-sm-10">
                <button type="submit" className="btn btn-primary">
                  Sign in
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EventForm;
