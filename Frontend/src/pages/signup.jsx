import React, { useState } from 'react';
import './home.css'; 
import './signup.css';
import logo from './logo.svg'; 
import axios from 'axios';

import Form from 'react-bootstrap/Form';
import CustomNavbar from './Navbar';
import Footer from './Footer';

const Signup = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Password regex: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }
        if (!passwordRegex.test(password)) {
            setErrorMessage(
                "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
            );
            return;
        }

        const signupRequest = {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            role,
        };
        axios.post('http://localhost:8081/api/auth/signup', signupRequest)
            .then(response => {
                setErrorMessage('');
                alert('Signup successful! Please login.');
                window.location.href = '/';
            })
            .catch(error => {
                setErrorMessage(error.response?.data?.message || 'Signup failed');
            });
    };


    return (
        <>
            <CustomNavbar />
            <div className="signup-container">
                <h1 className="events-title">Sign Up</h1>

                {errorMessage && (
                    <div className="error-message">
                        <p>{errorMessage}</p>
                    </div>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="form-group" controlId="firstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            placeholder="Enter your first name"
                        />
                    </Form.Group>

                    <Form.Group className="form-group" controlId="lastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            placeholder="Enter your last name"
                        />
                    </Form.Group>

                    <Form.Group className="form-group" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="example@charusat.edu.in"
                        />
                    </Form.Group>

                    <Form.Group className="form-group" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </Form.Group>

                    <Form.Group className="form-group" controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm your password"
                        />
                    </Form.Group>

                    <Form.Group className="form-group" controlId="role">
                        <Form.Label>Role</Form.Label>
                        <Form.Select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="">Select Role</option>
                            <option value="STUDENT">Student</option>
                            <option value="FACULTY">Faculty</option>
                        </Form.Select>
                    </Form.Group>

                    <button type="submit" className="signup-btn">Sign Up</button>
                </Form>

                <div className="login-link">
                    Already have an account? <a href="/">Login here</a>
                </div>
            </div>

            <style>{`
                .signup-container {
                    max-width: 400px;
                    margin: 2rem auto;
                    padding: 2rem;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .form-group {
                    margin-bottom: 1.5rem;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                }
                .form-group input,
                .form-group select {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 1rem;
                }
                .signup-btn {
                    width: 100%;
                    background: #6c63ff;
                    color: white;
                    padding: 0.75rem;
                    border: none;
                    border-radius: 4px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background 0.3s;
                }
                .signup-btn:hover {
                    background: #5a52d5;
                }
                .error-message {
                    background: #ff6b6b;
                    color: white;
                    padding: 1rem;
                    border-radius: 4px;
                    margin-bottom: 1rem;
                }
                .login-link {
                    text-align: center;
                    margin-top: 1rem;
                }
                .login-link a {
                    color: #6c63ff;
                    text-decoration: none;
                }
                .login-link a:hover {
                    text-decoration: underline;
                }
            `}</style>
            <Footer />
        </>
    );
};

export default Signup;