import React, { useState } from 'react';
import Button from '../../../core/components/Button/Button';
import './SignUp.css';

function SignUp() {
  const [obscureText, setObscureText] = useState(true);
  const toggleObscureText = () => {
    setObscureText((prev) => !prev);
  };

  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">
          <div className="card">
            <div className="card-body">
              <h4 className="mb-2">Adventure starts here 🚀</h4>
              <p className="mb-4">Make your app management easy and fun!</p>

              <form id="formAuthentication" className="mb-3" action="index.html">
                <div className="mb-3 form-email-toggle">
                  <label htmlFor="username" className="col-auto col-form-label">Username</label>
                  <input type="text" className="form-control" id="username" name="username" placeholder="Enter your username" autoFocus />
                </div>

                <div className="mb-3 form-email-toggle">
                  <label htmlFor="email" className="col-auto col-form-label">Email</label>
                  <input type="text" className="form-control" id="email" name="email" placeholder="Enter your email" />
                </div>

                <div className="mb-3 form-password-toggle">
                  <div className="d-flex justify-content-between">
                    <label className="form-label" htmlFor="password">Password</label>
                  </div>
                  <div className="input-group input-group-merge">
                    <input type={obscureText ? "password" : "text"} id="password" className="form-control" name="password" placeholder="············" aria-describedby="password" />
                    <span className="input-group-text cursor-pointer" onClick={toggleObscureText}><i className={`bx ${obscureText ? 'bx-hide' : 'bx-show'}`}></i></span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-check" style={{ display: "flex", gap: "10px" }}>
                    <input className="form-check-input" type="checkbox" id="terms-conditions" name="terms" />
                    <label className="form-check-label" htmlFor="terms-conditions">
                      I agree to
                      <a style={{marginLeft: '10px'}}  href="javascript:void(0);">privacy policy & terms</a>
                    </label>
                  </div>
                </div>

                <div className="mb-3">
                  <Button color={"primary"} label="Sign up" />
                </div>
              </form>

              <p className="text-center move-down">
                <span className="space-right">Already have an account?</span>
                <a href="/Login">
                  <span>Sign in instead</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
