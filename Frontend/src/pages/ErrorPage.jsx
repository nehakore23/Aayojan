import React from 'react';

import $ from 'jquery';

const errorPageStyles = `
    body {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f8f9fa;
        margin: 0; /* Ensure no default body margin */
    }
    .error-container {
        text-align: center;
        padding: 2rem;
        background: white;
        border-radius: 10px;
        box-shadow: 0 0 15px rgba(0,0,0,0.1);
        max-width: 500px;
        width: 90%;
    }
    .error-code {
        font-size: 4rem;
        font-weight: bold;
        color: #dc3545;
        margin-bottom: 1rem;
    }
    .error-message {
        font-size: 1.2rem;
        color: #6c757d;
        margin-bottom: 2rem;
    }
    .back-button {
        background-color: #0d6efd;
        color: white;
        padding: 0.5rem 2rem;
        border-radius: 5px;
        text-decoration: none;
        transition: background-color 0.3s;
        display: inline-block; /* To allow padding and margin */
    }
    .back-button:hover {
        background-color: #0b5ed7;
        color: white; /* Keep text white on hover */
    }
`;

const ErrorPage = ({ status, error, message }) => {
    // Default values if props are not provided
    const defaultStatus = '404';
    const defaultError = 'Page not found';
    const defaultMessage = 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.';

    return (
        <>
            <style>{errorPageStyles}</style> {/* Apply the internal styles */}
            {/* You might want to import Bootstrap CSS if you plan to use other Bootstrap features.
                For this specific component, the inline styles handle its appearance.
            */}
            {/* <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" /> */}

            <div className="error-container">
                <div className="error-code">{status || defaultStatus}</div>
                <div className="error-message">{error || defaultError}</div>
                <p className="mb-4">
                    {message || defaultMessage}
                </p>
                <a href="/" className="back-button">Go to Homepage</a>
            </div>
        </>
    );
};

export default ErrorPage;