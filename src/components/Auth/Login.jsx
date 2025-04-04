// src/components/Auth/Login.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin, onRegister }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      // if (!response.ok) throw new Error(data.message || 'Login failed');

      onLogin(email);
    } catch (err) {
      if (err.message.includes("not registered")) {
        onRegister();
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log(token);

    if (token) {
      login(JSON.parse(localStorage.getItem("userData")), token);
      navigate("/");
    }
  }, []);

  return (
    <div className="auth-form">
      <h2>Welcome Back</h2>
      <p>Please enter your email to continue</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading} className="primary-btn">
          {loading ? "Sending OTP..." : "Continue"}
        </button>
      </form>

      <div className="auth-footer">
        Don't have an account?{" "}
        <button type="button" onClick={onRegister} className="text-btn">
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;
