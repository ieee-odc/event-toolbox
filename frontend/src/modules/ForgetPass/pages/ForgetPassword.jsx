import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import './ForgetPassword.css';

function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const onChange = (e) => setEmail(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset link sent to your email');
      setError('');
    } catch (err) {
      console.error(err.message);
      setError('An error occurred. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">
          <div className="card">
            <div className="card-body">
              <h4 className="mb-2">Forgot Password? 🔒</h4>
              <p className="mb-4">Enter your email and we'll send you instructions to reset your password</p>
              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}
              <form id="formAuthentication" className="mb-3" onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" name="email" value={email} onChange={onChange} placeholder="Enter your email" autoFocus />
                </div>
                <button className="btn btn-primary d-grid w-100" onClick={onSubmit}>Send Reset Link</button>
              </form>
              <div className="text-center">
                <a href="/login" className="d-flex align-items-center justify-content-center">
                  <i className="bx bx-chevron-left scaleX-n1-rtl bx-sm"></i>
                  Back to login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
