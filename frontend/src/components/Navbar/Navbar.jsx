import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          handleLogout();
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          CommunityBoard
        </Link>
        
        <ul className="nav-menu">
          {/* Always visible links */}
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/volunteer" className="nav-links">
              Volunteers
            </Link>
          </li>

          {/* Logged-in only links */}
          {isLoggedIn && (
            <>
              <li className="nav-item">
                <Link to="/user" className="nav-links">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/my-events" className="nav-links">
                  My Events
                </Link>
              </li>
            </>
          )}

          {/* Auth status display */}
          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <span className="nav-links welcome-text">
                  Hi, {user?.name || 'User'}
                </span>
              </li>
              <li className="nav-item">
                <button 
                  onClick={handleLogout}
                  className="nav-links logout-btn"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
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
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;