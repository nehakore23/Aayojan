import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './editEventPage.css';

const EditEventPage = ({ generateEventDto, errorMessage }) => {
  // Form field states with initial data from generateEventDto if available
  const [eventName, setEventName] = useState(generateEventDto?.eventName || '');
  const [eventDate, setEventDate] = useState(generateEventDto?.eventDate || '');
  const [noOfFaculty, setNoOfFaculty] = useState(generateEventDto?.noOfFaculty || 1);
  const [assignedFacultyIds, setAssignedFacultyIds] = useState(
    generateEventDto?.assignedFacultyIds || ['', '', '', '', '']
  );

  // Faculties fetched from backend
  const [faculties, setFaculties] = useState([]);
  const [fetchError, setFetchError] = useState('');

  // Fetch faculty list from backend on mount
  useEffect(() => {
    axios.get('http://localhost:8081/api/eventAuthority/faculty', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => setFaculties(res.data))
    .catch(err => {
      console.error('Failed to fetch faculties:', err);
      setFetchError('Failed to load faculty list.');
    });
  }, []);

  // Update assignedFacultyIds length when noOfFaculty changes
  useEffect(() => {
    setAssignedFacultyIds(prev => {
      const newIds = prev.slice(0, noOfFaculty);
      while (newIds.length < noOfFaculty) newIds.push('');
      return newIds;
    });
  }, [noOfFaculty]);

  useEffect(() => {
    console.log('generateEventDto on mount:', generateEventDto);
  }, [generateEventDto]);

  // Prevent selecting the same faculty twice except current index
  const getDisabledOptions = (currentIndex) => {
    return assignedFacultyIds.filter((id, idx) => id && idx !== currentIndex);
  };

  // Handlers
  const handleFacultyChange = (index, value) => {
    setAssignedFacultyIds(prev => {
      const newIds = [...prev];
      newIds[index] = value;
      return newIds;
    });
  };

  const handleNoOfFacultyChange = (e) => {
    const value = parseInt(e.target.value);
    setNoOfFaculty(value);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    
    for (let i = 0; i < noOfFaculty; i++) {
      if (!assignedFacultyIds[i]) {
        alert('Please select a faculty for each visible coordinator position.');
        return;
      }
    }

    const formData = {
      id: generateEventDto?.id,
      eventName,
      eventDate,
      noOfFaculty,
      assignedFacultyIds: assignedFacultyIds.slice(0, noOfFaculty).map(id => Number(id)),
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8081/api/eventAuthority/event/${formData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Event updated successfully!');
      console.log('Update response:', response.data);
      
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event. Please try again.');
    }
  };

  return (
    <div className="edit-event-page">
      <div className="event-container">
        <div className="form-card">
          <h1 className="form-title">Edit Event</h1>
          
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              <p>{errorMessage}</p>
            </div>
          )}
          
          {fetchError && (
            <div className="alert alert-warning" role="alert">
              <p>{fetchError}</p>
            </div>
          )}

          <Form onSubmit={handleSubmit} className="edit-event-form">
            <div className="form-section">
              <Form.Group className="form-group" controlId="eventName">
                <Form.Label>Event Name</Form.Label>
                <Form.Control
                  type="text"
                  value={eventName}
                  onChange={e => setEventName(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Enter event name"
                />
              </Form.Group>

              <Form.Group className="form-group" controlId="eventDate">
                <Form.Label>Event Date</Form.Label>
                <Form.Control
                  type="date"
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  required
                  className="form-input"
                />
              </Form.Group>

              <Form.Group className="form-group" controlId="noOfFaculty">
                <Form.Label>Number of Faculty Coordinators</Form.Label>
                <Form.Select
                  value={noOfFaculty}
                  onChange={handleNoOfFacultyChange}
                  className="form-select"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            <div className="faculties-section">
              <h3 className="section-title">Select Faculties</h3>
              <div className="faculties-container">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    className="faculty-row"
                    key={i}
                    style={{ display: i < noOfFaculty ? 'flex' : 'none' }}
                  >
                    <Form.Group className="faculty-select-group" controlId={`faculty-select-${i}`}>
                      <Form.Label>Faculty {i + 1}</Form.Label>
                      <Form.Select
                        value={assignedFacultyIds[i] || ''}
                        onChange={e => handleFacultyChange(i, e.target.value)}
                        required={i < noOfFaculty}
                        disabled={faculties.length === 0}
                        className="form-select"
                      >
                        <option value="">Select Faculty</option>
                        {faculties.map(faculty => {
                          const disabled = getDisabledOptions(i).includes(String(faculty.id));
                          const label = faculty.user
                            ? `${faculty.user.firstName} ${faculty.user.lastName}`
                            : faculty.facultyCode || faculty.id;
                          return (
                            <option key={faculty.id} value={faculty.id} disabled={disabled}>
                              {label}
                            </option>
                          );
                        })}
                      </Form.Select>
                    </Form.Group>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <Button 
                type="submit" 
                variant="primary" 
                disabled={faculties.length === 0}
                className="submit-button"
              >
                Update Event
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditEventPage;
