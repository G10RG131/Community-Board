import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard/EventCard';
import './MyEventsPage.css';

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState({}); // volunteers organized by eventId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetchMyEvents();
    fetchVolunteers();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await fetch('http://localhost:4000/events/my', {
        headers: {
          'x-user-id': user.id?.toString() || '',
          'x-user-name': user.name || '',
          'x-user-email': user.email || ''
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError('Failed to load your events');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVolunteers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await fetch('http://localhost:4000/volunteers/my-events', {
        headers: {
          'x-user-id': user.id?.toString() || '',
          'x-user-name': user.name || '',
          'x-user-email': user.email || ''
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch volunteers');
      }

      const data = await response.json();
      
      // Convert array to object keyed by eventId
      const volunteersMap = {};
      data.forEach(({ eventId, volunteers }) => {
        volunteersMap[eventId] = volunteers;
      });
      
      setVolunteers(volunteersMap);
    } catch (err) {
      console.error('Error fetching volunteers:', err);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await fetch(`http://localhost:4000/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user.id?.toString() || '',
          'x-user-name': user.name || '',
          'x-user-email': user.email || ''
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      // Remove the event from the list
      setEvents(events.filter(event => event.id !== eventId));
      // Remove volunteers for this event
      const updatedVolunteers = { ...volunteers };
      delete updatedVolunteers[eventId];
      setVolunteers(updatedVolunteers);
    } catch (err) {
      alert('Failed to delete event');
      console.error('Error:', err);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
  };

  const handleUpdateEvent = async (eventId, updatedData) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await fetch(`http://localhost:4000/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id?.toString() || '',
          'x-user-name': user.name || '',
          'x-user-email': user.email || ''
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      const updatedEvent = await response.json();
      
      // Update the event in the list
      setEvents(events.map(event => 
        event.id === eventId ? updatedEvent : event
      ));
      
      setEditingEvent(null);
      
      // Refresh volunteers in case positions changed
      fetchVolunteers();
    } catch (err) {
      alert('Failed to update event');
      console.error('Error:', err);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="my-events-page">
      <div className="container">
        <h1>My Events</h1>
        
        {events.length === 0 ? (
          <div className="no-events">
            <p>You haven't created any events yet.</p>
            <a href="/user" className="btn btn-primary">Create Your First Event</a>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card-container">
                <EventCard event={event} showVolunteerActions={false} />
                
                {/* Volunteer Registrations Section */}
                {volunteers[event.id] && volunteers[event.id].length > 0 && (
                  <div className="volunteers-section">
                    <h4>Volunteer Registrations ({volunteers[event.id].length})</h4>
                    <div className="volunteers-list">
                      {volunteers[event.id].map((volunteer) => (
                        <div key={`${volunteer.id}`} className="volunteer-item">
                          <span className="volunteer-name">{volunteer.userName}</span>
                          <span className="volunteer-position">{volunteer.position}</span>
                          <span className="volunteer-date">
                            {new Date(volunteer.registeredAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Show when no volunteers have registered yet */}
                {(!volunteers[event.id] || volunteers[event.id].length === 0) && (
                  <div className="no-volunteers">
                    <p className="text-muted small">No volunteer registrations yet.</p>
                  </div>
                )}
                
                <div className="event-actions">
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleEditEvent(event)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingEvent && (
        <EditEventModal 
          event={editingEvent}
          onUpdate={handleUpdateEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}
    </div>
  );
};

// Edit Event Modal Component
const EditEventModal = ({ event, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    title: event.title || '',
    date: event.date?.slice(0, 16) || '', // Format for datetime-local input
    location: event.location || '',
    description: event.description || '',
    image: event.image || '',
    volunteerPositions: event.volunteerPositions?.join(', ') || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedData = {
      ...formData,
      volunteerPositions: formData.volunteerPositions
        .split(',')
        .map(pos => pos.trim())
        .filter(pos => pos.length > 0)
    };

    onUpdate(event.id, updatedData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date & Time</label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="volunteerPositions">Volunteer Positions (comma-separated)</label>
            <input
              type="text"
              id="volunteerPositions"
              name="volunteerPositions"
              value={formData.volunteerPositions}
              onChange={handleChange}
              placeholder="e.g., Setup Crew, Registration Helper, Cleanup Team"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyEventsPage;
