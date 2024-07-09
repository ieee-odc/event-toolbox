import React from 'react';
import './RegistrationForm.css'

function RegistartionForm() {
    return (
        <div className="container-fluid vh-100">
          <div className="row no-gutters h-100">
            <div className="col-md-6">
              <div className="card h-100 border-0">
                <div className="card-body">
                  <h4 className="mb-2">Bootstrap Validation</h4>
                  <form className="needs-validation" noValidate="">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="bs-validation-name">Name</label>
                      <input type="text" className="form-control" id="bs-validation-name" placeholder="John Doe" required=""/>
                      <div className="valid-feedback"> Looks good! </div>
                      <div className="invalid-feedback"> Please enter your name. </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="bs-validation-email">Email</label>
                      <input type="email" id="bs-validation-email" className="form-control" placeholder="john.doe" aria-label="john.doe" required=""/>
                      <div className="valid-feedback"> Looks good! </div>
                      <div className="invalid-feedback"> Please enter a valid email </div>
                    </div>
                    <div className="mb-3 form-password-toggle">
                      <label className="form-label" htmlFor="bs-validation-password">Password</label>
                      <div className="input-group input-group-merge">
                        <input type="password" id="bs-validation-password" className="form-control" placeholder="············" required=""/>
                        <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                      </div>
                      <div className="valid-feedback"> Looks good! </div>
                      <div className="invalid-feedback"> Please enter your password. </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="bs-validation-country">Country</label>
                      <select className="form-select" id="bs-validation-country" required="">
                        <option value="">Select Country</option>
                        <option value="usa">USA</option>
                        <option value="uk">UK</option>
                        <option value="france">France</option>
                        <option value="australia">Australia</option>
                        <option value="spain">Spain</option>
                      </select>
                      <div className="valid-feedback"> Looks good! </div>
                      <div className="invalid-feedback"> Please select your country </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="bs-validation-dob">DOB</label>
                      <input type="text" className="form-control flatpickr-validation flatpickr-input" id="bs-validation-dob" required="" readOnly="readonly"/>
                      <div className="valid-feedback"> Looks good! </div>
                      <div className="invalid-feedback"> Please Enter Your DOB </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="bs-validation-upload-file">Profile pic</label>
                      <input type="file" className="form-control" id="bs-validation-upload-file" required=""/>
                    </div>
                    <div className="mb-3">
                      <label className="d-block form-label">Gender</label>
                      <div className="form-check mb-2">
                        <input type="radio" id="bs-validation-radio-male" name="bs-validation-radio" className="form-check-input" required="" checked=""/>
                        <label className="form-check-label" htmlFor="bs-validation-radio-male">Male</label>
                      </div>
                      <div className="form-check">
                        <input type="radio" id="bs-validation-radio-female" name="bs-validation-radio" className="form-check-input" required=""/>
                        <label className="form-check-label" htmlFor="bs-validation-radio-female">Female</label>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="bs-validation-bio">Bio</label>
                      <textarea className="form-control" id="bs-validation-bio" name="bs-validation-bio" rows="3" required=""></textarea>
                    </div>
                    <div className="mb-3">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="bs-validation-checkbox" required=""/>
                        <label className="form-check-label" htmlFor="bs-validation-checkbox">Agree to our terms and conditions</label>
                        <div className="invalid-feedback"> You must agree before submitting. </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="switch switch-primary">
                        <input type="checkbox" className="switch-input" required="" />
                        <span className="switch-toggle-slider">
                          <span className="switch-on"></span>
                          <span className="switch-off"></span>
                        </span>
                        <span className="switch-label">Send me related emails</span>
                      </label>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <button type="submit" className="btn btn-primary">Submit</button>
                      </div>
                    </div>
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
}

export default RegistartionForm;
