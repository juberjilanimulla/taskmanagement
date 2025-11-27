import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "/assets/Login/logintm.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.css";

const base_url = import.meta.env.VITE_BASE_URL;

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Register Modal States
  const [openRegister, setOpenRegister] = useState(false);
  const [regData, setRegData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegisterChange = (e) => {
    setRegData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${base_url}/api/auth/signin`, formData);

      if (res.data?.data?.encoded_token) {
        localStorage.setItem("adminToken", res.data.data.encoded_token);
        navigate("/admin/dashboard");
        window.location.reload();
      } else {
        toast.error("Invalid response from server", {
          position: "top-right",
        });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed", {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${base_url}/api/auth/signup`, regData);

      toast.success("Registered Successfully!", {
        position: "top-right",
      });

      setOpenRegister(false);
      setRegData({
        firstname: "",
        lastname: "",
        email: "",
        mobile: "",
        password: "",
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="login-wrapper">
      <ToastContainer />

      <div className="login-header">
        <img src={logo} alt="Logo" className="login-logo" />
      </div>

      <div className="login-container">
        <div className="login-card">
          <h1>Login</h1>

          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="off"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                autoComplete="off"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register Button */}
          <p className="register-text">
            Don’t have an account?{" "}
            <span
              className="register-btn"
              onClick={() => setOpenRegister(true)}
            >
              Register
            </span>
          </p>
        </div>
      </div>

      {/* REGISTER MODAL */}
      {openRegister && (
        <div className="modal-overlay" onClick={() => setOpenRegister(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create Account</h2>
            <form onSubmit={handleRegister} className="register-form">
              <div className="name-row">
                <input
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  value={regData.firstname}
                  onChange={handleRegisterChange}
                  required
                />
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  value={regData.lastname}
                  onChange={handleRegisterChange}
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={regData.email}
                onChange={handleRegisterChange}
                required
              />

              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number"
                value={regData.mobile}
                onChange={handleRegisterChange}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={regData.password}
                onChange={handleRegisterChange}
                required
              />

              <button type="submit" className="register-submit">
                Register
              </button>
            </form>

            <button
              className="close-modal"
              onClick={() => setOpenRegister(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
