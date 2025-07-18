
import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const GenerateEvent = () => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [noOfFaculty, setNoOfFaculty] = useState(1);
  const [assignedFacultyIds, setAssignedFacultyIds] = useState(['']);
  const [allFaculty, setAllFaculty] = useState([]);
  const [error, setError] = useState('');

  // Fetch all faculty on mount
  useEffect(() => {
    axios.get('http://localhost:8081/api/eventAuthority/faculty', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => setAllFaculty(res.data))
      .catch(err => setError('Failed to fetch faculty list'));
  }, []);

  useEffect(() => {
    setAssignedFacultyIds(prev => {
      const updated = [...prev];
      if (updated.length < noOfFaculty) {
        while (updated.length < noOfFaculty) updated.push('');
      } else if (updated.length > noOfFaculty) {
        updated.length = noOfFaculty;
      }
      return updated;
    });
  }, [noOfFaculty]);

  const handleFacultyChange = (index, value) => {
    setAssignedFacultyIds(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const getDisabledOptions = (currentIndex) => {
    
    return assignedFacultyIds.filter((id, idx) => id && idx !== currentIndex);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const eventData = {
      eventName,
      eventDate,
      noOfFaculty,
      assignedFacultyIds: assignedFacultyIds
        .filter(id => id !== '')
        .map(id => Number(id))
    };

    try {
      await axios.post(
        'http://localhost:8081/api/eventAuthority/event',
        eventData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      alert('Event generated successfully!');
      setEventName('');
      setEventDate('');
      setNoOfFaculty(1);
      setAssignedFacultyIds(['']);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to generate event'
      );
    }
  };

  return (
    <div className="generate-event-bg" style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f8eaea 0%, #f6f6ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
      <div className="generate-event-card" style={{ background: '#fff', borderRadius: 18, boxShadow: '0 6px 32px rgba(127,77,255,0.10), 0 1.5px 6px rgba(0,0,0,0.04)', padding: '2.5rem 2.2rem 2rem 2.2rem', maxWidth: 420, width: '100%' }}>
        <h2 style={{ color: '#7f4dff', fontWeight: 700, fontSize: '2rem', letterSpacing: 1, marginBottom: 8, textAlign: 'center', fontFamily: 'Playfair Display, serif' }}>Generate Event</h2>
        {error && <div className="alert alert-danger" style={{ fontSize: '1rem', marginBottom: 16 }}>{error}</div>}
        <Form onSubmit={handleSubmit} autoComplete="off">
          <Form.Group className="mb-3" controlId="eventName">
            <Form.Label style={{ color: '#7f4dff', fontWeight: 500 }}>Event Name</Form.Label>
            <Form.Control
              type="text"
              value={eventName}
              onChange={e => setEventName(e.target.value)}
              required
              placeholder="Enter event name"
              style={{ background: '#f8f8f8', border: '1.5px solid #ece6ff', borderRadius: 8, padding: '0.85rem 1rem', fontSize: '1rem', color: '#333' }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="eventDate">
            <Form.Label style={{ color: '#7f4dff', fontWeight: 500 }}>Event Date</Form.Label>
            <Form.Control
              type="date"
              value={eventDate}
              onChange={e => setEventDate(e.target.value)}
              required
              style={{ background: '#f8f8f8', border: '1.5px solid #ece6ff', borderRadius: 8, padding: '0.85rem 1rem', fontSize: '1rem', color: '#333' }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="noOfFaculty">
            <Form.Label style={{ color: '#7f4dff', fontWeight: 500 }}>Number of Faculty Coordinators</Form.Label>
            <Form.Select
              value={noOfFaculty}
              onChange={e => setNoOfFaculty(Number(e.target.value))}
              style={{ background: '#f8f8f8', border: '1.5px solid #ece6ff', borderRadius: 8, padding: '0.85rem 1rem', fontSize: '1rem', color: '#333' }}
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </Form.Select>
          </Form.Group>

          {[...Array(noOfFaculty)].map((_, i) => (
            <Form.Group className="mb-3" controlId={`faculty${i}`} key={i}>
              <Form.Label style={{ color: '#7f4dff', fontWeight: 500 }}>Faculty {i + 1}</Form.Label>
              <Form.Select
                value={assignedFacultyIds[i] || ''}
                onChange={e => handleFacultyChange(i, e.target.value)}
                required
                style={{ background: '#f8f8f8', border: '1.5px solid #ece6ff', borderRadius: 8, padding: '0.85rem 1rem', fontSize: '1rem', color: '#333' }}
              >
                <option value="">Select Faculty</option>
                {allFaculty.map(faculty => {
                  const value = faculty.id;
                  const label = faculty.user
                    ? `${faculty.user.firstName} ${faculty.user.lastName}`
                    : faculty.facultyCode || "Unknown";
                  const disabled = getDisabledOptions(i).includes(String(value));
                  return (
                    <option key={value} value={value} disabled={disabled}>
                      {label}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
          ))}

          <Button type="submit" variant="primary" style={{ width: '100%', background: 'linear-gradient(90deg, #ff5a5f 60%, #ff8086 100%)', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '1.1rem', padding: '0.85rem 0', marginTop: 8, boxShadow: '0 1px 4px rgba(255,90,95,0.08)' }}>Generate</Button>
        </Form>
      </div>
    </div>
  );
};

export default GenerateEvent;