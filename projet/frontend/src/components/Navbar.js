import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.png';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  // Check if the user is logged in
  const isLoggedIn = Boolean(localStorage.getItem('authToken'));

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove the auth token
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Section */}
        <Link className="navbar-brand" to="/">
          <img
            src={logo}
            alt="Blasti Logo"
            className="navbar-logo"
          />
          <span>Blasti</span>
        </Link>

        {/* Navigation Links */}
        <ul className="navbar-links">
          <li>
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li>
            <Link className="nav-link" to="/BusSearch">Find Bus</Link>
          </li>
          {!isLoggedIn ? (
            <>
              <li>
                <Link className="nav-link" to="/Login">Login</Link>
              </li>
              <li>
                <Link className="nav-link" to="/Register">Register</Link>
              </li>
            </>
          ) : (
            <li>
              <button className="nav-link nav-button" onClick={handleLogout}>
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
