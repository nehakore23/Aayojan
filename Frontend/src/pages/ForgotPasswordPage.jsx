import React, { useState, useEffect, useRef } from 'react';
import './forget_password.css';
import axios from 'axios';
import { handleOtpInput, validatePasswordsMatch, handleOtpPaste } from '../utils/otpAndPasswordUtils';

const ForgotPasswordPage = ({ initialStep = 'email', initialEmail = '', initialToken = '' }) => {
    const [step, setStep] = useState(initialStep);
    const [email, setEmail] = useState(initialEmail);
    const [otp, setOtp] = useState(['', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState(initialToken);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordMismatchError, setPasswordMismatchError] = useState(false);


    const otpRefs = useRef([]);


    useEffect(() => {
        if (step === 'otp') {
            otpRefs.current.forEach((input, index) => {
                if (input) {
                    const handleKeyDown = (e) => {
                        if (e.key === 'Backspace' && input.value === '' && index > 0) {
                            otpRefs.current[index - 1].focus();
                        }
                    };
                    const handleKeyUp = (e) => {

                        handleOtpInput(e, `otp${index + 2}`);
                    };

                    input.addEventListener('keydown', handleKeyDown);
                    input.addEventListener('keyup', handleKeyUp);

                    return () => {
                        input.removeEventListener('keydown', handleKeyDown);
                        input.removeEventListener('keyup', handleKeyUp);
                    };
                }
            });
        }
    }, [step, otp]);

    // Validate token before showing reset form
    useEffect(() => {
        const validateToken = async () => {
            if (step === 'reset' && token) {
                try {
                    const response = await axios.post('/api/forgot-password/validate-token', { email, token });
                    if (response.data && response.data.error) {
                        setErrorMessage(response.data.error || 'Invalid or expired reset token.');
                        setStep('email');
                    }
                } catch (error) {
                    setErrorMessage(error.response?.data?.error || 'Invalid or expired reset token.');
                    setStep('email');
                }
            }
        };
        validateToken();

    }, [step, token]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        try {
            // Real API call
            const response = await axios.post('/api/forgot-password/send-code', { email });
            if (response.data && !response.data.error) {
                setSuccessMessage(response.data.message || 'Verification code sent to your email.');
                setStep('otp');
            } else {
                setErrorMessage(response.data.error || response.data.message || 'Failed to send verification code.');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred while sending the code.');
            console.error('Error sending code:', error);
        }
    };

    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
        }
    };

    const handleVerifyCodeSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        const enteredOtp = otp.join('');
        try {
            // Real API call
            const response = await axios.post('/api/forgot-password/verify-code', { email, otp: enteredOtp });
            if (response.data && !response.data.error) {
                setSuccessMessage(response.data.message || 'OTP verified successfully.');
                setToken(response.data.token);
                setStep('reset');
            } else {
                setErrorMessage(response.data.error || 'Invalid OTP. Please try again.');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'An error occurred during OTP verification.');
            console.error('Error verifying OTP:', error);
        }
    };

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        setPasswordMismatchError(false);

        if (!validatePasswordsMatch(newPassword, confirmPassword)) {
            setPasswordMismatchError(true);
            return;
        }

        try {
            // Real API call
            const response = await axios.post('/api/forgot-password/reset', { email, token, newPassword, confirmPassword });
            if (response.data && !response.data.error) {
                setSuccessMessage(response.data.message || 'Password reset successfully! You can now login.');

            } else {
                setErrorMessage(response.data.error || 'Failed to reset password.');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'An error occurred while resetting password.');
            console.error('Error resetting password:', error);
        }
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
        if (passwordMismatchError && validatePasswordsMatch(e.target.value, confirmPassword)) {
            setPasswordMismatchError(false);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (passwordMismatchError && validatePasswordsMatch(newPassword, e.target.value)) {
            setPasswordMismatchError(false);
        }
    };

    // This would be called by a button, if you want to implement resend code
    const handleResendCode = async () => {
        setSuccessMessage('');
        setErrorMessage('');
        console.log('Resending verification code to:', email);
        try {

            setSuccessMessage('A new verification code has been sent to your email.');
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (error) {
            setErrorMessage('Error resending code.');
            console.error('Error resending code:', error);
        }
    };

    return (
        <>
            {/* The Navbar component should be imported and rendered in a parent component,
                or directly here if you meant to just remove the internal HTML for it.
                For example: <Navbar />
            */}

            <div className="content">
                <div className="password-reset-container">
                    <h2>FORGOT PASSWORD</h2>

                    {/* Success message */}
                    {successMessage && (
                        <div className="success-message" style={{ color: 'green', textAlign: 'center', marginTop: '15px' }}>
                            <p>{successMessage}</p>
                        </div>
                    )}

                    {/* Error message */}
                    {errorMessage && (
                        <div className="error-message" style={{ color: 'red', textAlign: 'center', marginTop: '15px' }}>
                            <p>{errorMessage}</p>
                        </div>
                    )}

                    {/* Email Step */}
                    {step === 'email' && (
                        <div className="form-step" id="email-step">
                            <div className="step-indicator">
                                <div className="step active-step">
                                    <div className="step-circle">1</div>
                                    <div className="step-text">Email</div>
                                </div>
                                <div className="step-line"></div>
                                <div className="step">
                                    <div className="step-circle">2</div>
                                    <div className="step-text">Verify</div>
                                </div>
                                <div className="step-line"></div>
                                <div className="step">
                                    <div className="step-circle">3</div>
                                    <div className="step-text">Reset</div>
                                </div>
                            </div>

                            <p className="form-instructions">Enter your email address to receive a verification code</p>

                            <form onSubmit={handleEmailSubmit}>
                                <div className="form-group">
                                    <label htmlFor="email">E-Mail</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <button type="submit" className="reset-button">Send Verification Code</button>
                            </form>

                            <div className="back-to-login">
                                <a href="/">Back to Login</a>
                            </div>
                        </div>
                    )}

                    {/* OTP Step */}
                    {step === 'otp' && (
                        <div className="form-step" id="otp-step">
                            <div className="step-indicator">
                                <div className="step active-step">
                                    <div className="step-circle">1</div>
                                    <div className="step-text">Email</div>
                                </div>
                                <div className="step-line active-line"></div>
                                <div className="step active-step">
                                    <div className="step-circle">2</div>
                                    <div className="step-text">Verify</div>
                                </div>
                                <div className="step-line"></div>
                                <div className="step">
                                    <div className="step-circle">3</div>
                                    <div className="step-text">Reset</div>
                                </div>
                            </div>

                            <p className="form-instructions">Enter the 4-digit verification code sent to your email</p>

                            <form onSubmit={handleVerifyCodeSubmit}>
                                <input type="hidden" name="email" value={email} />

                                <div className="otp-container">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            className="otp-input"
                                            id={`otp${index + 1}`}
                                            name={`otp${index + 1}`}
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(e, index)}
                                            onPaste={(e) => handleOtpPaste(e, otpRefs, index, setOtp)} // Pass refs, index, and setState
                                            ref={el => otpRefs.current[index] = el} // Attach ref
                                            required
                                        />
                                    ))}
                                </div>

                                <button type="submit" className="reset-button">Verify Code</button>
                                {/* Add resend code button, if desired */}
                                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                    <button type="button" className="resend-code-btn" onClick={handleResendCode} style={{ background: 'none', border: 'none', color: '#6c63ff', cursor: 'pointer' }}>
                                        Resend Code
                                    </button>
                                </div>
                            </form>

                            <div className="back-to-login">
                                <a href="/" onClick={() => setStep('email')}>Back</a>
                            </div>
                        </div>
                    )}

                    {/* Reset Password Step */}
                    {step === 'reset' && (
                        <div className="form-step" id="reset-step">
                            <div className="step-indicator">
                                <div className="step active-step">
                                    <div className="step-circle">1</div>
                                    <div className="step-text">Email</div>
                                </div>
                                <div className="step-line active-line"></div>
                                <div className="step active-step">
                                    <div className="step-circle">2</div>
                                    <div className="step-text">Verify</div>
                                </div>
                                <div className="step-line active-line"></div>
                                <div className="step active-step">
                                    <div className="step-circle">3</div>
                                    <div className="step-text">Reset</div>
                                </div>
                            </div>

                            <p className="form-instructions">Create your new password</p>

                            <form onSubmit={handleResetPasswordSubmit}>
                                <input type="hidden" name="email" value={email} />
                                <input type="hidden" name="token" value={token} />

                                <div className="form-group">
                                    <label htmlFor="new-password">New Password</label>
                                    <input
                                        type="password"
                                        id="new-password"
                                        name="newPassword"
                                        placeholder="Enter new password"
                                        required
                                        value={newPassword}
                                        onChange={handleNewPasswordChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirm-password">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirm-password"
                                        name="confirmPassword"
                                        placeholder="Confirm new password"
                                        required
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                    />
                                </div>

                                {passwordMismatchError && (
                                    <div className="error-message" id="password-error" style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>
                                        Passwords do not match!
                                    </div>
                                )}

                                <button type="submit" className="reset-button">Reset Password</button>
                            </form>

                            <div className="back-to-login">
                                <a href="/" onClick={() => setStep('otp')}>Back</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ForgotPasswordPage;