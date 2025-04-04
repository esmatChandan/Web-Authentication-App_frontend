import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './authStyles.css';

const VerifyOTP = ({ email, isNewUser, onBack }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Auto-focus on OTP input when component mounts
  useEffect(() => {
    const otpInput = document.getElementById('otp-input');
    if (otpInput) otpInput.focus();
  }, []);

  // Timer countdown for OTP resend
  useEffect(() => {
    const countdown = timer > 0 && setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(countdown);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed. Please try again.');
      }

      // Store user data and token
      login({ email }, data.token);
      setSuccess('Verification successful! Redirecting...');
      
      setTimeout(() => navigate('/'), 1500);
      
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setError('');
      setSuccess('');
      const endpoint = isNewUser 
        ? 'http://localhost:5000/api/auth/register' 
        : 'http://localhost:5000/api/auth/login';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Failed to resend OTP. Please try again.');
      }

      setTimer(60);
      setSuccess('New OTP sent successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="auth-form">
      <h2>Verify Your Email</h2>
      <p>We sent a 6-digit code to <strong>{email}</strong></p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="otp-input">Verification Code</label>
          <input
            id="otp-input"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            value={otp}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value) && value.length <= 6) {
                setOtp(value);
              }
            }}
            maxLength="6"
            required
            placeholder="Enter 6-digit code"
            aria-describedby="otp-help"
          />
          <small id="otp-help" className="form-text">
            Check your email for the verification code
          </small>
        </div>

        {error && (
          <div className="alert error" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        {success && (
          <div className="alert success" role="alert" aria-live="assertive">
            {success}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading} 
          className="primary-btn"
          aria-busy={loading}
        >
          {loading ? (
            <>
              <span aria-hidden="true">Verifying...</span>
              <span className="sr-only">Verifying OTP</span>
            </>
          ) : 'Verify'}
        </button>
      </form>

      <div className="otp-footer">
        {timer > 0 ? (
          <span>Resend code in {timer} seconds</span>
        ) : (
          <button 
            type="button" 
            onClick={handleResend} 
            className="text-btn"
            disabled={timer > 0}
          >
            Resend Code
          </button>
        )}
        <button 
          type="button" 
          onClick={onBack} 
          className="text-btn"
        >
          Back to {isNewUser ? 'Registration' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;