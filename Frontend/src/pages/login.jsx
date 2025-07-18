import React, { useState } from 'react';
import './login.css';
import './google-button.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import CustomNavbar from './Navbar';
import Footer from './Footer';

const GoogleButton = () => (
    <div className="google-btn">
        <div className="google-icon-wrapper">
            <img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google icon" />
        </div>
        <p className="btn-text"><b>Sign in with Google</b></p>
    </div>
);

const LoginPage = ({ setIsAuthenticated, setCurrentUserRole }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8081/api/auth/login', {
            email: email,
            password: password
        })
            .then(response => {
                localStorage.setItem('token', response.data.token);
                const role = response.data.role;
                console.log("Login response role:", role); // Debug log
                
                // Ensure role is properly formatted
                let formattedRole = role;
                if (!role.startsWith('ROLE_')) {
                    formattedRole = `ROLE_${role}`;
                }
                
                // Special handling for event authority
                if (role === 'EVENT_AUTHORITY' || role === 'ROLE_EVENT_AUTHORITY') {
                    formattedRole = 'ROLE_EVENT_AUTHORITY';
                }
                
                console.log("Formatted role:", formattedRole); // Debug log
                
                setCurrentUserRole(formattedRole);
                localStorage.setItem('role', formattedRole);
                setIsAuthenticated(true);

                console.log("Logged in as role:", formattedRole);
                setSuccessMessage('Login successful!');
                setErrorMessage('');
                navigate('/home');
            })
            .catch(error => {
                setErrorMessage('Invalid username or password.');
                setSuccessMessage('');
            });
    };


    return (
        <>
            <CustomNavbar />
            <div className="container">
                <div className="login-card">
                    <h1>LOGIN</h1>
                    {successMessage && (
                        <div className="alert success">
                            <p>{successMessage}</p>
                        </div>
                    )}
                    {errorMessage && (
                        <div className="alert error">
                            <p>{errorMessage}</p>
                        </div>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="form-group" controlId="username">
                            <Form.Label>E-Mail</Form.Label>
                            <Form.Control
                                type="email"
                                name="username"
                                placeholder="example@charusat.edu.in"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="form-group" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="************"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <div className="forget-password">
                            <a href="/forgot-password">Forget Password?!</a>
                        </div>
                        <button type="submit" className="login-btn">Login</button>
                    </Form>
                    <div className="divider">
                        <hr />
                        <span>OR</span>
                        <hr />
                    </div>
                    <div className="signup-prompt">
                        Don't have an account? <a href="/signup">Sign Up</a>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default LoginPage;