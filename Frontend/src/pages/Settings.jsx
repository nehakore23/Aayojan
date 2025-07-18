
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaBell, FaUser, FaEye, FaPalette } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api';

const Settings = () => {
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [reminderNotifications, setReminderNotifications] = useState(false);
    const [profileVisibility, setProfileVisibility] = useState(false);
    const [showAttendance, setShowAttendance] = useState(false);
    const [theme, setTheme] = useState('system');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setErrorMessage('Authentication token not found. Please log in.');
                    setIsLoading(false);
                    return;
                }
                const response = await axios.get(`${API_BASE_URL}/settings`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const currentSettings = response.data;
                setEmailNotifications(!!currentSettings.emailNotifications);
                setReminderNotifications(!!currentSettings.reminderNotifications);
                setProfileVisibility(!!currentSettings.profileVisibility);
                setShowAttendance(!!currentSettings.showAttendance);
                setTheme(currentSettings.theme || 'system');
            } catch (error) {
                console.error('Failed to fetch settings:', error);
                setErrorMessage('Failed to load settings. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        setIsSaving(true);

        const updatedSettings = {
            emailNotifications,
            reminderNotifications,
            profileVisibility,
            showAttendance,
            theme,
        };

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setErrorMessage('Authentication token not found. Please log in.');
                setIsSaving(false);
                return;
            }
            await axios.post(`${API_BASE_URL}/settings/update`, updatedSettings, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setSuccessMessage('✅ Settings updated successfully!');
        } catch (error) {
            console.error('Error updating settings:', error);
            setErrorMessage('❌ Failed to update settings. Please try again.');
        } finally {
            setIsSaving(false);
            setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 3000);
        }
    };

    if (isLoading) {
        return (
            <div className="settings-options-card" style={{ marginTop: '6rem', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="settings-spinner"></div>
            </div>
        );
    }

    return (
        <div className="settings-options-card">
            <div className="settings-options-header">
                <span className="settings-options-title"><FaUser style={{ marginRight: '10px' }} />User Settings</span>
            </div>
            <form className="settings-options-form" onSubmit={handleSubmit}>
                {/* Notification Section */}
                <div className="settings-section">
                    <div className="settings-section-title"><FaBell className="settings-section-icon" /> Notification Settings</div>
                    <label className="settings-switch-label">
                        <input type="checkbox" checked={emailNotifications} onChange={e => setEmailNotifications(e.target.checked)} disabled={isSaving} />
                        <span className="settings-switch-slider"></span>
                        <span className="settings-switch-text"><FaEnvelope className="me-2" /> Email notifications</span>
                    </label>
                    <label className="settings-switch-label">
                        <input type="checkbox" checked={reminderNotifications} onChange={e => setReminderNotifications(e.target.checked)} disabled={isSaving} />
                        <span className="settings-switch-slider"></span>
                        <span className="settings-switch-text"><FaBell className="me-2" /> Event reminders</span>
                    </label>
                </div>
                {/* Privacy Section */}
                <div className="settings-section">
                    <div className="settings-section-title"><FaEye className="settings-section-icon" /> Privacy Settings</div>
                    <label className="settings-switch-label">
                        <input type="checkbox" checked={profileVisibility} onChange={e => setProfileVisibility(e.target.checked)} disabled={isSaving} />
                        <span className="settings-switch-slider"></span>
                        <span className="settings-switch-text"><FaEye className="me-2" /> Visible to others</span>
                    </label>
                    <label className="settings-switch-label">
                        <input type="checkbox" checked={showAttendance} onChange={e => setShowAttendance(e.target.checked)} disabled={isSaving} />
                        <span className="settings-switch-slider"></span>
                        <span className="settings-switch-text"><FaEye className="me-2" /> Show event attendance</span>
                    </label>
                </div>
                {/* Theme Section */}
                <div className="settings-section">
                    <div className="settings-section-title"><FaPalette className="settings-section-icon" /> Theme</div>
                    <select className="settings-theme-select" value={theme} onChange={e => setTheme(e.target.value)} disabled={isSaving}>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System Default</option>
                    </select>
                </div>
                {/* Save Button */}
                <div className="settings-save-btn-row">
                    <button type="submit" className="settings-save-btn" disabled={isSaving}>
                        {isSaving ? <span className="settings-btn-spinner"></span> : 'Save Changes'}
                    </button>
                </div>
                {(successMessage || errorMessage) && (
                    <div className={`settings-alert ${successMessage ? 'success' : 'error'}`}>{successMessage || errorMessage}</div>
                )}
            </form>
            <style>{`
          .settings-options-card {
            max-width: 430px;
            margin: 6rem auto 2.5rem auto;
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 6px 32px rgba(255,90,95,0.10), 0 1.5px 6px rgba(0,0,0,0.04);
            overflow: hidden;
            padding: 0 0 2.2rem 0;
            animation: fadeIn 0.7s;
            min-height: 60vh;
          }
          .settings-options-header {
            background: linear-gradient(90deg, #FF5A5F 60%, #ff8086 100%);
            padding: 1.5rem 2rem 1rem 2rem;
            border-radius: 18px 18px 0 0;
            text-align: left;
          }
          .settings-options-title {
            color: #fff;
            font-size: 2rem;
            font-weight: bold;
            letter-spacing: 1px;
            font-family: 'Playfair Display', serif;
            display: flex;
            align-items: center;
          }
          .settings-options-form {
            padding: 1.5rem 2rem 0 2rem;
            display: flex;
            flex-direction: column;
            gap: 2.2rem;
          }
          .settings-section {
            display: flex;
            flex-direction: column;
            gap: 0.7rem;
            margin-bottom: 0.5rem;
          }
          .settings-section-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #FF5A5F;
            margin-bottom: 0.3rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .settings-section-icon {
            color: #FF5A5F;
            font-size: 1.2rem;
          }
          .settings-switch-label {
            display: flex;
            align-items: center;
            gap: 0.7rem;
            font-size: 1rem;
            font-weight: 500;
            background: #f8f8f8;
            border-radius: 8px;
            padding: 0.7rem 1.1rem;
            margin-bottom: 0.1rem;
            box-shadow: 0 1px 4px rgba(255,90,95,0.04);
            cursor: pointer;
            transition: background 0.2s, color 0.2s, transform 0.2s;
            position: relative;
            user-select: none;
          }
          .settings-switch-label input[type="checkbox"] {
            display: none;
          }
          .settings-switch-slider {
            width: 38px;
            height: 22px;
            background: #ffeaea;
            border-radius: 12px;
            position: relative;
            transition: background 0.2s;
            margin-right: 0.5rem;
          }
          .settings-switch-label input[type="checkbox"]:checked + .settings-switch-slider {
            background: linear-gradient(90deg, #FF5A5F 60%, #ff8086 100%);
          }
          .settings-switch-slider:before {
            content: '';
            position: absolute;
            left: 3px;
            top: 3px;
            width: 16px;
            height: 16px;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 1px 4px rgba(255,90,95,0.08);
            transition: transform 0.2s;
          }
          .settings-switch-label input[type="checkbox"]:checked + .settings-switch-slider:before {
            transform: translateX(16px);
          }
          .settings-switch-text {
            margin-left: 0.2rem;
            display: flex;
            align-items: center;
            gap: 0.4rem;
          }
          .settings-theme-select {
            width: 100%;
            padding: 0.7rem 1.1rem;
            border-radius: 8px;
            border: 1px solid #ffeaea;
            font-size: 1rem;
            background: #f8f8f8;
            color: #333;
            font-weight: 500;
            margin-top: 0.3rem;
            margin-bottom: 0.2rem;
            transition: border 0.2s;
          }
          .settings-theme-select:focus {
            border: 1.5px solid #FF5A5F;
            outline: none;
          }
          .settings-save-btn-row {
            display: flex;
            justify-content: center;
            margin-top: 1.2rem;
          }
          .settings-save-btn {
            background: linear-gradient(90deg, #FF5A5F 60%, #ff8086 100%);
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 0.85rem 2.2rem;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(255,90,95,0.10);
            transition: background 0.2s, transform 0.2s;
          }
          .settings-save-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          .settings-save-btn:hover:not(:disabled) {
            background: linear-gradient(90deg, #ff8086 60%, #FF5A5F 100%);
            transform: translateY(-2px) scale(1.03);
          }
          .settings-btn-spinner {
            display: inline-block;
            width: 22px;
            height: 22px;
            border: 3px solid #ffeaea;
            border-top: 3px solid #FF5A5F;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            vertical-align: middle;
          }
          .settings-spinner {
            width: 40px;
            height: 40px;
            border: 5px solid #ffeaea;
            border-top: 5px solid #FF5A5F;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .settings-alert {
            margin-top: 1.2rem;
            padding: 0.9rem 1.2rem;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 500;
            text-align: center;
            box-shadow: 0 2px 8px rgba(255,90,95,0.08);
          }
          .settings-alert.success {
            background: #e6f7e6;
            color: #4CAF50;
          }
          .settings-alert.error {
            background: #f8d7da;
            color: #e53935;
          }
          @media (max-width: 600px) {
            .settings-options-card {
              max-width: 98vw;
              padding: 0 0 1rem 0;
              margin-top: 4.5rem;
            }
            .settings-options-header, .settings-options-form {
              padding-left: 1rem;
              padding-right: 1rem;
            }
            .settings-options-title {
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
};

export default Settings;