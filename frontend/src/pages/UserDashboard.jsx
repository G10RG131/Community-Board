import React, { useState } from 'react';
import './UserDashboard.css';

export default function UserDashboard() {
  const [event, setEvent] = useState({
    title: '',
    image: '',
    date: '',
    time: '', // New time field
    location: '',
    description: '',
    volunteerPositions: []
  });
  const [newPosition, setNewPosition] = useState('');

  const addPosition = () => {
    if (newPosition.trim() && !event.volunteerPositions.includes(newPosition.trim())) {
      setEvent({
        ...event,
        volunteerPositions: [...event.volunteerPositions, newPosition.trim()]
      });
      setNewPosition('');
    }
  };

  const removePosition = (index) => {
    const updated = [...event.volunteerPositions];
    updated.splice(index, 1);
    setEvent({...event, volunteerPositions: updated});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Event submitted:', event);
    alert(`Event "${event.title}" created successfully for ${event.date} at ${event.time}!`);
  };

  const isFormValid = () => {
    return event.title && event.image && event.date && event.time && event.location && event.description;
  };

  return (
    <div className="user-dashboard">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Title</label>
          <input
            type="text"
            value={event.title}
            onChange={(e) => setEvent({...event, title: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="url"
            value={event.image}
            onChange={(e) => setEvent({...event, image: e.target.value})}
            required
          />
        </div>

        <div className="datetime-group">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={event.date}
              onChange={(e) => setEvent({...event, date: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              value={event.time}
              onChange={(e) => setEvent({...event, time: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={event.location}
            onChange={(e) => setEvent({...event, location: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={event.description}
            onChange={(e) => setEvent({...event, description: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Volunteer Positions (optional)</label>
          <div className="position-input-group">
            <input
              type="text"
              value={newPosition}
              onChange={(e) => setNewPosition(e.target.value)}
              placeholder="Add volunteer role (e.g., 'Registration')"
            />
            <button 
              type="button" 
              onClick={addPosition}
              className="add-position-btn"
              disabled={!newPosition.trim()}
            >
              <i className="fas fa-plus"></i> Add Position
            </button>
          </div>
          <div className="positions-list">
            {event.volunteerPositions.map((pos, index) => (
              <div key={index} className="position-tag">
                {pos}
                <button 
                  type="button" 
                  onClick={() => removePosition(index)}
                  className="remove-position"
                  aria-label={`Remove ${pos} position`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={!isFormValid()}
        >
          <i className="fas fa-calendar-plus"></i> Create Event
        </button>
      </form>
    </div>
  );
}