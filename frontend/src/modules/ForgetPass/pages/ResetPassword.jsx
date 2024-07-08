import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosRequest from '../../../utils/AxiosConfig';
import './ForgetPassword.css';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const onChange = (e) => setNewPassword(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = new URLSearchParams(location.search).get('token');
    try {
      const res = await axiosRequest.post(`/auth/resetpassword?token=${token}`, { newPassword });
      setMessage(res.data.msg);
      setError('');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage('');
      setError(err.response?.data?.msg || 'An error occurred');
    }
  };

  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">
          <div className="card">
            <div className="card-body">
              <h4 className="mb-2">Reset Password 🔒</h4>
              <p className="mb-4">Enter your new password below:</p>
              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}
              <form id="formAuthentication" className="mb-3" onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input type="password" className="form-control" id="newPassword" name="newPassword" value={newPassword} onChange={onChange} placeholder="Enter your new password" autoFocus />
                </div>
                <button className="btn btn-primary d-grid w-100" onClick={onSubmit}>Reset Password</button>
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

export default ResetPassword;
