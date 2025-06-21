import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  // Mock authentication state - replace with real auth context
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          EventHub
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Home
            </Link>
          </li>

          {isLoggedIn && (
            <li className="nav-item">
              <Link to="/user" className="nav-links">
                Create Event
              </Link>
            </li>
          )}

          {isAdmin && (
            <li className="nav-item">
              <Link to="/admin" className="nav-links">
                Admin
              </Link>
            </li>
          )}

          {!isLoggedIn && (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links">
                  Register
                </Link>
              </li>
            </>
          )}

          {isLoggedIn && (
            <li className="nav-item">
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="nav-links logout-btn"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;