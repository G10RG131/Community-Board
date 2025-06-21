import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import './LoginPage.css';

const LoginPage = () => {
  const [error, setError] = useState('');

  const handleLogin = (credentials) => {
    console.log('Login attempt:', credentials);
    setError('');
    
    if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
      console.log('Login successful');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Admin Login</h2>
        <LoginForm onLogin={handleLogin} error={error} />
        <p className="register-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;