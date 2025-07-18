import React, { useState, useEffect } from 'react';
import './ManageEvents.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import axios from 'axios';


const ManageEvents = ({ errorMessage, successMessage }) => {
    const [events, setEvents] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [eventIdToDelete, setEventIdToDelete] = useState(null);
    const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/eventAuthority/events', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setEvents(response.data);
            } catch (error) {
                console.error('Failed to fetch events:', error);
            }
        };

        fetchEvents();
    }, []);

    // Function to handle delete confirmation
    const confirmDelete = (eventId) => {
        setEventIdToDelete(eventId);
        setShowDeleteModal(true);
    };

    // Function to execute delete
    const handleDelete = async () => {
        console.log('handleDelete started');

        if (!eventIdToDelete || isDeleting) return;

        setIsDeleting(true);


        try {
            const response = await axios.delete(`/api/eventAuthority/event/delete/${eventIdToDelete}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            console.log("Delete response:", response);

      
            setEvents(events => events.filter(event => Number(event.eventId) !== Number(eventIdToDelete)));

           
            setShowDeleteModal(false);
            setEventIdToDelete(null);
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete the event.");
        } finally {
            setIsDeleting(false);
        }
    };




    // Function to open event details modal
    const openEventDetailsModal = (event) => {
        console.log("Opening modal for event:", event);

        setSelectedEvent(event);
        setShowEventDetailsModal(true);
        document.body.style.overflow = 'hidden'; 
    };

    // Function to close event details modal
    const closeEventDetailsModal = () => {
        setShowEventDetailsModal(false);
        setSelectedEvent(null);
        document.body.style.overflow = 'unset'; 
    };

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <>


            <div className="content-container">
                <div className="events-container">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <h1
                            className="page-title"
                            style={{
                                textAlign: 'center',
                                fontWeight: 700,
                                fontSize: '2.2rem',
                                margin: '56px 0 40px 0',
                                letterSpacing: 1,
                                color: '#7f4dff',
                                width: '100%',
                                maxWidth: '100%',
                                display: 'block',
                            }}
                        >
                            Manage Events
                        </h1>
                    </div>

                    {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                            <p>{errorMessage}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="alert alert-success" role="alert">
                            <p>{successMessage}</p>
                        </div>
                    )}

                    <div className="events-table-container" style={{ marginTop: '36px' }}>
                        <table className="events-table">
                            <thead>
                                <tr>
                                    <th>Event ID</th>
                                    <th>Event Name</th>
                                    <th>Date of Event</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '70px 0 60px 0', fontSize: '1.2rem', color: '#888', fontWeight: 600, background: '#fff' }}>
                                            <span style={{ display: 'inline-block', color: '#e53935', fontWeight: 700, fontSize: '1.3rem', letterSpacing: 1 }}>No events found</span>
                                        </td>
                                    </tr>
                                ) : (
                                    events.map((event) => (
                                        <tr key={event.eventId}>
                                            <td>{event.eventId}</td>
                                            <td>{event.title}</td>
                                            <td>{formatDate(event.date)}</td>
                                            <td>{event.location || 'N/A'}</td>
                                            <td>
                                                <span className={`status-badge ${event.published === 1 ? 'published' : 'unpublished'}`}>
                                                    {event.published === 1 ? 'Published' : 'Unpublished'}
                                                </span>
                                            </td>
                                            <td className="actions-cell">
                                                <a href={`/eventAuthority/event/edit/${event.eventId}`} className="action-btn edit-btn">Edit</a>
                                                <button onClick={() => confirmDelete(event.eventId)} className="action-btn delete-btn">Delete</button>
                                                <button
                                                    className={`action-btn ${event.published === 1 ? 'unpublish-btn' : 'publish-btn'}`}
                                                    onClick={async () => {
                                                        try {
                                                            await fetch(`/api/eventAuthority/event/togglePublish/${event.eventId}`, {
                                                                method: 'PUT',
                                                                headers: {
                                                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                                                }
                                                            });
                                                            // Update UI after publish/unpublish
                                                            setEvents(events =>
                                                                events.map(ev =>
                                                                    ev.eventId === event.eventId
                                                                        ? { ...ev, published: ev.published === 1 ? 0 : 1 }
                                                                        : ev
                                                                )
                                                            );
                                                        } catch (err) {
                                                            alert('Failed to update publish status');
                                                        }
                                                    }}
                                                >
                                                    {event.published === 1 ? 'Unpublish' : 'Publish'}
                                                </button>
                                                <button onClick={() => openEventDetailsModal(event)} className="action-btn view-btn">View</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="add-event-container">
                        <a href="/eventAuthority/generateEvent" className="add-event-btn">Generate New Event</a>
                      
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div id="deleteModal" className="modal" style={{ display: 'flex' }}>
                    <div className="modal-content">
                        <h2>Confirm Delete</h2>
                        <p>Are you sure you want to delete this event?</p>
                        <div className="modal-actions">
                            <Button
                                onClick={handleDelete}
                                className="action-btn delete-btn"
                                variant="danger"
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                            <Button
                                onClick={() => setShowDeleteModal(false)}
                                className="action-btn cancel-btn"
                                variant="secondary"
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>

                        </div>
                    </div>
                </div>
            )}

            {/* Event Details Modal */}
            {showEventDetailsModal && selectedEvent && (
                <div id="eventModal" className={`event-modal ${showEventDetailsModal ? 'show' : ''}`} style={{ display: 'block' }}>
                    <div className="event-modal-content">
                        <div className="event-modal-container">
                            <img id="modalEventImage" className="event-image"
                                src={selectedEvent.imageUrl || 'https://via.placeholder.com/800x300/8c7cf7/ffffff?text=Event'}
                                alt="Event"
                            />

                            <button className="event-modal-close" onClick={closeEventDetailsModal}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>

                            <div className="event-content">
                                <div className="event-header">
                                    <div>
                                        <h1 id="modalEventTitle" className="event-title">{selectedEvent.title}</h1>
                                    </div>
                                    <span className="event-status">{selectedEvent.status || 'Upcoming'}</span>
                                </div>

                                <div className="event-details">
                                    <div className="detail-item">
                                        <svg className="detail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                        </svg>
                                        <div className="detail-content">
                                            <div className="detail-label">Date</div>
                                            <div id="modalEventDate" className="detail-value">{formatDate(selectedEvent.date)}</div>
                                        </div>
                                    </div>

                                    <div className="detail-item">
                                        <svg className="detail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polyline points="12 6 12 12 16 14"></polyline>
                                        </svg>
                                        <div className="detail-content">
                                            <div className="detail-label">Time</div>
                                            <div id="modalEventTime" className="detail-value">{selectedEvent.time || 'Time TBD'}</div>
                                        </div>
                                    </div>

                                    <div className="detail-item">
                                        <svg className="detail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        <div className="detail-content">
                                            <div className="detail-label">Location</div>
                                            <div id="modalEventLocation" className="detail-value">{selectedEvent.location || 'Location TBD'}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="event-description">
                                    <h2 className="description-title">Event Description</h2>
                                    <p id="modalEventDescription" className="description-text">{selectedEvent.description || 'No description available.'}</p>
                                </div>

                                <div className="faculty-coordinator">
                                    <h2 className="coordinator-title">Faculty Coordinator</h2>
                                    <div id="modalEventCoordinators" className="coordinator-list">
                                        {selectedEvent.facultyCoordinators && selectedEvent.facultyCoordinators.length > 0 ? (
                                            selectedEvent.facultyCoordinators.map((coordinator, index) => (
                                                <div className="coordinator-item" key={index}>
                                                    <div className="coordinator-icon">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                            <circle cx="12" cy="7" r="4"></circle>
                                                        </svg>
                                                    </div>
                                                    <span>{coordinator}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <span>No coordinators assigned.</span>
                                        )}
                                    </div>
                                </div>

                                {/* Assuming tags are part of event data or can be hardcoded for now */}
                                <div className="tags">
                                    <span className="tag">Technology</span>
                                    <span className="tag">Conference</span>
                                    <span className="tag">Workshop</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ManageEvents;