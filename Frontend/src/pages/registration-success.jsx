import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RegistrationSuccess = ({ registrationId }) => {
    const [confettiPieces, setConfettiPieces] = useState([]);
    const [downloading, setDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState(null);

    useEffect(() => {
        // Generate confetti pieces
        const newConfetti = [];
        for (let i = 0; i < 30; i++) {
            newConfetti.push({
                key: i,
                left: Math.random() * 100 + '%',
                width: Math.random() * 10 + 5 + 'px',
                height: Math.random() * 20 + 10 + 'px',
                animationDuration: Math.random() * 3 + 2 + 's',
                animationDelay: Math.random() * 5 + 's',
                backgroundColor: Math.random() > 0.5 ? '#f64c4c' : '#ff8a8a',
            });
        }
        setConfettiPieces(newConfetti);
    }, []);

    const handleDownloadTicket = async () => {
        setDownloading(true);
        setDownloadError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:8081/api/events/ticket/${registrationId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: 'blob',
                }
            );
            // Create a link to download the PDF
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'ticket.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            setDownloadError('Failed to download ticket. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    const homeLink = "/home";

    return (
        <div style={{ minHeight: '100vh', position: 'relative', background: '#f5f5f5' }}>
            {/* Confetti animation elements */}
            <div className="confetti">
                {confettiPieces.map((piece) => (
                    <div
                        key={piece.key}
                        className="confetti-piece"
                        style={{
                            left: piece.left,
                            width: piece.width,
                            height: piece.height,
                            animationDuration: piece.animationDuration,
                            animationDelay: piece.animationDelay,
                            backgroundColor: piece.backgroundColor,
                        }}
                    ></div>
                ))}
            </div>

            <div className="success-container">
                <div className="header">
                    <div className="success-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1>Registration Successful!</h1>
                    <p>You're all set for the event</p>
                </div>
                <div className="content">
                    <p className="message">Thank you for registering! We've reserved your spot and look forward to seeing you at the event.</p>

                    <div className="event-details">
                        <div className="detail-item">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span className="detail-text">A confirmation email has been sent to your registered email address.</span>
                        </div>
                        <div className="detail-item">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="detail-text">Event added to your dashboard. You can access event details anytime.</span>
                        </div>
                    </div>

                    <div className="actions">
                        <a href={homeLink} className="home-button">Return to Home</a>
                        <button
                            className="calendar-button"
                            onClick={handleDownloadTicket}
                            disabled={downloading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {downloading ? 'Downloading...' : 'Download Ticket'}
                        </button>
                        {downloadError && <div style={{ color: 'red', marginTop: 10 }}>{downloadError}</div>}
                    </div>
                </div>
            </div>

            <style>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                .confetti {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    z-index: -1;
                }
                .confetti-piece {
                    position: absolute;
                    width: 8px;
                    height: 16px;
                    background-color: #f64c4c;
                    top: -10%;
                    animation: fall linear forwards;
                }
                .success-container {
                    background-color: white;
                    border-radius: 16px;
                    overflow: hidden;
                    width: 90%;
                    max-width: 500px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    animation: appear 0.5s ease-out forwards;
                    margin: 60px auto;
                }
                .header {
                    background-color: #f64c4c;
                    padding: 30px 20px;
                    color: white;
                    position: relative;
                }
                .header h1 {
                    font-size: 28px;
                    margin-bottom: 10px;
                    font-weight: 600;
                }
                .success-icon {
                    width: 100px;
                    height: 100px;
                    background-color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto;
                    margin-bottom: 15px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    animation: pulse 2s infinite;
                }
                .success-icon svg {
                    width: 60px;
                    height: 60px;
                    color: #f64c4c;
                }
                .content {
                    padding: 40px 30px;
                }
                .message {
                    color: #333;
                    font-size: 18px;
                    margin-bottom: 25px;
                    line-height: 1.5;
                }
                .event-details {
                    background-color: #f9f9f9;
                    border-radius: 10px;
                    padding: 20px;
                    margin-bottom: 30px;
                    text-align: left;
                }
                .detail-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                }
                .detail-item:last-child {
                    margin-bottom: 0;
                }
                .detail-item svg {
                    width: 22px;
                    height: 22px;
                    color: #f64c4c;
                    margin-right: 12px;
                    flex-shrink: 0;
                }
                .detail-text {
                    font-size: 15px;
                    color: #555;
                }
                .actions {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .home-button {
                    background-color: #f64c4c;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 14px 20px;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    text-decoration: none;
                    display: block;
                }
                .home-button:hover {
                    background-color: #e43c3c;
                }
                .calendar-button {
                    background-color: white;
                    color: #333;
                    border: 2px solid #ddd;
                    border-radius: 8px;
                    padding: 12px 20px;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    text-decoration: none;
                }
                .calendar-button:hover {
                    border-color: #ccc;
                    background-color: #f9f9f9;
                }
                @keyframes appear {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                @media (max-width: 576px) {
                    .success-container {
                        width: 95%;
                    }
                    .header h1 {
                        font-size: 24px;
                    }
                    .content {
                        padding: 30px 20px;
                    }
                    .message {
                        font-size: 16px;
                    }
                }
            `}</style>
        </div>
    );
};

export default RegistrationSuccess;