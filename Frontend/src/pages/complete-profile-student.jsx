import React, { useState, useEffect } from 'react';
import './complete-profile-student.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompleteStudentProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        enrollmentNumber: '',
        course: '',
        department: '',
        semester: '',
        dateOfBirth: '',
        phoneNumber: '',
        gender: ''
    });

    const [userName, setUserName] = useState('Student Name');

    useEffect(() => {
        // Check user role on component mount
        const userRole = localStorage.getItem('role');
        console.log('Current user role:', userRole); // Debug log
        
        // Normalize role format for comparison
        const normalizedRole = userRole?.toUpperCase();
        
        // Only allow STUDENT role
        if (normalizedRole !== 'ROLE_STUDENT') {
            alert('Access denied. This page is only for students.');
            if (normalizedRole === 'ROLE_EVENT_AUTHORITY') {
                navigate('/eventAuthority/manageEvents');
            } else {
                navigate('/login');
            }
            return;
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('role');
        
        if (!token) {
            alert('Authentication token not found. Please log in again.');
            navigate('/login');
            return;
        }

        // Check if name is provided
        if (!formData.name || formData.name.trim() === '') {
            alert('Please enter your name');
            return;
        }

        // Normalize role format for comparison
        const normalizedRole = userRole?.toUpperCase();
        
        // Only allow STUDENT role
        if (normalizedRole !== 'ROLE_STUDENT') {
            alert('Access denied. This action is only for students.');
            if (normalizedRole === 'ROLE_EVENT_AUTHORITY') {
                navigate('/eventAuthority/manageEvents');
            } else {
                navigate('/login');
            }
            return;
        }

        try {
            // Create FormData object
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('enrollmentNumber', formData.enrollmentNumber);
            formDataToSend.append('course', formData.course);
            formDataToSend.append('department', formData.department);
            formDataToSend.append('semester', formData.semester);
            formDataToSend.append('dateOfBirth', formData.dateOfBirth);
            formDataToSend.append('phoneNumber', formData.phoneNumber);
            formDataToSend.append('gender', formData.gender);

            // Log the request data for debugging
            console.log('Submitting profile data:', Object.fromEntries(formDataToSend));

            const response = await axios.post('http://localhost:8081/api/student-profile/update', formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Don't set Content-Type, let the browser set it for FormData
                }
            });

            console.log('Profile submission response:', response.data);
            alert('Profile submitted successfully!');
            navigate('/student-profile');
        } catch (error) {
            console.error('Profile submission error:', error.response?.data || error);
            
            if (error.response) {
                switch (error.response.status) {
                    case 403:
                        alert('Access denied. Please log in as a student.');
                        localStorage.removeItem('token');
                        localStorage.removeItem('role');
                        navigate('/login');
                        break;
                    case 500:
                        alert('Server error. Please check your input data and try again.');
                        console.error('Server error details:', error.response.data);
                        break;
                    default:
                        alert('Error submitting profile: ' + (error.response.data?.error || error.response.data?.message || 'Unknown error'));
                }
            } else if (error.request) {
                alert('No response from server. Please check your internet connection.');
            } else {
                alert('Error submitting profile: ' + error.message);
            }
        }
    };

    return (
        <div>
            <header className="header">
                {/* <div className="header-content">
                    <h1 className="page-title">Complete Your Profile...</h1>
                </div> */}
            </header>

            <div className="main-container">
                <div className="left-panel">
                    <a href="/student-profile" className="back-button">
                        <span className="back-arrow">←</span> Back
                    </a>

                    {/* <div className="welcome-message">
                        <h2>Hello, <span>{userName}</span>!!!</h2>
                        <p className="intro-text">
                            Filling out your profile doesn't mean you HAVE to attend events...
                        </p>
                        <p className="intro-text">
                            but it does mean you're officially one step closer to FOMO! <span className="emoji">😜</span>
                        </p>
                    </div> */}
                </div>
                    
                <div className="right-panel">
                    <div className="profile-card">
                        <h2 className="form-title">Add your Details...</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="enrollmentNumber"
                                    placeholder="Enrollment Number"
                                    required
                                    value={formData.enrollmentNumber}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="course"
                                    placeholder="Course"
                                    required
                                    value={formData.course}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="department"
                                    placeholder="Department"
                                    required
                                    value={formData.department}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="semester"
                                    placeholder="Semester"
                                    required
                                    value={formData.semester}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    required
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    placeholder="Enter your DOB (DD-MM-YYYY)"
                                    onFocus={(e) => e.target.type = 'date'}
                                    onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <select
                                    name="gender"
                                    required
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <button type="submit" className="submit-btn">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompleteStudentProfile;
