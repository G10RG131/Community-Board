import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm';
import './RegisterPage.css';

const RegisterPage = () => {
  const handleRegister = (formData) => {
    console.log('Registration data:', formData);
    // Add your registration logic here
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Create Account</h2>
        <RegisterForm onRegister={handleRegister} />
        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;