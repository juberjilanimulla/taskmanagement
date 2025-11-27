import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../public/assets/Login/logintm.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.css";

const base_url = import.meta.env.VITE_BASE_URL;
const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
          position: "top-center",
        });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <ToastContainer />
      <div className="admin-login-header">
        <img src={logo} alt="Logo" className="admin-login-logo" />
        <a href="/" className="admin-login-site-btn">
          Go to Site
        </a>
      </div>
      <div className="admin-login-container">
        <div className="admin-login-card">
          <h1>Admin Login</h1>
          <form onSubmit={handleSubmit} className="admin-login-form">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="admin-password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
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
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
