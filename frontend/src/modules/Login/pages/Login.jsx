import React, { useState } from 'react';
import Button from '../../../core/components/Button/Button';
import GoogleLoginButton from '../../../core/components/GoogleAuthButton/GoogleLoginButton';
import './Login.css';
import axiosRequest from '../../../utils/AxiosConfig';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  
  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    const errors = {};
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    return errors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    try {
      const res = await axiosRequest.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/success');
    } catch (err) {
      console.error(err.response.data);
      setErrors({ server: err.response.data.msg });
    }
  };

  const onGoogleSuccess = async (response) => {
    try {
      const res = await axiosRequest.post('/auth/google-auth', { tokenId: response.user.accessToken});
      localStorage.setItem('token', res.data.token);
      navigate('/success');
    } catch (err) {
      console.error(err.response.data);
      setErrors({ server: err.response.data.msg });
    }
  };

  const onGoogleFailure = (response) => {
    setErrors({ server: 'Google login failed' });
  };

  const [obscureText, setObscureText] = useState(true);
  const toggleObscureText = () => {
    setObscureText(prev => !prev);
  };

  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">
          <div className="card">
            <div className="card-body">
              <h4 className="mb-2">Welcome to Event Box! 👋</h4>
              <p className="mb-4">Please sign-in to your account and start the adventure</p>
              {errors.server && <div className="alert alert-danger">{errors.server}</div>}
              <form id="formAuthentication" className="mb-3" onSubmit={onSubmit}>
                <div className="mb-3 form-email-toggle">
                  <label htmlFor="email" className="col-auto col-form-label">Email or Username</label>
                  <input type="text" className="form-control" id="email" name="email" placeholder="Enter your email or username" autoFocus value={email} onChange={onChange} />
                  {errors.email && <div className="text-danger">{errors.email}</div>}
                </div>

                <div className="mb-3 form-password-toggle">
                  <div className="d-flex justify-content-between">
                    <label className="form-label" htmlFor="password">Password</label>
                    <a href="/forgetpassword">
                      <small>Forgot Password?</small>
                    </a>
                  </div>
                  <div className="input-group input-group-merge">
                    <input type={obscureText ? "password" : "text"} id="password" className="form-control" name="password" placeholder="············" aria-describedby="password" value={password} onChange={onChange} />
                    <span className="input-group-text cursor-pointer" onClick={toggleObscureText}><i className={`bx ${obscureText ? 'bx-hide' : 'bx-show'}`}></i></span>
                  </div>
                  {errors.password && <div className="text-danger">{errors.password}</div>}
                </div>

                <div className="mb-3">
                  <div className="form-check" style={{ display: "flex", gap: "10px" }}>
                    <input className="form-check-input" type="checkbox" id="remember-me" />
                    <label className="form-check-label" htmlFor="remember-me">
                      Remember Me
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <Button color={"primary"} label="Sign in" onClick={onSubmit} />
                </div>
              </form>
              <div className="mb-3">
                <GoogleLoginButton onSuccess={onGoogleSuccess} onFailure={onGoogleFailure} buttonText="Sign in with google"/>
              </div>

              <p className="text-center move-down">
                <span className="space-right">New on our platform?</span>
                <a href="/SignUp">
                  <span>Create an account</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
