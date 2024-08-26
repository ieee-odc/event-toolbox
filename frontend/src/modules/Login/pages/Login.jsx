import React, { useEffect, useState } from "react";
import Button from "../../../core/components/Button/Button";
import GoogleLoginButton from "../../../core/components/GoogleAuthButton/GoogleLoginButton";
import "./Login.css";
import axiosRequest from "../../../utils/AxiosConfig";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../../utils/UserData";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const validateForm = () => {
    const errors = {};
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
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
      const res = await axiosRequest.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      navigate("/events");
    } catch (err) {
      console.error(err.response.data);
      setErrors({ server: err.response.data.msg });
    }
  };

  const onGoogleSuccess = async (response) => {
    try {
      const tokenId = response.user.accessToken;
      const res = await axiosRequest.post("/auth/loginwithgoogle", { tokenId });
      localStorage.setItem("token", res.data.token);
      // if (rememberMe) {
      //   localStorage.setItem("token", res.data.token);
      // } else {
      //   sessionStorage.setItem("token", res.data.token);
      // }
      navigate("/events");
    } catch (err) {
      console.error(
        "Login error:",
        err.response ? err.response.data : err.message
      );
      if (err.response && err.response.status === 400) {
        setErrors({ server: err.response.data.msg });
      } else {
        setErrors({ server: "Login failed. Please try again." });
      }
    }
  };

  const onGoogleFailure = (err) => {
    setErrors({ server: err.response.msg });
  };

  const [obscureText, setObscureText] = useState(true);
  const toggleObscureText = () => {
    setObscureText((prev) => !prev);
  };
  const userData = UserData();
  useEffect(() => {
    if (userData) {
      const redirectPath = userData.role === "admin" ? "/admin" : "/events";
      navigate(redirectPath);
    }
  }, [userData, navigate]);


  return (
    <div className="container" style={{ height: "100vh" }}>
      <div
        className="container-xxl "
        style={{ display: "flex", height: "90%", margin: "auto 0", flexDirection: "column", alignItems: "center" }}
      >
        <div className="authentication-wrapper authentication-basic container-p-y">
          <div className="authentication-inner">
            <div className="card">
              <div className="card-body d-flex flex-column justify-content-center">
                <h4 className="mb-4">Welcome to Event Box! 👋</h4>
                <p className="mb-6">Please sign-in to your account and start the adventure</p>
                {errors.server && (
                  <div className="alert alert-danger">{errors.server}</div>
                )}
                <form id="formAuthentication" onSubmit={onSubmit} className="w-100">
                  <div className="mb-6 w-100">
                    <label htmlFor="email" className="form-label">Email or Username</label>
                    <input
                      type="text"
                      className="form-control w-100"
                      id="email"
                      name="email"
                      autoComplete="username"
                      placeholder="Enter your email or username"
                      autoFocus
                      value={email}
                      onChange={onChange}
                    />
                    {errors.email && (
                      <div className="text-danger">{errors.email}</div>
                    )}
                  </div>

                  <div className="mb-3 w-100">
                    <div className="d-flex justify-content-between">
                      <label className="form-label" htmlFor="password">Password</label>
                    </div>
                    <div className="input-group input-group-merge d-flex align-items-start w-100">
                      <input
                        type={obscureText ? "password" : "text"}
                        id="password"
                        className="form-control"
                        name="password"
                        autoComplete="current-password"
                        placeholder="············"
                        aria-describedby="password"
                        value={password}
                        onChange={onChange}
                      />
                      <a
                        style={{ height: "40px" }}
                        className="input-group-text cursor-pointer"
                        onClick={toggleObscureText}
                      >
                        <i className={`bx ${obscureText ? "bx-hide" : "bx-show"}`}></i>
                      </a>
                    </div>

                    {errors.password && (
                      <div className="text-danger">{errors.password}</div>
                    )}
                  </div>

                  <div className="mb-8 w-100">
                    <div className="d-flex justify-content-between">
                      <div className="form-check mb-0 ms-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="remember-me"
                          checked={rememberMe}
                          onChange={onRememberMeChange}
                        />
                        <label className="form-check-label" htmlFor="remember-me">
                          Remember Me
                        </label>
                      </div>
                      <a href="auth-forgot-password-basic.html"><span>Forgot Password?</span></a>
                    </div>
                  </div>

                  <div className="mb-2 w-100">
                    <button
                      onClick={onSubmit}
                      className="btn d-grid w-100"
                      style={{ background: "var(--primary-color)", color: "white" }}
                      type="submit"
                    >
                      Login
                    </button>
                  </div>
                </form>
                <div className="google-login-container d-flex justify-content-center w-100">
                  <GoogleLoginButton
                    className="google-login-button"
                    buttonText="Sign in with Google"
                    onSuccess={onGoogleSuccess}
                    onFailure={onGoogleFailure}
                    action={(data) => {
                      return axiosRequest
                        .post("/auth/loginwithgoogle", data)
                        .then((response) => { })
                        .catch((err) => {
                          console.log(err);
                        });
                    }}
                  />
                </div>
                <p className="text-center d-flex align-items-center mt-3">
                  <span>New on our platform?</span>{" "}
                  <a href="/SignUp" className="ms-1"><span>Create an account</span></a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;