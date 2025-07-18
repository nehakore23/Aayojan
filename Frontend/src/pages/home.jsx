import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import noEventsImg from '../assets/images/event.jpg';


const Home = ({
  userRole,
  studentProfileIncomplete,
  facultyProfileIncomplete,
  errorMessage,
  profileLink
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [registering, setRegistering] = useState(false);

  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    // Update this endpoint to your backend's published events endpoint
    axios.get('http://localhost:8081/api/home/events/published')
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));


    const token = localStorage.getItem('token');

    axios.get('http://localhost:8081/api/home/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

      .then(res => setUserInfo(res.data))
      .catch(err => setUserInfo(null));
  }, []);
  const openModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    document.body.style.overflow = 'unset';
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1);

    if (term === '') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event =>
        event.title.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  };

  const handleLoadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const eventsToDisplay = filteredEvents.slice(0, currentPage * ITEMS_PER_PAGE);

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share && selectedEvent) {
      navigator.share({
        title: selectedEvent.title,
        text: selectedEvent.description,
        url: window.location.href
      }).catch(error => console.error('Error sharing:', error));
    }
  };

  const handleRegister = (eventId) => {
    if (isProfileIncompleteAndStudent) {
      alert("Please complete your student profile before registering.");
      navigate('/student/complete-profile');
      return;
    }
    if (isProfileIncompleteAndFaculty) {
      alert("Please complete your faculty profile before registering.");
      navigate('/faculty/complete-profile');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to register for events.");
      navigate('/login');
      return;
    }

    setRegistering(true);
    axios.post(`http://localhost:8081/api/events/register`, 
      { eventId }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
      .then(res => {
        alert("Registered successfully!");
        closeModal();
        // Optionally refresh the events list
        window.location.reload();
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === 401) {
            alert("Your session has expired. Please log in again.");
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            navigate('/login');
          } else if (err.response.status === 403) {
            alert("You don't have permission to register for this event.");
          } else {
            alert(err.response.data?.message || "Registration failed. Please try again.");
          }
        } else if (err.request) {
          alert("No response from server. Please check your internet connection.");
        } else {
          alert("An error occurred. Please try again.");
        }
      })
      .finally(() => setRegistering(false));
  };





  const isStudent = userRole === 'STUDENT';
  const isFaculty = userRole === 'FACULTY';

  const isProfileIncompleteAndStudent = isStudent && studentProfileIncomplete;
  const isProfileIncompleteAndFaculty = isFaculty && facultyProfileIncomplete;

  return (
    <div>
      {/* Profile Completion Alerts */}
      {isProfileIncompleteAndStudent && (
        <div className="profile-completion-alert">
          <strong>Action Required:</strong> Your student profile is incomplete.
          <a href="/student/complete-profile">Please complete your profile</a> to register for events and access all features.
        </div>
      )}
      {isProfileIncompleteAndFaculty && (
        <div className="profile-completion-alert faculty-alert">
          <strong>Action Required:</strong> Your faculty profile is incomplete.
          <a href="/faculty/complete-profile">Please complete your profile</a> to access all faculty features.
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div id="error-toast" className="toast-message">
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Events Section */}
      <section className="events-section">
        <h1 className="events-title">Upcoming Events</h1>

        {/* Search Bar */}
        <div className="search-filter">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              disabled={isProfileIncompleteAndStudent}
            />
            {/* Add your SearchIcon here */}
          </div>
        </div>

        {/* Event Details Modal */}
        {isModalOpen && selectedEvent && (
          <div id="eventModal" className={`modal ${isModalOpen ? 'show' : ''}`}>
            <div className="modal-content">
              <div className="modal-container">
                <img
                  id="modalEventImage"
                  className="event-image"
                  src={noEventsImg}
                  alt="Event"
                />
                <button className="modal-close" onClick={closeModal}>
                  {/* Add your CloseIcon here */}
                  X
                </button>
                <div className="event-content">
                  <div className="event-header">
                    <h1 id="modalEventTitle" className="event-title">{selectedEvent.title}</h1>
                    <span className="event-status">Upcoming</span>
                  </div>
                  <div className="event-details">
                    <div className="detail-item">

                      <div className="detail-label">Date</div>
                      <div id="modalEventDate" className="detail-value">
                        {new Date(selectedEvent.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="detail-item">

                      <div className="detail-label">Time</div>
                      <div id="modalEventTime" className="detail-value">{selectedEvent.time || 'Time TBD'}</div>
                    </div>
                    <div className="detail-item">

                      <div className="detail-label">Location</div>
                      <div id="modalEventLocation" className="detail-value">{selectedEvent.location || 'Location TBD'}</div>
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
                            {/* Add your UserIcon here */}
                            <span>{coordinator}</span>
                          </div>
                        ))
                      ) : (
                        <div>No coordinators listed.</div>
                      )}
                    </div>
                  </div>
                  <div className="action-buttons">
                    <button
                      type="submit"
                      className="register-button"
                      onClick={() => handleRegister(selectedEvent.eventId)}
                      disabled={registering}

                    >
                      {registering ? 'Registering...' : 'Register Now'}
                    </button>
                    <button className="share-button" onClick={handleShare}>
                      {/* Add your ShareIcon here */}
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Grid */}
        <div className={`events-grid ${isProfileIncompleteAndStudent ? 'disabled-interaction' : ''}`}>
          {eventsToDisplay.length > 0 ? (
            eventsToDisplay.map(event => (
              <div className="event-card" key={event.eventId} onClick={() => openModal(event)} style={{ cursor: 'pointer' }}>
                <img
                  src={noEventsImg}
                  className="event-image"
                  alt={event.title}
                />
                <div className="event-details">
                  <div className="event-date">
                    <div className="date-box">
                      <div className="month">{event.month}</div>
                      <div className="day">{event.day}</div>
                    </div>
                    <div className="event-info">
                      <h3 className="event-title">{event.title}</h3>
                      <p className="event-location">
                        {/* Add your MapPinIcon here */}
                        <span>{event.location || 'Location TBD'}</span>
                      </p>
                      <p className="event-description">{event.description || 'No description available.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            searchTerm === '' ? (
              <div className="event-card">
                <img src={noEventsImg} className="event-image" alt="No Events" />
                <div className="event-details">
                  <div className="event-date">
                    <div className="date-box">
                      <div className="month">---</div>
                      <div className="day">--</div>
                    </div>
                    <div className="event-info">
                      <h3 className="event-title">No Events Available</h3>
                      <p className="event-description">Check back later for upcoming events.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-results-message">
                No events found matching your search.
              </div>
            )
          )}
        </div>

        {/* Load More Button */}
        {eventsToDisplay.length < filteredEvents.length && (
          <button className="load-more" onClick={handleLoadMore}>Load More</button>
        )}
      </section>
    </div>
  );
};

export default Home;