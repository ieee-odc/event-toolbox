import React from 'react';
import { Link } from 'react-router-dom';
import './Success.css';

function Success() {
  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">
          <div className="card">
            <div className="card-body text-center">
              <h4 className="mb-2">User Sign Up Successful! 🎉</h4>
              <p className="mb-4">Your account has been created successfully.</p>
              <Link to="/login" className="btn btn-primary">Go to Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Success;
