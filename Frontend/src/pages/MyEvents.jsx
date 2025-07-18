import React, { useEffect, useState } from "react";
import axios from "axios";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  const token = localStorage.getItem("token");

  axios
    .get("http://localhost:8081/api/faculty/my-events", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setEvents(response.data);
      setLoading(false);
    })
    .catch((err) => {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    });
}, []);


  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        Error loading events: {error}
      </div>
    )
  }

  return (
    <>
    <div className="event-container">
      {events.length > 0 ? (
        events.map((event, idx) => (
          <div
            className="event-card"
            key={event.eventId || idx}
            data-published={event.published}
            style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
          >
            <img
              className="event-image"
              src={event.imageUrl || "/images/default-event.jpg"}
              alt={event.title}
            />
            <div className="event-content">
              <h2 className="event-title">
                {event.title}
                {event.published === 1 ? (
                  <span className="publication-status status-published">
                    Published
                  </span>
                ) : (
                  <span className="publication-status status-unpublished">
                    Unpublished
                  </span>
                )}
              </h2>
              <p className="event-details">
                Event Date:{" "}
                {event.date
                  ? new Date(event.date).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="event-details">
                Event Desc: {event.description || "N/A"}
              </p>
              <p className="event-details">
                Event Time:{" "}
                {event.time
                  ? new Date(`1970-01-01T${event.time}`).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    )
                  : "N/A"}
              </p>
              <p className="event-details">Venue: {event.location || "N/A"}</p>
            </div>
            <div className="button-container">
              <a
                href={`/faculty/completeEventDetails/${event.eventId}`}
                className="edit-button"
              >
                Update Details
              </a>
              <a
                href={`/faculty/events/toggle-publish/${event.eventId}`}
                className={`publish-button ${
                  event.published === 1 ? "unpublish-style" : "publish-style"
                }`}
              >
                {event.published === 1 ? "Unpublish" : "Publish"}
              </a>
            </div>
          </div>
        ))
      ) : (
        <div className="no-events">
          <h3>No events available</h3>
          <p>Create new events to see them listed here</p>
        </div>
      )}
    </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Arial', sans-serif;
        }

        body {
          background-color: #FF5A5F;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        /* Page transition animation */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .event-container {
          padding: 20px;
          max-width: 95%;
          width: 95%;
          margin: 0 auto;
          animation: fadeIn 0.8s ease-out;
        }

        .event-card {
          display: flex;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 20px;
          width: 100%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          transform-origin: center;
          animation: cardAppear 0.5s ease-out forwards;
          opacity: 0;
        }

        @keyframes cardAppear {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
        }

        .event-card[data-published="0"] {
          border-left: 4px solid #FF5A5F;
        }

        .event-card[data-published="1"] {
          border-left: 4px solid #4CAF50;
        }

        .event-image {
          width: 350px;
          height: 200px;
          object-fit: cover;
          transition: all 0.4s ease;
        }

        .event-card:hover .event-image {
          transform: scale(1.05);
        }

        .event-content {
          flex: 1;
          padding: 15px 20px;
          transition: background-color 0.3s ease;
        }

        .event-title {
          font-size: 24px;
          font-weight: bold;
          margin: 0 0 10px 0;
          transition: color 0.3s ease;
        }

        .event-card:hover .event-title {
          color: #FF5A5F;
        }

        .event-details {
          margin-bottom: 5px;
          font-size: 14px;
          color: #333;
          transition: transform 0.3s ease;
        }

        .button-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-right: 20px;
          min-width: 170px;
        }

        .edit-button {
          background-color: #333333;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 8px 15px;
          margin-bottom: 10px;
          cursor: pointer;
          width: 150px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s ease;
        }

        .edit-button:hover {
          background-color: #555555;
          transform: translateX(-5px);
        }

        .publish-button {
          color: white;
          border: none;
          border-radius: 5px;
          padding: 8px 15px;
          cursor: pointer;
          width: 150px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s ease;
        }

        .publish-button:hover {
          transform: translateX(-5px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .publish-style {
          background-color: #4CAF50;
        }

        .publish-style:hover {
          background-color: #3d9a40;
        }

        .unpublish-style {
          background-color: #FF5A5F;
        }

        .unpublish-style:hover {
          background-color: #e54449;
        }

        .publication-status {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: bold;
          margin-left: 10px;
          transition: all 0.3s ease;
          position: relative;
        }

        .status-published {
          background-color: #e6f7e6;
          color: #4CAF50;
        }

        .status-published::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #4CAF50;
          top: 50%;
          right: 8px;
          transform: translateY(-50%);
          animation: pulse 2s infinite;
        }

        .status-unpublished {
          background-color: #ffebee;
          color: #FF5A5F;
        }

        @keyframes pulse {
          0% { transform: translateY(-50%) scale(1); opacity: 1; }
          50% { transform: translateY(-50%) scale(1.5); opacity: 0.6; }
          100% { transform: translateY(-50%) scale(1); opacity: 1; }
        }

        .alert {
          padding: 15px;
          margin-bottom: 20px;
          border: 1px solid transparent;
          border-radius: 8px;
          text-align: center;
          position: relative;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          margin-top: 20px;
          animation: alertSlideDown 0.5s ease-out forwards, alertFadeOut 0.5s ease-in 4.5s forwards;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        @keyframes alertSlideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes alertFadeOut {
          from { opacity: 1; }
          to { opacity: 0; height: 0; padding: 0; margin-bottom: 0; border: none; }
        }

        .alert-danger {
          color: #721c24;
          background-color: #f8d7da;
          border-color: #f5c6cb;
        }

        .alert::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          width: 100%;
          background: linear-gradient(to right, #721c24, #f8d7da);
          animation: countdown 5s linear forwards;
        }

        @keyframes countdown {
          from { width: 100%; }
          to { width: 0%; }
        }

        .no-events {
          text-align: center;
          padding: 40px;
          background-color: white;
          border-radius: 12px;
          margin: 20px auto;
          max-width: 600px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          animation: fadeIn 0.8s ease-out;
        }

        .no-events h3 {
          color: #555;
          font-size: 22px;
          margin-bottom: 10px;
        }

        .no-events p {
          color: #777;
          font-size: 16px;
        }

        .page-loader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #FF5A5F;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          transition: opacity 0.5s ease, visibility 0.5s ease;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .event-container {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        @media (max-width: 768px) {
          .event-container {
            padding-left: 15px;
            padding-right: 15px;
          }

          .event-card {
            flex-direction: column;
          }

          .event-image {
            width: 100%;
            height: 180px;
          }

          .button-container {
            flex-direction: row;
            justify-content: space-between;
            padding: 15px;
            min-width: auto;
          }

          .edit-button,
          .publish-button {
            width: 48%;
            margin-bottom: 0;
          }

          .edit-button:hover,
          .publish-button:hover {
            transform: translateY(-3px);
          }
        }

        @media (max-width: 480px) {
          .button-container {
            flex-direction: column;
            gap: 10px;
          }

          .edit-button,
          .publish-button {
            width: 100%;
          }

          .event-title {
            font-size: 20px;
          }
        }
      `}</style>
    </>
  );
};

export default MyEvents;
