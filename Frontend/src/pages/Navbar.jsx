import React, { useRef, useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import { Link } from 'react-router-dom';

const CustomNavbar = ({ userRole, profileLink }) => {

  // Normalize role for comparison
  const normalizedRole = userRole?.toUpperCase();
  const isEventAuthority = normalizedRole === 'ROLE_EVENT_AUTHORITY' || 
                          normalizedRole === 'EVENT_AUTHORITY' || 
                          normalizedRole === 'EVENTAUTHORITY@CHARUSAT.AC.IN';
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside (not used, but kept for future dropdowns)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="custom-navbar">
      <div className="navbar-left">
        <a href="/" className="navbar-logo">

          <span className="navbar-title">Aayojan</span>
        </a>
        <div className="navbar-links">
          <a href="/home">Events</a>
          <a href="/workshops">Workshops</a>
          <a href="/seminars">Seminars</a>
          <a href="/about-us">About Us</a>
          <a href="/contact">Contact Us</a>
          {isEventAuthority && (
            <a href="/eventAuthority/manageEvents">Manage Events</a>
          )}
        </div>
      </div>
      <div className="navbar-right">
        {/* <a href="/faculty/:facultyId" className="navbar-myevents-btn">MyEvents</a> */}
        <Link to="/profile-options" className="navbar-profile-btn">
          <span role="img" aria-label="Profile">👤</span>
        </Link>
      </div>
      <style>{`
        .custom-navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
          /* Change the navbar color here: */
          background: linear-gradient(90deg, #0d47a1 60%, #1976d2 100%);
          /* Example: blue gradient. You can use any color you want. */
          box-shadow: 0 4px 18px rgba(13,71,161,0.10), 0 1.5px 6px rgba(0,0,0,0.04);
          border-radius: 0 0 18px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.7rem 2.2rem 0.7rem 2.2rem;
          font-family: 'Inter', sans-serif;
          margin-bottom: 0;
          min-height: 64px;
          animation: fadeIn 0.7s;
        }
        .navbar-left {
          display: flex;
          align-items: center;
          gap: 2.2rem;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          text-decoration: none;
        }
        .navbar-title {
          color: #fff;
          font-size: 1.5rem;
          font-weight: bold;
          letter-spacing: 1px;
          font-family: 'Playfair Display', serif;
        }
        .navbar-links {
          display: flex;
          gap: 1.2rem;
        }
        .navbar-links a {
          color: #fff;
          text-decoration: none;
          font-size: 1.08rem;
          font-weight: 500;
          padding: 0.45rem 1.1rem;
          border-radius: 8px;
          transition: background 0.2s, color 0.2s, transform 0.2s;
        }
        .navbar-links a:hover {
          background: #fff0f0;
          color: #FF5A5F;
          transform: translateY(-2px) scale(1.04);
        }
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }
        .navbar-profile-btn {
          width: 40px;
          height: 40px;
          background: #fff;
          color: #FF5A5F;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          box-shadow: 0 1px 4px rgba(255,90,95,0.08);
          border: none;
          text-decoration: none;
          transition: background 0.2s, color 0.2s, transform 0.2s;
        }
        .navbar-profile-btn:hover {
          background: #ffeaea;
          color: #FF5A5F;
          transform: scale(1.08);
        }
        @media (max-width: 900px) {
          .custom-navbar {
            padding: 0.7rem 1rem;
          }
          .navbar-links {
            gap: 0.7rem;
          }
        }
        @media (max-width: 700px) {
          .custom-navbar {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.7rem;
            padding: 0.7rem 0.5rem;
          }
          .navbar-left {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .navbar-links {
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .navbar-right {
            align-self: flex-end;
            gap: 0.7rem;
          }
        }
        @media (max-width: 500px) {
          .custom-navbar {
            min-height: 48px;
            padding: 0.4rem 0.2rem;
          }
          .navbar-title {
            font-size: 1.1rem;
          }
          .navbar-links a {
            font-size: 0.98rem;
            padding: 0.3rem 0.7rem;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
};

export default CustomNavbar;
