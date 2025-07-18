

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'; 
import './studentprofile.css'; 
import axios from 'axios';


function AnimatedNumber({ value, duration = 1500 }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        let start = 0;
        const increment = value / (duration / 30);
        let raf;
        function update() {
            start += increment;
            if (start < value) {
                setDisplay(Math.floor(start));
                raf = requestAnimationFrame(update);
            } else {
                setDisplay(value);
            }
        }
        update();
        return () => cancelAnimationFrame(raf);
    }, [value, duration]);
    return <span>{display}</span>;
}

const StudentProfile = () => {
    const [studentData, setStudentData] = useState(null);
    const [profileStats, setProfileStats] = useState({ eventsAttended: 0, achievements: 0, certificates: 0 });
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [profilePic, setProfilePic] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8081/api/student-profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStudentData(res.data);
                setProfileStats({
                    eventsAttended: res.data.eventsAttended || 0,
                    achievements: res.data.achievements || 0,
                    certificates: res.data.certificates || 0,
                });
                setUpcomingEvents(res.data.upcomingEvents || []);
                setRegistrations(res.data.registrations || []);
                setFormData(res.data);
                setProfilePic(res.data.profilePicUrl || null);
                setError(null);
            } catch (err) {
                setError('Failed to fetch profile data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Helper to format date for display (e.g., "01-01-2000")
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    };

    // Helper to format date for input type="date" (e.g., "YYYY-MM-DD")
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleEditToggle = () => {
        setIsEditMode(!isEditMode);
        if (isEditMode && studentData) {
            setFormData(studentData);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfilePicUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }
           
            const res = await axios.post('http://localhost:8081/api/student-profile/update', formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setStudentData(res.data);
            setProfileStats({
                eventsAttended: res.data.eventsAttended || 0,
                achievements: res.data.achievements || 0,
                certificates: res.data.certificates || 0,
            });
            setUpcomingEvents(res.data.upcomingEvents || []);
            setRegistrations(res.data.registrations || []);
            setProfilePic(res.data.profilePicUrl || null);
            setIsEditMode(false);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('An error occurred while updating profile.');
        }
    };

    // Helper to get matching registration for an event
    const getTicketLink = (eventId) => {
        const registration = registrations.find(reg => reg.event.eventId === eventId);
        return registration ? `/events/ticket/${registration.registrationId}` : null;
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!studentData) return <div>No profile data found.</div>;

    return (
        <>
            <h1 className="complete-profile-heading">Complete Your Profile</h1>
            <div className="main-container responsive">
                <div className="left-panel">
                    <NavLink to="/home" className="back-button">
                        <span className="back-arrow">←</span> Back
                    </NavLink>

                    <div className="welcome-message">
                        <h2>Hello, <span>{studentData.name}</span>!</h2>
                        <p className="intro-text">
                            Welcome to your student profile on Aayojan.
                        </p>
                        <p className="intro-text">
                            Keep your details up-to-date to make the most of your campus events!
                        </p>
                    </div>

                    <div className="profile-stats">
                        <div className="stat-item">
                            <i className="fas fa-calendar-check"></i>
                            <div className="stat-content">
                                <span className="stat-number"><AnimatedNumber value={profileStats.eventsAttended} /></span>
                                <span className="stat-label">Events Attended</span>
                            </div>
                        </div>
                        <div className="stat-item">
                            <i className="fas fa-star"></i>
                            <div className="stat-content">
                                <span className="stat-number"><AnimatedNumber value={profileStats.achievements} /></span>
                                <span className="stat-label">Achievements</span>
                            </div>
                        </div>
                        <div className="stat-item">
                            <i className="fas fa-certificate"></i>
                            <div className="stat-content">
                                <span className="stat-number"><AnimatedNumber value={profileStats.certificates} /></span>
                                <span className="stat-label">Certificates</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="right-panel">
                    <div className="profile-card">
                        <div className="profile-header">
                            <div className="profile-pic-container">
                                {profilePic ? (
                                    <div className="profile-pic">
                                        <img src={profilePic} alt="Profile" />
                                    </div>
                                ) : (
                                    <div className="profile-pic no-pic">
                                        <span className="initial">{studentData.name ? studentData.name.charAt(0) : ''}</span>
                                    </div>
                                )}
                                <div className="upload-overlay">
                                    <label htmlFor="profile-upload" className="upload-btn">
                                        <i className="fas fa-camera"></i>
                                    </label>
                                    <input type="file" id="profile-upload" accept="image/*" style={{ display: 'none' }} onChange={handleProfilePicUpload} />
                                </div>
                            </div>
                            <div className="profile-name-email">
                                <h2>{studentData.name}</h2>
                                <p>{studentData.email}</p>
                            </div>
                            <button className="edit-profile-btn" onClick={handleEditToggle}>
                                <i className="fas fa-pencil-alt"></i> {isEditMode ? 'Cancel Edit' : 'Edit Profile'}
                            </button>
                        </div>

                        <div className="profile-details" style={{ display: isEditMode ? 'none' : 'block' }}>
                            <h3>Personal Information</h3>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Student ID:</span>
                                    <span className="detail-value">{studentData.enrollmentNumber}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Name:</span>
                                    <span className="detail-value">{studentData.name}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Course:</span>
                                    <span className="detail-value">{studentData.course}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Department:</span>
                                    <span className="detail-value">{studentData.department}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Semester:</span>
                                    <span className="detail-value">{studentData.semester}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Date of Birth:</span>
                                    <span className="detail-value">{formatDateForDisplay(studentData.dateOfBirth)}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Phone:</span>
                                    <span className="detail-value">{studentData.phoneNumber}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Gender:</span>
                                    <span className="detail-value">{studentData.gender}</span>
                                </div>
                            </div>
                        </div>

                        <div className="edit-profile-form" style={{ display: isEditMode ? 'block' : 'none' }}>
                            <h3>Edit Profile</h3>
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">Name</label>
                                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required readOnly />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="enrollmentNumber">Student ID</label>
                                        <input type="text" id="enrollmentNumber" name="enrollmentNumber" value={formData.enrollmentNumber} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="course">Course</label>
                                        <input type="text" id="course" name="course" value={formData.course} onChange={handleChange} required />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="department">Department</label>
                                        <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="semester">Semester</label>
                                        <input type="number" id="semester" name="semester" value={formData.semester} onChange={handleChange} required min="1" max="8" />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="phoneNumber">Phone Number</label>
                                        <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="gender">Gender</label>
                                        <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="dateOfBirth">Date of Birth</label>
                                        <input type="date" id="dateOfBirth" name="dateOfBirth" value={formatDateForInput(formData.dateOfBirth)} onChange={handleChange} required />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="cancel-btn" onClick={handleEditToggle}>Cancel</button>
                                    <button type="submit" className="save-btn">Save Changes</button>
                                </div>
                            </form>
                        </div>

                        <div className="upcoming-events">
                            <h3>Your Registered Events</h3>
                            {upcomingEvents && upcomingEvents.length > 0 ? (
                                <div className="events-list">
                                    {upcomingEvents.map(event => (
                                        <div className="event-card" key={event.eventId}>
                                            <div className="event-date">
                                                <span className="event-day">{new Date(event.date).getDate()}</span>
                                                <span className="event-month">{new Date(event.date).toLocaleString('en-US', { month: 'short' })}</span>
                                            </div>
                                            <div className="event-details">
                                                <h4>{event.title}</h4>
                                                <p className="event-time">
                                                    <i className="fas fa-clock"></i>
                                                    <span>{new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                                </p>
                                                <p className="event-location">
                                                    <i className="fas fa-map-marker-alt"></i>
                                                    <span>{event.location}</span>
                                                </p>
                                            </div>
                                            <div className="event-buttons">
                                                <NavLink to={`/event/${event.eventId}`} className="view-event-btn">View</NavLink>
                                                {getTicketLink(event.eventId) && (
                                                    <NavLink to={getTicketLink(event.eventId)} className="download-ticket-btn">
                                                        <i className="fas fa-ticket-alt"></i> Ticket
                                                    </NavLink>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-events">
                                    <i className="fas fa-calendar-times"></i>
                                    <p>No events registered</p>
                                    <NavLink to="/home" className="browse-events-btn">Browse Events</NavLink>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentProfile;