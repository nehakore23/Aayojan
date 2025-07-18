import { ReactComponent as UserIcon } from './icons/user.svg';
import { ReactComponent as SearchIcon } from './icons/search.svg';
import { ReactComponent as ChevronDownIcon } from './icons/chevron-down.svg';
import { ReactComponent as CalendarIcon } from './icons/calendar.svg';
import { ReactComponent as ClockIcon } from './icons/clock.svg';
import { ReactComponent as MapPinIcon } from './icons/map-pin.svg';
import { ReactComponent as CloseIcon } from './icons/x.svg';
import { ReactComponent as ShareIcon } from './icons/share.svg';
import { ReactComponent as MenuIcon } from './icons/menu.svg';
import axios from 'axios';
const Events = ({ userRole, studentProfileIncomplete, facultyProfileIncomplete, errorMessage, events: initialEvents, profileLink }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredEvents, setFilteredEvents] = useState([]);

    const ITEMS_PER_PAGE = 8;

    function Events(props) {
        const [events, setEvents] = useState([]);

        useEffect(() => {
            axios.get('http://localhost:8081/aayojan')
                .then(response => setEvents(response.data))
                .catch(error => console.error(error));
        }, []);


    }




    useEffect(() => {

        setFilteredEvents(initialEvents || []);
    }, [initialEvents]);


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
            setFilteredEvents(initialEvents || []);
        } else {
            const filtered = (initialEvents || []).filter(event =>
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



    // Simulate `th:action="@{/events/register}"` 
    const handleRegister = (eventId) => {

        console.log(`Registering for event ID: ${eventId}`);
        alert(`Registered for event: ${selectedEvent?.title}`);

        closeModal();
    };

    const isStudent = userRole === 'STUDENT' || userRole === 'ROLE_STUDENT';
    const isFaculty = userRole === 'FACULTY' || userRole === 'ROLE_FACULTY';
    const isEventAuthority = userRole === 'eventauthority@charusat.ac.in';

    const isProfileIncompleteAndStudent = isStudent && studentProfileIncomplete;
    const isProfileIncompleteAndFaculty = isFaculty && facultyProfileIncomplete;
    const isProfileIncompleteOverall = isProfileIncompleteAndStudent || isProfileIncompleteAndFaculty;

    return (
        <div>


            {/* Profile Completion Alert for Students */}
            {isProfileIncompleteAndStudent && (
                <div className="profile-completion-alert">
                    <strong>Action Required:</strong> Your student profile is incomplete.
                    <a href="/student/complete-profile">Please complete your profile</a> to register for events and access all features.
                </div>
            )}

            {/* Profile Completion Alert for Faculty */}
            {isProfileIncompleteAndFaculty && (
                <div className="profile-completion-alert faculty-alert">
                    <strong>Action Required:</strong> Your faculty profile is incomplete.
                    <a href="/faculty/complete-profile">Please complete your profile</a> to access all faculty features.
                </div>
            )}

            {/* Toast Error Message */}
            {errorMessage && (
                <div id="error-toast" className="toast-message">
                    <p>{errorMessage}</p>
                </div>
            )}

            {/* Events Section */}
            <section className="events-section">
                <h1 className="events-title">Upcoming Events</h1>

                {isProfileIncompleteAndStudent && (
                    <div className="events-disabled-message">
                        <p>Please complete your profile to view and register for events.</p>
                        <p><a href="/student/complete-profile" className="btn btn-primary">Complete Profile Now</a></p>
                    </div>
                )}

                {/* Search and Filter */}
                <div className="search-filter">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            disabled={isProfileIncompleteAndStudent}
                        />
                        <SearchIcon className="search-icon" width="20" height="20" />
                    </div>
                    <div className="category-filter">
                        <span>Category</span>
                        <ChevronDownIcon width="16" height="16" />
                    </div>
                </div>

                {/* Event Details Modal */}
                {isModalOpen && selectedEvent && (
                    <div id="eventModal" className={`modal ${isModalOpen ? 'show' : ''}`}>
                        <div className="modal-content">
                            <div className="modal-container">
                                <img id="modalEventImage" className="event-image" src={selectedEvent.imageUrl || 'https://via.placeholder.com/800x300/8c7cf7/ffffff?text=Event'} alt="Event" />

                                <button className="modal-close" onClick={closeModal}>
                                    <CloseIcon width="24" height="24" />
                                </button>

                                <div className="event-content">
                                    <div className="event-header">
                                        <div>
                                            <h1 id="modalEventTitle" className="event-title">{selectedEvent.title}</h1>
                                        </div>
                                        <span className="event-status">Upcoming</span>
                                    </div>

                                    <div className="event-details">
                                        <div className="detail-item">
                                            <CalendarIcon className="detail-icon" />
                                            <div className="detail-content">
                                                <div className="detail-label">Date</div>
                                                <div id="modalEventDate" className="detail-value">
                                                    {new Date(selectedEvent.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="detail-item">
                                            <ClockIcon className="detail-icon" />
                                            <div className="detail-content">
                                                <div className="detail-label">Time</div>
                                                <div id="modalEventTime" className="detail-value">{selectedEvent.time || 'Time TBD'}</div>
                                            </div>
                                        </div>

                                        <div className="detail-item">
                                            <MapPinIcon className="detail-icon" />
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
                                                            <UserIcon width="16" height="16" />
                                                        </div>
                                                        <span>{coordinator}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div>No coordinators listed.</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="tags">

                                        <span className="tag">Technology</span>
                                        <span className="tag">Conference</span>
                                        <span className="tag">Workshop</span>
                                    </div>

                                    <div className="action-buttons">
                                        <button
                                            type="submit"
                                            className="register-button"
                                            onClick={() => handleRegister(selectedEvent.eventId)}
                                            disabled={isProfileIncompleteAndStudent}
                                        >
                                            Register Now
                                        </button>
                                        {isProfileIncompleteAndStudent && (
                                            <div className="profile-incomplete-message-modal">
                                                <small>You must complete your profile to register.</small>
                                            </div>
                                        )}
                                        <button className="share-button" onClick={handleShare}>
                                            <ShareIcon width="20" height="20" />
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
                                    src={event.imageUrl || "https://via.placeholder.com/300x180/8c7cf7/ffffff?text=Event"}
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
                                                <MapPinIcon width="14" height="14" />
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
                            // Fallback for no events if no search term
                            <div className="event-card">
                                <img src="https://via.placeholder.com/300x180/8c7cf7/ffffff?text=No+Events" className="event-image" alt="No Events" />
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
                            // Message for no search results
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

export default Events;