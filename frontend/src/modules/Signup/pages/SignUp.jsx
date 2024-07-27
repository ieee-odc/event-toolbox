import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../core/components/Button/Button';
import GoogleLoginButton from '../../../core/components/GoogleAuthButton/GoogleLoginButton';
import axiosRequest from '../../../utils/AxiosConfig';
import './SignUp.css';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [obscureText, setObscureText] = useState(true);
  const navigate = useNavigate();

  const { username, email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    const errors = {};
    if (!username) errors.username = 'Username is required';
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 8) errors.password = 'Password must be at least 8 characters long';
    return errors;
  };

  const onSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    try {
      const res = await axiosRequest.post('/auth/signup', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/events');
    } catch (err) {
      console.error(err.response.data);
      setErrors({ server: err.response.data.msg });
    }
  };
  const onGoogleSuccess = async (response) => {
    try {
      const res = await axiosRequest.post('/auth/signupwithgoogle', { tokenId: response.user.accessToken });
      localStorage.setItem('token', res.data.token);
      navigate('/success');
    } catch (err) {
      console.error(err.response.data);
      setErrors({ server: err.response.data.msg });
    }
  };
  

  const onGoogleFailure = (response) => {
    setErrors({ server: 'Google signup failed' });
  };

  const toggleObscureText = () => {
    setObscureText(prev => !prev);
  };

  return (
    <div className="container-xxl" style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">
          <div className="card">
            <div className="card-body">
              <h4 className="mb-2">Sign Up 🚀</h4>
              <p className="mb-4">Create your account to get started!</p>
              {errors.server && <div className="alert alert-danger">{errors.server}</div>}
              <form id="formAuthentication" className="mb-3" style={{display:"flex",flexDirection:"column",alignItems:"center"}} onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
                <div className="mb-2 form-email-toggle w-100">
                  <label htmlFor="username" className="col-auto col-form-label">Username</label>
                  <input type="text" className="form-control" id="username" name="username" autoComplete="username" value={username} onChange={onChange} placeholder="Enter your username" autoFocus />
                  {errors.username && <div className="text-danger">{errors.username}</div>}
                </div>
                <div className="mb-2 form-email-toggle w-100">
                  <label htmlFor="email" className="col-auto col-form-label">Email</label>
                  <input type="email" className="form-control" id="email" name="email" autoComplete="email" value={email} onChange={onChange} placeholder="Enter your email" />
                  {errors.email && <div className="text-danger">{errors.email}</div>}
                </div>
                <div className="mb-2 form-password-toggle w-100">
                  <div className="d-flex justify-content-between">
                    <label className="form-label" htmlFor="password">Password</label>
                  </div>
                  <div className="input-group input-group-merge">
                  <input type={obscureText ? "password" : "text"} id="password" className="form-control" name="password" autoComplete="new-password" value={password} onChange={onChange} placeholder="············" aria-describedby="password" />
                    <span className="input-group-text cursor-pointer" onClick={toggleObscureText}>
                      <i className={`bx ${obscureText ? 'bx-hide' : 'bx-show'}`}></i>
                    </span>
                  </div>
                  {errors.password && <div className="text-danger">{errors.password}</div>}
                </div>
                <div className="mb-2" style={{alignSelf:"start"}}>
                  <div className="form-check" style={{ display: "flex", gap: "10px" }}>
                    <input className="form-check-input" type="checkbox" id="terms-conditions" name="terms" />
                    <label className="form-check-label" htmlFor="terms-conditions">
                      I agree to
                      <a style={{ marginLeft: '10px' }} href="#">privacy policy & terms</a>
                    </label>
                  </div>
                </div>
                <div className="mb-2">
                  <Button onClick={onSubmit} color={"primary"} label="Sign up" />
                </div>
                <div className="google-login-container">
                <GoogleLoginButton 
                  buttonText="Sign up with Google" 
                  onSuccess={onGoogleSuccess} 
                  onFailure={onGoogleFailure} 
                  action={(data) => axiosRequest.post('/auth/signupwithgoogle', data)}
                />
              </div>
              </form>
              <p className="text-center text-place ">
                <span className="space-right">Already have an account?</span>
                <Link to="/Login">
                  <span>Sign in instead</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
