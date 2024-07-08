import React from 'react';
import './Success.css';
import Button from '../../../core/components/Button/Button';
import { useNavigate } from 'react-router-dom';

function Success() {
  const navigate=useNavigate();
  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">
          <div className="card">
            <div className="card-body text-center">
              <h4 className="mb-2">User Sign Up Successful! 🎉</h4>
              <p className="mb-4">Your account has been created successfully.</p>
              <button className='btn btn-primary' onClick={()=>{
                navigate("/login")
              }}>Go to Login</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Success;
