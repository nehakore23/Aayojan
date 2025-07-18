import React from 'react';
import { Link } from 'react-router-dom';

const ProfileOptions = ({ profileLink }) => (
  <div className="profile-options-card">
    <div className="profile-options-header">
      <span className="profile-options-title">Profile Options</span>
    </div>
    <ul className="profile-options-list">
      <li>
        <Link to={profileLink || "/my-profile"} className="profile-options-item">
          <span className="profile-options-icon" role="img" aria-label="profile">👤</span>
          My Profile
        </Link>
      </li>
      <li>
        <Link to="/settings" className="profile-options-item">
          <span className="profile-options-icon" role="img" aria-label="settings">⚙️</span>
          Settings
        </Link>
      </li>
      <li>
        <Link to="/logout" className="profile-options-item logout">
          <span className="profile-options-icon" role="img" aria-label="logout">🚪</span>
          Logout
        </Link>
      </li>
    </ul>

    <style>{`
      .profile-options-card {
        max-width: 400px;
        margin: 5.5rem auto 2.5rem auto;
        /* Increased top margin to push below navbar */
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 6px 32px rgba(255,90,95,0.10), 0 1.5px 6px rgba(0,0,0,0.04);
        overflow: hidden;
        padding: 0 0 1.5rem 0;
        animation: fadeIn 0.7s;
      }
      .profile-options-header {
       background: linear-gradient(90deg, #0d47a1 60%, #1976d2 100%);
        padding: 1.5rem 2rem 1rem 2rem;
        border-radius: 18px 18px 0 0;
        text-align: left;
      }
      .profile-options-title {
        color: #fff;
        font-size: 2rem;
        font-weight: bold;
        letter-spacing: 1px;
        font-family: 'Playfair Display', serif;
      }
      .profile-options-list {
        list-style: none;
        margin: 0;
        padding: 1.5rem 2rem 0 2rem;
        display: flex;
        flex-direction: column;
        gap: 1.1rem;
      }
      .profile-options-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        font-size: 1.15rem;
        color: #333;
        text-decoration: none;
        background: #f8f8f8;
        border-radius: 8px;
        padding: 0.85rem 1.2rem;
        font-weight: 500;
        box-shadow: 0 1px 4px rgba(255,90,95,0.04);
        transition: background 0.2s, color 0.2s, transform 0.2s;
        position: relative;
      }
      .profile-options-item:hover {
        background: linear-gradient(90deg, #ffeaea 60%, #fff6f6 100%);
        color: #FF5A5F;
        transform: translateX(4px) scale(1.03);
        box-shadow: 0 4px 16px rgba(255,90,95,0.10);
      }
      .profile-options-icon {
        font-size: 1.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.2rem;
        height: 2.2rem;
        background: #ffeaea;
        border-radius: 50%;
        color: #FF5A5F;
        box-shadow: 0 1px 4px rgba(255,90,95,0.08);
        margin-right: 0.5rem;
        transition: background 0.2s, color 0.2s;
      }
      .profile-options-item.logout {
        color: #e53935;
        background: #fff0f0;
      }
      .profile-options-item.logout:hover {
        background: #ffeaea;
        color: #b71c1c;
      }
      @media (max-width: 600px) {
        .profile-options-card {
          max-width: 98vw;
          padding: 0 0 1rem 0;
          margin-top: 4.5rem; /* Still enough space below mobile nav */
        }
        .profile-options-header, .profile-options-list {
          padding-left: 1rem;
          padding-right: 1rem;
        }
        .profile-options-title {
          font-size: 1.3rem;
        }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  </div>
);

export default ProfileOptions;