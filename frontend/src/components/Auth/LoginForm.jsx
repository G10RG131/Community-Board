import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = ({ onLogin, error }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      return;
    }
    onLogin(credentials);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email address"
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        required
      />
      {error && <div className="error-message">{error}</div>}
      <button type="submit" className="login-button">Login</button>
    </form>
  );
};

export default LoginForm;