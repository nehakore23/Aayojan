import React, { useState, useEffect } from 'react';
import './complete-profile-faculty.css';
import axios from 'axios';

const CompleteFacultyProfile = () => {
    const [facultyDTO, setFacultyDTO] = useState({
        userId: '',
        id: '',
        name: '',
        facultyCode: '',
        gender: '',
        department: '',
        designation: '',
        dateOfBirth: '',
        phoneNumber: '',
        expertise: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get('http://localhost:8081/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data) {
                    setFacultyDTO(prev => ({
                        ...prev,
                        userId: response.data.id || '',
                        name: response.data.name || '',
                        email: response.data.email || ''
                    }));
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFacultyDTO(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check all required fields
        if (
            !facultyDTO.name ||
            !facultyDTO.facultyCode ||
            !facultyDTO.gender ||
            !facultyDTO.department ||
            !facultyDTO.designation
        ) {
            alert('Please fill all required fields.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in again to update your profile.');
                return;
            }

            // Format the data according to the backend's expectations
            const profileData = {
                id: facultyDTO.id || '',
                userId: facultyDTO.userId || '',
                name: facultyDTO.name.trim(),
                facultyId: facultyDTO.facultyCode,
                department: facultyDTO.department || '',
                designation: facultyDTO.designation || 'Faculty',
                specialization: facultyDTO.expertise || '',
                phoneNumber: facultyDTO.phoneNumber || '',
                gender: facultyDTO.gender || '',
                dateOfBirth: facultyDTO.dateOfBirth || ''
            };

            // Convert profileData to FormData
            const formData = new FormData();
            Object.entries(profileData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Log the data being sent (for debugging)
            console.log('Sending profile data (FormData):', profileData);

            const response = await axios.post('http://localhost:8081/api/faculty-profile/update', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                    // Do NOT set Content-Type, let the browser set it
                }
            });

            if (response.data) {
                alert('Profile submitted successfully!');
                window.location.href = '/faculty-profile';
            }
        } catch (error) {
            console.error('Profile submission error:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                alert('Error submitting profile: ' + (error.response.data.message || error.response.data.error || 'Unknown error occurred'));
            } else {
                alert('Error submitting profile: ' + error.message);
            }
        }
    };

    return (
        <div className="complete-faculty-profile">
            <div
                className="main-container"
                style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', gap: 48, background: 'pink', padding: '15px', boxShadow: 'rgba(127, 77, 255, 0.1) 0px 8px 32px, rgba(0, 0, 0, 0.04) 0px 1.5px 6px ' }}>
                {/* Left Side: Welcome Message */}
                <div className="left-panel" style={{ flex: 1, maxWidth: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        <a href="/faculty-profile" className="back-button" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: 18, textDecoration: 'none', color: 'var(--primary-color, #ef6464)', fontWeight: 600, fontSize: 18, alignSelf: 'flex-start' }}>
                            <span className="back-arrow" style={{ fontSize: 22, marginRight: 8 }}>←</span> Back
                        </a>
                        <div className="welcome-message" style={{ background: 'var(--card-bg, #000000)', borderRadius: 12, padding: '1.55rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <h2 style={{ color: 'var(--primary-color, #181111)', fontWeight: 700, marginBottom: 20, textAlign: 'center', letterSpacing: 1 }}>Hello!!!</h2>
                                <p className="intro-text" style={{ marginBottom: 10, color: 'var(--primary-text, #030202)', textAlign: 'center', fontWeight: 500, fontSize: 20, letterSpacing: 0.2 }}>Great events don't just happen—<span style={{ color: 'var(--primary-color, #ff5a5f)', fontWeight: 700 }}>they're made possible by mentors like you!</span></p>
                                <p className="intro-text" style={{ marginBottom: 10, color: 'var(--primary-text, #030202)', textAlign: 'center', fontWeight: 500, fontSize: 18 }}>Aayojan is built to <span style={{ color: 'var(--accent-color, #c026d3)', fontWeight: 600 }}>simplify event management</span> for faculty like you.</p>
                                <p className="tagline" style={{ fontStyle: 'italic', color: 'var(--accent-color, #c026d3)', marginTop: 10, textAlign: 'center', fontWeight: 600, fontSize: 17, letterSpacing: 0.1 }}>
                                    Shape experiences. <span style={{ color: 'var(--primary-color, #ff5a5f)' }}>Inspire students.</span> Lead with <span style={{ color: 'var(--primary-color, #ff5a5f)' }}>Aayojan</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Right Side: Form */}
                <div className="right-panel" style={{ flex: 1, maxWidth: 600 }}>
                    <div className="profile-card" style={{ width: '100%', maxWidth: 570, margin: '0 auto', boxShadow: '0 8px 32px rgba(127, 77, 255, 0.10), 0 1.5px 6px rgba(0, 0, 0, 0.04)', padding: '1.2rem 1rem', background: 'var(--card-bg, #fff)', color: 'var(--text-color, #333)' }}>
                        <h2 className="form-title" style={{ textAlign: 'center', marginBottom: 24 }}>Add your Details...</h2>
                        <form onSubmit={handleSubmit}>
                            <input type="hidden" name="userId" value={facultyDTO.userId} />
                            <input type="hidden" name="id" value={facultyDTO.id} />
                            <div className="form-group" style={{ marginBottom: 18 }}>
                                <input
                                    type="text"
                                    name="name"
                                    value={facultyDTO.name}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    required
                                    style={{ width: '100%', padding: '12px 14px', fontSize: 17, borderRadius: 8, border: '1px solid var(--input-border, #ccc)', background: 'var(--input-bg, #fff)', color: 'var(--text-color, #333)' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 18 }}>
                                <input
                                    type="text"
                                    name="facultyCode"
                                    value={facultyDTO.facultyCode}
                                    onChange={handleChange}
                                    placeholder="Faculty Code"
                                    required
                                    style={{ width: '100%', padding: '12px 14px', fontSize: 17, borderRadius: 8, border: '1px solid var(--input-border, #ccc)', background: 'var(--input-bg, #fff)', color: 'var(--text-color, #333)' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 10 }}>
                                <select
                                    name="gender"
                                    value={facultyDTO.gender}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '12px 14px', fontSize: 17, borderRadius: 8, border: '1px solid var(--input-border, #ccc)', background: 'var(--input-bg, #fff)', color: 'var(--text-color, #333)' }}
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: 18 }}>
                                <input
                                    type="text"
                                    name="department"
                                    value={facultyDTO.department}
                                    onChange={handleChange}
                                    placeholder="Department"
                                    required
                                    style={{ width: '100%', padding: '12px 14px', fontSize: 17, borderRadius: 8, border: '1px solid var(--input-border, #ccc)', background: 'var(--input-bg, #fff)', color: 'var(--text-color, #333)' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 18 }}>
                                <input
                                    type="text"
                                    name="designation"
                                    value={facultyDTO.designation}
                                    onChange={handleChange}
                                    placeholder="Designation"
                                    required
                                    style={{ width: '100%', padding: '12px 14px', fontSize: 17, borderRadius: 8, border: '1px solid var(--input-border, #ccc)', background: 'var(--input-bg, #fff)', color: 'var(--text-color, #333)' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 18 }}>
                                <input
                                    type="text"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    required
                                    value={facultyDTO.dateOfBirth}
                                    onChange={handleChange}
                                    placeholder="Enter your DOB (DD-MM-YYYY)"
                                    onFocus={(e) => e.target.type = 'date'}
                                    onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                                    style={{ width: '100%', padding: '12px 14px', fontSize: 17, borderRadius: 8, border: '1px solid var(--input-border, #ccc)', background: 'var(--input-bg, #fff)', color: 'var(--text-color, #333)' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 18 }}>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={facultyDTO.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                    required
                                    style={{ width: '100%', padding: '12px 14px', fontSize: 17, borderRadius: 8, border: '1px solid var(--input-border, #ccc)', background: 'var(--input-bg, #fff)', color: 'var(--text-color, #333)' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 18 }}>
                                <select
                                    name="expertise"
                                    value={facultyDTO.expertise}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '12px 14px', fontSize: 17, borderRadius: 8, border: '1px solid var(--input-border, #ccc)', background: 'var(--input-bg, #fff)', color: 'var(--text-color, #333)' }}
                                >
                                    <option value="" disabled>Select Area of Expertise</option>
                                    <option value="Technical">Technical</option>
                                    <option value="Cultural">Cultural</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Academic">Academic</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <button type="submit" className="submit-btn" style={{ width: '100%', marginTop: 10, padding: '10px 0', fontSize: 16, borderRadius: 8, background: 'var(--primary-color, #ef6464)', color: 'var(--button-text, #fff)' }}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompleteFacultyProfile;
