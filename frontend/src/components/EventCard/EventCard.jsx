import React from 'react';
import './EventCard.css';

const EventCard = ({ event }) => {
  return (
    <div className="event-card">
      <div 
        className="event-image" 
        style={{ backgroundImage: `url(${event.image})` }}
      />
      <div className="event-details">
        <h3>{event.title}</h3>
        <p className="event-meta">
          <span className="event-date">{event.date}</span>
          <span className="event-location">{event.location}</span>
        </p>
        <p className="event-description">{event.description}</p>
      </div>
    </div>
  );
};

export default EventCard;