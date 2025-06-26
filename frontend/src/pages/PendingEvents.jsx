
import React, { useState } from 'react';
import './PendingEvents.css';

const PendingEvents = () => {
  // In a real app, you would fetch these from your backend
  const [events, setEvents] = useState([
    {
      id: 1,
      name: 'Tech Conference',
      image: 'https://example.com/tech.jpg',
      time: '2023-11-15T09:00',
      place: 'San Francisco',
      description: 'Annual tech conference',
      user: 'john@example.com'
    },
    {
      id: 2,
      name: 'Music Festival',
      image: 'https://example.com/music.jpg',
      time: '2023-12-10T14:00',
      place: 'New York',
      description: 'Three days of live music',
      user: 'sarah@example.com'
    }
  ]);

  const handleApprove = (id) => {
    // In a real app, you would send this to your backend
    setEvents(events.filter(event => event.id !== id));
    alert('Event approved and published!');
  };

  const handleReject = (id) => {
    // In a real app, you would send this to your backend
    setEvents(events.filter(event => event.id !== id));
    alert('Event rejected');
  };

  return (
    <div className="pending-events">
      <h2>Pending Event Approvals</h2>
      
      {events.length === 0 ? (
        <p>No pending events to review</p>
      ) : (
        <div className="events-list">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-image" style={{ backgroundImage: `url(${event.image})` }} />
              <div className="event-details">
                <h3>{event.name}</h3>
                <p><strong>Date:</strong> {new Date(event.time).toLocaleString()}</p>
                <p><strong>Location:</strong> {event.place}</p>
                <p><strong>Submitted by:</strong> {event.user}</p>
                <p><strong>Description:</strong> {event.description}</p>
                
                <div className="action-buttons">
                  <button 
                    onClick={() => handleApprove(event.id)} 
                    className="approve-btn"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleReject(event.id)} 
                    className="reject-btn"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingEvents;
