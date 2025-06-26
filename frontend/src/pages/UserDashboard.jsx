import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Combine date and time into ISO string
      const dateTimeString = `${event.date}T${event.time}:00.000Z`;
      
      const eventData = {
        title: event.title,
        date: dateTimeString,
        location: event.location,
        description: event.description,
        image: event.image,
        volunteerPositions: event.volunteerPositions
      };

      const response = await fetch('http://localhost:4000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Event "${event.title}" created successfully!`);
        // Reset form
        setEvent({
          title: '',
          image: '',
          date: '',
          time: '',
          location: '',
          description: '',
          volunteerPositions: []
        });
        // Navigate back to events page
        navigate('/');
      } else {
        setError(data.error || 'Failed to create event');
      }
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return event.title && event.date && event.time && event.location && event.description;
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title mb-0">
                <i className="fas fa-calendar-plus me-2"></i>
                Create New Event
              </h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="title" className="form-label fw-bold">Event Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={event.title}
                    onChange={(e) => setEvent({...event, title: e.target.value})}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="image" className="form-label fw-bold">Image URL (optional)</label>
                  <input
                    type="url"
                    className="form-control"
                    id="image"
                    value={event.image}
                    onChange={(e) => setEvent({...event, image: e.target.value})}
                    placeholder="Enter image URL or leave empty for default"
                  />
                  <div className="form-text">If no image is provided, a default image will be used.</div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="date" className="form-label fw-bold">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="date"
                      value={event.date}
                      onChange={(e) => setEvent({...event, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="time" className="form-label fw-bold">Start Time</label>
                    <input
                      type="time"
                      className="form-control"
                      id="time"
                      value={event.time}
                      onChange={(e) => setEvent({...event, time: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="location" className="form-label fw-bold">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    value={event.location}
                    onChange={(e) => setEvent({...event, location: e.target.value})}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label fw-bold">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows="4"
                    value={event.description}
                    onChange={(e) => setEvent({...event, description: e.target.value})}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Volunteer Positions (optional)</label>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      value={newPosition}
                      onChange={(e) => setNewPosition(e.target.value)}
                      placeholder="Add volunteer role (e.g., 'Registration')"
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline-primary"
                      onClick={addPosition}
                      disabled={!newPosition.trim()}
                    >
                      <i className="fas fa-plus me-1"></i> Add Position
                    </button>
                  </div>
                  
                  {event.volunteerPositions.length > 0 && (
                    <div className="d-flex flex-wrap gap-2">
                      {event.volunteerPositions.map((pos, index) => (
                        <span key={index} className="badge bg-primary position-relative position-tag-custom">
                          {pos}
                          <button 
                            type="button" 
                            className="btn-close btn-close-white position-absolute top-0 start-100 translate-middle"
                            style={{ fontSize: '0.6rem' }}
                            onClick={() => removePosition(index)}
                            aria-label={`Remove ${pos} position`}
                          ></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={!isFormValid() || loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Event...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-calendar-plus me-2"></i>
                        Create Event
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}