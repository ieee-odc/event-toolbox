import React, { useState } from 'react'
import Button from '../../../core/components/Button/Button'
import './Login.css'

function Login() {
  const [obscureText,setObscureText]=useState(true)
  const toggleObscureText=()=>{
    setObscureText(prev=>!prev)
  }
  return (
    <div className="container-xxl">
  <div className="authentication-wrapper authentication-basic container-p-y">
    <div className="authentication-inner">
      <div className="card">
        <div className="card-body">
          
          
          <h4 className="mb-2">Welcome to Event Box! 👋</h4>
          <p className="mb-4">Please sign-in to your account and start the adventure</p>

          <form id="formAuthentication" className="mb-3" action="index.html">
            <div className="mb-3 form-email-toggle ">
              <label htmlFor="email" className="col-auto col-form-label">Email or Username</label>
              <input type="text" className="form-control" id="email" name="email-username" placeholder="Enter your email or username" autoFocus=""/>
            </div>

            <div className="mb-3 form-password-toggle">
              <div className="d-flex justify-content-between">
                <label className="form-label" htmlFor="password">Password</label>
                <a href="auth-forgot-password-basic.html">
                  <small>Forgot Password?</small>
                </a>
              </div>
              <div className="input-group input-group-merge">
                <input type={obscureText?"password":"text"} id="password" className="form-control" name="password" placeholder="············" aria-describedby="password"/>
                <span className="input-group-text cursor-pointer" onClick={toggleObscureText}><i className={`bx ${obscureText ? 'bx-hide' : 'bx-show'}`}></i></span>
              </div>
            </div>
            <div className="mb-3">
              <div className="form-check" style={{display:"flex",gap:"10px"}}>
                <input className="form-check-input" type="checkbox" id="remember-me"/>
                <label className="form-check-label" htmlFor="remember-me">
                  Remember Me
                </label>
              </div>
            </div>
            <div className="mb-3">
              
              <Button color={"primary"}/>
            </div>
          </form>

          <p className="text-center move-down">
            <span  className="space-right">New on our platform?</span>
            <a href="auth-register-basic.html">
              <span>Create an account</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export default Login
