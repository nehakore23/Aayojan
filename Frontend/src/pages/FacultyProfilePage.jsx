import React, { useState, useEffect, useRef } from 'react';
import './facultyprofile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUsers, faCertificate, faPencilAlt, faCamera, faClock, faMapMarkerAlt, faEdit, faCalendarTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Link } from 'react-router-dom';


// Helper function to format dates and times
const formatDate = (dateString, format) => {
    if (!dateString) return '';
    const date = new Date(dateString);

    if (format === 'dd') {
        return date.getDate().toString().padStart(2, '0');
    } else if (format === 'MMM') {
        return date.toLocaleString('en-US', { month: 'short' });
    } else if (format === 'hh:mm a') {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    }
    return dateString;
};

//format time string to 12 hours time 
function formatTimeTo12Hours(timeString) {
    if (!timeString) return ''; // prevent error if null or undefined
  
    const [hourStr, minuteStr] = timeString.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr;
    const ampm = hour >= 12 ? 'PM' : 'AM';
  
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;
  
    return `${hour}:${minute} ${ampm}`;
  }
  

// AnimatedNumber component for stat counters
function AnimatedNumber({ value, duration = 1500 }) {
    const [display, setDisplay] = useState(0);
    const raf = useRef();

    useEffect(() => {
        let start = 0;
        const increment = value / (duration / 30);

        function update() {
            start += increment;
            if (start < value) {
                setDisplay(Math.floor(start));
                raf.current = requestAnimationFrame(update);
            } else {
                setDisplay(value);
            }
        }
        setDisplay(0);
        update();
        return () => cancelAnimationFrame(raf.current);
    }, [value, duration]);

    return <span>{display}</span>;
}

const FacultyProfilePage = () => {
    const [faculty, setFaculty] = useState(null);
    const [eventsOrganized, setEventsOrganized] = useState(0);
    const [studentsParticipated, setStudentsParticipated] = useState(0);
    const [certificatesIssued, setCertificatesIssued] = useState(0);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch profile data on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No authentication token found. Please log in again.');
                    setIsLoading(false);
                    return;
                }

                const res = await axios.get('http://localhost:8081/api/faculty-profile', {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                const facultyData = res.data.faculty;
                setFaculty(facultyData);
                setEventsOrganized(res.data.eventsOrganized || 0);
                setStudentsParticipated(res.data.studentsParticipated || 0);
                setCertificatesIssued(res.data.certificates || res.data.certificatesIssued || 0);
                setUpcomingEvents(res.data.upcomingEvents || []);
                setPastEvents(res.data.pastEvents || []);
                setEditFormData(facultyData);
                setProfilePicPreview(facultyData.profilePicUrl || null);
                setError(null);
            } catch (err) {
                console.error('Error fetching profile:', err);
                if (err.response?.status === 403) {
                    setError('Access denied. Please make sure you are logged in as a faculty member.');
                } else if (err.response?.status === 401) {
                    setError('Your session has expired. Please log in again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    window.location.href = '/';
                } else {
                    setError(err.response?.data?.message || err.response?.data?.error || 'Failed to fetch profile data');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Handlers for edit profile functionality
    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditFormData(faculty);
        setProfilePicPreview(faculty?.profilePicUrl || null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditFormData(prev => ({
                ...prev,
                profilePicture: file
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setEditFormData(prev => ({
                ...prev,
                profilePicture: null
            }));
            setProfilePicPreview(faculty?.profilePicUrl || null);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in again to update your profile.');
                return;
            }

            // Ensure all required fields are present and not null
            const profileData = {
                id: editFormData.id || '',
                facultyId: editFormData.facultyId || '',
                name: editFormData.name || '',
                department: editFormData.department || '',
                designation: editFormData.designation || 'Faculty',
                specialization: editFormData.specialization || '',
                phoneNumber: editFormData.phoneNumber || '',
            };

            const formData = new FormData();
            Object.keys(profileData).forEach(key => {
                formData.append(key, profileData[key]);
            });

            if (editFormData.profilePicture) {
                formData.append('profilePicture', editFormData.profilePicture);
            }

            const res = await axios.post('http://localhost:8081/api/faculty-profile/update', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data) {
                setIsEditing(false);
                alert('Profile updated successfully!');
                window.location.reload();
            }
        } catch (error) {
            console.error('Profile update error:', error);
            alert('An error occurred while updating profile: ' + (error.response?.data?.error || error.message));
        }
    };

    const currentProfilePic = profilePicPreview || faculty?.profilePicUrl;
    const initialLetter = faculty?.name ? faculty.name.substring(0, 1) : '';

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!faculty) return <div>No profile data found.</div>;

    return (
        <div className="main-container" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', gap: 20, padding:'40px', background: 'var(--background-color)', marginTop: 60,  }}>

            <div className="left-panel" style={{ flex: 1, maxWidth: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding:'15px', boxShadow:'rgba(127, 77, 255, 0.1) 0px 8px 32px, rgba(0, 0, 0, 0.04) 0px 1.5px 6px', borderRadius:'20px'}}>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                    <a href="/home" className="back-button" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: 18, textDecoration: 'none', color: 'var(--primary-color, #ef6464)', fontWeight: 600, fontSize: 18, alignSelf: 'flex-start' }}>
                        <span className="back-arrow" style={{ fontSize: 22, marginRight: 8 }}>←</span> Back
                    </a>
                    <div className="welcome-message" style={{ background: 'var(--card-bg, #000000)', borderRadius: 12, padding: '1.55rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <h2 style={{ color: 'var(--primary-color, #181111)', fontWeight: 700, marginBottom: 20, textAlign: 'center', letterSpacing: 1 }}>Hello, {faculty.name}!</h2>
                            <p className="intro-text" style={{ marginBottom: 10, color: 'var(--primary-text, #030202)', textAlign: 'center', fontWeight: 500, fontSize: 20, letterSpacing: 0.2 }}>Welcome to your faculty profile dashboard.</p>
                            <p className="intro-text" style={{ marginBottom: 10, color: 'var(--primary-text, #030202)', textAlign: 'center', fontWeight: 500, fontSize: 18 }}>Manage your events and keep students engaged with Aayojan!</p>
                        </div>
                    </div>
                    <div className="profile-stats" style={{ marginTop: 20 }}>
                        <div className="stat-item">
                            <FontAwesomeIcon icon={faCalendarAlt} />
                            <div className="stat-content">
                                <span className="stat-number"><AnimatedNumber value={eventsOrganized} /></span>
                                <span className="stat-label">Events Organized</span>
                            </div>
                        </div>
                        <div className="stat-item">
                            <FontAwesomeIcon icon={faUsers} />
                            <div className="stat-content">
                                <span className="stat-number"><AnimatedNumber value={studentsParticipated} /></span>
                                <span className="stat-label">Student Participants</span>
                            </div>
                        </div>
                        <div className="stat-item">
                            <FontAwesomeIcon icon={faCertificate} />
                            <div className="stat-content">
                                <span className="stat-number"><AnimatedNumber value={certificatesIssued} /></span>
                                <span className="stat-label">Certificates Issued</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="right-panel" style={{ flex: 1, maxWidth: 'none', transform:'none' }}>
                <div className="profile-card" style={{transform:'none', width: '100%', maxWidth: 750, margin: '0 auto', boxShadow: '0 8px 32px rgba(127, 77, 255, 0.10), 0 1.5px 6px rgba(0, 0, 0, 0.04)', padding: '1.2rem 1rem', background: 'var(--card-bg, #fff)', color: 'var(--text-color, #333)', margin:0, maxWidth:'none', width:'100%' }}>
                    <div className="profile-header">
                        <div class="profileInfo" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <div className="profile-pic-container">
                                {currentProfilePic ? (
                                    <div className="profile-pic">
                                        <img src={currentProfilePic} alt="Profile" />
                                    </div>
                                ) : (
                                    <div className="profile-pic no-pic">
                                        <span className="initial">{initialLetter}</span>
                                    </div>
                                )}
                                <div className="upload-overlay">
                                    <label htmlFor="profile-upload" className="upload-btn">
                                        <FontAwesomeIcon icon={faCamera} />
                                    </label>
                                    <input
                                        type="file"
                                        id="profile-upload"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleProfilePicChange}
                                    />
                                </div>
                            </div>
                            <div className="profile-name-email" style={{ flex: 1, minWidth: '180px' }}>
                                <h2 style={{ marginBottom: '0.2em', fontWeight: 600 }}>{faculty.name}</h2>
                                <p style={{ margin: 0, color: '#555', fontSize: '1em' }}>{faculty.email}</p>
                                <span className="faculty-badge" style={{ background: '#e0e7ff', color: '#3730a3', padding: '0.2em 0.7em', borderRadius: '1em', fontSize: '0.95em', marginTop: '0.3em', display: 'inline-block' }}>{faculty.department}</span>
                            </div>
                            <button
                                className="edit-profile-btn"
                                onClick={handleEditClick}
                                style={{ background: '#3730a3', color: 'white', border: 'none', borderRadius: '6px', padding: '0.5em 1.2em', fontWeight: 500, fontSize: '1em', cursor: isEditing ? 'not-allowed' : 'pointer', opacity: isEditing ? 0.5 : 1, transition: 'opacity 0.2s', minWidth: '120px' }}
                                disabled={isEditing}
                            >
                                <FontAwesomeIcon icon={faPencilAlt} /> Edit Profile
                            </button>
                        </div>
                    </div>

                    {!isEditing ? (
                        <div className="profile-details" id="profileDetails">
                            <h3>Personal Information</h3>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Faculty ID:</span>
                                    <span className="detail-value">{faculty.facultyId}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Name:</span>
                                    <span className="detail-value">{faculty.name}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Department:</span>
                                    <span className="detail-value">{faculty.department}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Designation:</span>
                                    <span className="detail-value">{faculty.designation}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Specialization:</span>
                                    <span className="detail-value">{faculty.specialization}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Phone:</span>
                                    <span className="detail-value">{faculty.phoneNumber}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="edit-profile-form" id="editProfileForm">
                            <h3>Edit Profile</h3>
                            <form onSubmit={handleFormSubmit}>
                                <input type="hidden" name="id" value={faculty.id} />

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">Name</label>
                                        <input type="text" id="name" name="name" value={editFormData.name || ''} onChange={handleFormChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" id="email" name="email" value={editFormData.email || ''} onChange={handleFormChange} required readOnly />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="facultyId">Faculty ID</label>
                                        <input type="text" id="facultyId" name="facultyId" value={editFormData.facultyId || ''} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="department">Department</label>
                                        <input type="text" id="department" name="department" value={editFormData.department || ''} onChange={handleFormChange} required />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="designation">Designation</label>
                                        <input type="text" id="designation" name="designation" value={editFormData.designation || ''} onChange={handleFormChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="specialization">Specialization</label>
                                        <input type="text" id="specialization" name="specialization" value={editFormData.specialization || ''} onChange={handleFormChange} required />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="phoneNumber">Phone Number</label>
                                        <input type="tel" id="phoneNumber" name="phoneNumber" value={editFormData.phoneNumber || ''} onChange={handleFormChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="profilePicture">Profile Picture</label>
                                        <input type="file" id="profilePicture" name="profilePicture" accept="image/*" onChange={handleProfilePicChange} />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                                    <button type="submit" className="save-btn">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="upcoming-events" style={{ padding: 20, background: 'var(--card-bg, #fff)', borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <h3>Events You're Organizing</h3>
                        {upcomingEvents.length > 0 ? (
                            <div className="events-list" style={{ display: 'flex', flexWrap: 'wrap', gap: 45, justifyContent:'space-evenly' }}>
                                {upcomingEvents.map((event, idx) => (
                                    <div className="event-card" key={event.eventId || event.id || idx} style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20, borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', background: 'var(--card-bg, #fff)', boxShadow:'0px 0px 10px 1px red' }}>

                                        {console.log(formatDate(event.date, 'MMM'))}
                                        <div className="event-date" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                            <span className="event-day" style={{ fontSize: 24, fontWeight: 'bold' }}>{formatDate(event.date, 'dd')}</span>
                                            <span className="event-month" style={{ fontSize: 16, color: '#666' }}>{formatDate(event.date, 'MMM')}</span>
                                        </div>
                                        <div className="event-details" style={{ textAlign: 'center', marginBottom: 10, width:'75%' }}>
                                            <h4 style={{ margin: '0 0 10px 0' }}>{event.title}</h4>
                                            <p className="event-time" style={{ margin: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <FontAwesomeIcon icon={faClock} style={{ marginRight: 5 }} />
                                                <span>
                                                    {event.time ? formatTimeTo12Hours(event.time) : 'TBA'}
                                                </span>
                                                {/* <span>{formatDate(event.endDate, 'hh:mm a')}</span> */}
                                            </p>
                                            <p className="event-location" style={{ margin: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: 5 }} />
                                                <span>{event.time ? event.location : 'TBA'}</span>
                                            </p>
                                            <div className="event-stats" style={{ margin: 5 }}>
                                                <span className="event-stat" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding:'10px', maxWidth:'150px', margin:'auto'}}>
                                                    <FontAwesomeIcon icon={faUsers} style={{ marginRight: 5 }} /> {event.registeredCount} registered
                                                </span>
                                            </div>
                                        </div>
                                        <div className="event-actions" style={{ display: 'flex', gap: 10 }}>
                                            <a href={`/event/${event.id}`} className="view-event-btn" style={{ padding: '5px 10px', borderRadius: 4, background: '#3730a3', color: 'white', textDecoration: 'none' }}>View</a>
                                            <Link to={`/faculty/completeEventDetails/${event.eventId}`} className="edit-event-btn" style={{ padding: '5px 10px', borderRadius: 4, background: '#ef6464', color: 'white', textDecoration: 'none' }}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-events">
                                <FontAwesomeIcon icon={faCalendarTimes} />
                                <p>No upcoming events organized</p>
                                <a href="/create-event" className="create-event-btn">Create New Event</a>
                            </div>
                        )}
                    </div>

                    <div className="past-events">
                        <h3>Past Events</h3>
                        {pastEvents.length > 0 ? (
                            <div className="events-list">
                                {pastEvents.map((event, idx) => (
                                    <div className="event-card past-event" key={event.eventId || event.id || idx}>
                                        <div className="event-date">
                                            <span className="event-day">{formatDate(event.date, 'dd')}</span>
                                            <span className="event-month">{formatDate(event.date, 'MMM')}</span>
                                        </div>
                                        <div className="event-details">
                                            <h4>{event.title}</h4>
                                            <div className="event-stats">
                                                <span className="event-stat">
                                                    <FontAwesomeIcon icon={faUsers} /> {event.attendedCount} attended
                                                </span>
                                                <span className="event-stat" style={{padding:'10px'}}>
                                                    <FontAwesomeIcon icon={faCertificate} /> {event.certificatesIssued} certificates
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-events">
                                <p>No past events to display</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyProfilePage;