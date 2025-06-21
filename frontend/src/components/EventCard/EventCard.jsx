import React from 'react';
import './EventCard.css';

const EventCard = ({ event }) => {
  return (
    <div className="event-card">
      <div className="event-image-container">
        <img 
          src={event.image} 
          alt={event.title}
          className="event-image"
        />
      </div>
      <div className="event-details">
        <h3>{event.title}</h3>
        <div className="event-meta">
          <span>{event.date}</span> • <span>{event.location}</span>
        </div>
        <p className="event-description">{event.description}</p>
      </div>
    </div>
  );
};

export default EventCard;