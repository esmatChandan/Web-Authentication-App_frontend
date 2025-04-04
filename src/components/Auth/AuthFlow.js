// src/components/Auth/AuthFlow.js
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import VerifyOTP from './VerifyOTP';
import './authStyles.css';

const AuthFlow = () => {
  const [step, setStep] = useState('login');
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState(null);

  return (
    <div className="auth-container">
      {step === 'login' && (
        <Login 
          onLogin={(email) => {
            setEmail(email);
            setStep('verify');
          }}
          onRegister={() => setStep('register')}
        />
      )}

      {step === 'register' && (
        <Register
          initialEmail={email}
          onRegister={(data) => {
            setUserData(data);
            setEmail(data.email);
            setStep('verify');
          }}
          onLoginClick={() => setStep('login')}
        />
      )}

      {step === 'verify' && (
        <VerifyOTP
          email={email}
          isNewUser={!!userData}
          onSuccess={() => window.location.href = '/'}
          onBack={() => setStep(userData ? 'register' : 'login')}
        />
      )}
    </div>
  );
};

export default AuthFlow;