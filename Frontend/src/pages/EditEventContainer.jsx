import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EditEventPage from './editEventPage';  

const EditEventContainer = () => {
  const { eventId } = useParams();  
  const [generateEventDto, setGenerateEventDto] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8081/api/eventAuthority/event/${eventId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      setGenerateEventDto(response.data);
      setErrorMessage('');
    })
    .catch(err => {
      setErrorMessage('Failed to fetch event data for editing.');
      setGenerateEventDto(null);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [eventId]);

  if (loading) {
    return <div>Loading event data...</div>;
  }

  if (errorMessage) {
    return <div className="alert alert-danger">{errorMessage}</div>;
  }

  
  return <EditEventPage generateEventDto={generateEventDto} />;
};

export default EditEventContainer;
