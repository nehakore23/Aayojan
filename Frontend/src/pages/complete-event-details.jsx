import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';


const CompleteEventDetails = ({ initialEventData, allStudentIds }) => {
  // State for form fields
  const { eventId } = useParams(); // 👈 this gets eventId from URL

  const [eventName, setEventName] = useState(initialEventData?.title || '');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(initialEventData?.thumbnail || '');
  const [venue, setVenue] = useState(initialEventData?.location || '');
  const [eventDate, setEventDate] = useState(initialEventData?.date || '');
  const [eventTime, setEventTime] = useState(initialEventData?.time || '');
  const [description, setDescription] = useState(initialEventData?.description || '');
  const [coordinatorCount, setCoordinatorCount] = useState(initialEventData?.stdCoordinatorsCount || 2);
  // Using an array to manage multiple student coordinators
  const [studentCoordinators, setStudentCoordinators] = useState(initialEventData?.studentCoordinators || ['', '', '', '']); // Max 4, initialize with empty strings
  const token = localStorage.getItem('token');

  // Fetch event details if eventId is provided and initialEventData is not
  useEffect(() => {
    if (eventId && !initialEventData) {
      axios.get(`http://localhost:8081/api/faculty/completeEventDetails/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // replace with your actual token
        },
      })
        .then(response => {
          const data = response.data;
          setEventName(data.title || '');
          setThumbnailPreviewUrl(data.thumbnail || '');
          setVenue(data.location || '');
          setEventDate(data.date || '');
          setEventTime(data.time || '');
          setDescription(data.description || '');
          setCoordinatorCount(data.stdCoordinatorsCount || 2);
          setStudentCoordinators(data.studentCoordinators || ['', '', '', '']);
        })
        .catch(error => console.error('Failed to fetch event details:', error));
    }
  }, [eventId, initialEventData]);

  // Effect to handle thumbnail preview
  useEffect(() => {
    if (thumbnailFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreviewUrl(reader.result);
      };
      reader.readAsDataURL(thumbnailFile);
    } else if (!initialEventData?.thumbnail) {
      setThumbnailPreviewUrl('');
    }
  }, [thumbnailFile, initialEventData]);

  // Handle coordinator count change
  const handleCoordinatorCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setCoordinatorCount(count);

    setStudentCoordinators(prevCoordinators => {
      const newCoordinators = [...prevCoordinators];
      for (let i = count; i < newCoordinators.length; i++) {
        newCoordinators[i] = '';
      }
      return newCoordinators;
    });
  };


  const handleStudentCoordinatorChange = (index, e) => {
    const newCoordinators = [...studentCoordinators];
    newCoordinators[index] = e.target.value;
    setStudentCoordinators(newCoordinators);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('eventId', eventId || ''); 
    formData.append('title', eventName);
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }
    formData.append('location', venue);
    formData.append('date', eventDate);
    formData.append('time', eventTime);
    formData.append('description', description);
    formData.append('stdCoordinatorsCount', coordinatorCount);
    studentCoordinators.slice(0, coordinatorCount).forEach((coordinatorId, index) => {
      formData.append(`studentCoordinators[${index}]`, coordinatorId);
    });

    try {
      const response = await axios.post(
        `http://localhost:8081/api/faculty/completeEventDetails/save/${eventId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
           
            'Content-Type': 'application/json',

          },
        }
      );

      console.log('✅ Event saved:', response.data);
      alert('Event saved successfully!');
    } catch (error) {
      console.error('❌ Failed to save event:', error);
      alert('Error saving event.');
    }


    console.log('Form Data to be submitted:', Object.fromEntries(formData.entries()));
    console.log('Student Coordinators Array:', studentCoordinators.slice(0, coordinatorCount));
    alert('Form submitted! Check console for data.');
  };


  const defaultAllStudentIds = ['studentA', 'studentB', 'studentC', 'studentD', 'studentE', 'studentF'];

  return (
    <>
      <h1>EVENT DETAILS</h1>

      <div className="container">

        <form onSubmit={handleSubmit} id="eventForm" encType="multipart/form-data">
          <input type="hidden" value={eventId || ''} />

          <div className="form-container">
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="eventName">Event Name</label>
                <input
                  type="text"
                  id="eventName"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="thumbnailPhoto">Event Thumbnail</label>
                <div className="file-input-container">
                  <label htmlFor="thumbnailPhoto" className="file-input-label">Choose an image</label>
                  <input
                    type="file"
                    id="thumbnailPhoto"
                    accept="image/*"
                    className="file-input"
                    onChange={(e) => setThumbnailFile(e.target.files[0])}
                  />
                </div>
                {thumbnailPreviewUrl && (
                  <img
                    id="thumbnailPreview"
                    className="thumbnail-preview"
                    src={thumbnailPreviewUrl}
                    alt="Thumbnail preview"
                    style={{ display: thumbnailPreviewUrl ? 'block' : 'none' }}
                  />
                )}
              </div>

              <div className="form-group">
                <label htmlFor="venue">Venue</label>
                <input
                  type="text"
                  id="venue"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="eventDate">Event Date</label>
                <input
                  type="date"
                  id="eventDate"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="eventTime">Time</label>
                <input
                  type="time"
                  id="eventTime"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Event Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label htmlFor="coordinatorCount">Student Coordinators</label>
                <select
                  id="coordinatorCount"
                  value={coordinatorCount}
                  onChange={handleCoordinatorCountChange}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>

              <div className="form-group">
                <h3>Select Student</h3>
                <div className="coordinator-section" id="coordinatorSection">
                  {[...Array(coordinatorCount)].map((_, index) => (
                    <div className="coordinator-item" key={index}>
                      <label>Student {index + 1}</label>
                      <select
                        value={studentCoordinators[index] || ''}
                        onChange={(e) => handleStudentCoordinatorChange(index, e)}
                      >
                        <option value="">Name</option>
                        {(allStudentIds || defaultAllStudentIds).map((studentId) => (
                          <option key={studentId} value={studentId}>
                            {studentId}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="generate-button">Generate</button>
        </form>
      </div>

      <style>{`
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color:rgb(40, 2, 86);
        }
        
        .container {
          max-width: 100%;
          margin: 50px auto;
          background-color: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .form-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        .form-section {
          flex: 1;
          min-width: 300px;
        }
        h1 {
          text-align: center;
          margin-bottom: 30px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        input, select, textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          box-sizing: border-box;
        }
        textarea {
          height: 100px;
          resize: vertical;
        }
        .coordinator-section {
          background-color: #eee;
          padding: 20px;
          border-radius: 10px;
        }
        .coordinator-item {
          margin-bottom: 15px;
        }
        .generate-button {
          background: linear-gradient(90deg, #ff8086 60%, #FF5A5F 100%);
          color: white;
          border: none;
          padding: 15px 0;
          width: 100%;
          max-width: 500px;
          margin: 20px auto;
          display: block;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
        }
        .hidden {
          display: none;
        }
        .thumbnail-preview {
          margin-top: 10px;
          max-width: 200px;
          max-height: 150px;
          border: 1px solid #ddd;
          border-radius: 5px;
          /* Managed by React state: display: none; */
        }
        .file-input-container {
          position: relative;
        }
        .file-input-label {
          background-color: #f5f5f5;
          color: #333;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          display: inline-block;
          cursor: pointer;
          width: 100%;
          box-sizing: border-box;
          text-align: center;
        }
        .file-input {
          opacity: 0;
          position: absolute;
          z-index: -1;
        }
      `}</style>
    </>
  );
};

export default CompleteEventDetails;