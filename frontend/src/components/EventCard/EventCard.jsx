import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EventCard.css';

export default function EventCard({ event }) {
  const navigate = useNavigate();

  const handleVolunteerClick = () => {
    navigate('/volunteer', { state: { event } });
  };

  return (
    <div className="event-card">
      {/* Image - Strictly on top */}
      <img 
        src={event.image} 
        alt={event.title}
        className="event-image"
      />

      {/* Content - Strictly below image */}
      <div className="event-content">
        <h3>{event.title}</h3>
        
        <div className="event-info">
          <span><i className="fas fa-calendar"></i> {event.date}</span>
          <span><i className="fas fa-map-marker-alt"></i> {event.location}</span>
        </div>

        <p className="description">{event.description}</p>

        {event.volunteerPositions?.length > 0 && (
          <button className="volunteer-btn" onClick={handleVolunteerClick}>
            Volunteer
          </button>
        )}
      </div>
    </div>
  );
}