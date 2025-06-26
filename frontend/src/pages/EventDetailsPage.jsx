import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EventDetailsPage.css';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchEventDetails();
    fetchVolunteers();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`http://localhost:4000/events/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event details');
      }
      const eventData = await response.json();
      setEvent(eventData);
    } catch (err) {
      setError('Failed to load event details');
      console.error('Error:', err);
    }
  };

  const fetchVolunteers = async () => {
    try {
      const response = await fetch(`http://localhost:4000/volunteers/event/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch volunteers');
      }
      const volunteersData = await response.json();
      setVolunteers(volunteersData);
    } catch (err) {
      console.error('Error fetching volunteers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterForPosition = async (position) => {
    if (!user?.id) {
      alert('Please log in to register as a volunteer');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/volunteers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id?.toString() || '',
          'x-user-name': user.name || '',
          'x-user-email': user.email || ''
        },
        body: JSON.stringify({
          eventId: eventId,
          position: position
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to register');
      }

      alert(`Successfully registered for "${position}"!`);
      fetchVolunteers(); // Refresh volunteers list
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleUnregister = async (position) => {
    if (!user?.id) return;

    try {
      const response = await fetch('http://localhost:4000/volunteers/unregister', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id?.toString() || '',
          'x-user-name': user.name || '',
          'x-user-email': user.email || ''
        },
        body: JSON.stringify({
          eventId: eventId,
          position: position
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to unregister');
      }

      alert(`Successfully unregistered from "${position}"`);
      fetchVolunteers(); // Refresh volunteers list
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const isUserRegisteredForPosition = (position) => {
    return volunteers.some(v => v.userId === user?.id && v.position === position);
  };

  const getVolunteersForPosition = (position) => {
    return volunteers.filter(v => v.position === position);
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">Loading event details...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error || 'Event not found'}</div>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="event-details-page">
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            {/* Event Header */}
            <div className="card shadow-lg mb-4">
              <div className="card-header bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="mb-0">{event.title}</h2>
                  <button 
                    className="btn btn-light btn-sm"
                    onClick={() => navigate('/')}
                  >
                    ← Back to Events
                  </button>
                </div>
              </div>
              
              {event.image && (
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="card-img-top"
                  style={{ height: '300px', objectFit: 'cover' }}
                />
              )}
              
              <div className="card-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <i className="fas fa-calendar-alt text-primary me-3"></i>
                      <div>
                        <strong>Date & Time</strong>
                        <div className="text-muted">{formatDate(event.date)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <i className="fas fa-map-marker-alt text-primary me-3"></i>
                      <div>
                        <strong>Location</strong>
                        <div className="text-muted">{event.location}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {event.description && (
                  <div className="mb-4">
                    <h5>Description</h5>
                    <p className="text-muted">{event.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Volunteer Positions */}
            {event.volunteerPositions?.length > 0 && (
              <div className="card shadow mb-4">
                <div className="card-header">
                  <h4 className="mb-0">Volunteer Opportunities</h4>
                </div>
                <div className="card-body">
                  {event.volunteerPositions.map((position, index) => {
                    const positionVolunteers = getVolunteersForPosition(position);
                    const isRegistered = isUserRegisteredForPosition(position);
                    
                    return (
                      <div key={index} className="volunteer-position-detail mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="text-primary mb-0">{position}</h5>
                          {user && user.id !== event.userId && (
                            <div>
                              {!isRegistered ? (
                                <button 
                                  className="btn btn-success btn-sm"
                                  onClick={() => handleRegisterForPosition(position)}
                                >
                                  Register for this Position
                                </button>
                              ) : (
                                <button 
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleUnregister(position)}
                                >
                                  Unregister
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="volunteers-for-position">
                          <h6 className="text-muted mb-2">
                            Registered Volunteers ({positionVolunteers.length})
                          </h6>
                          {positionVolunteers.length > 0 ? (
                            <div className="list-group">
                              {positionVolunteers.map((volunteer) => (
                                <div key={volunteer.id} className="list-group-item">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <strong>{volunteer.userName}</strong>
                                      {volunteer.userId === user?.id && (
                                        <span className="badge bg-primary ms-2">You</span>
                                      )}
                                    </div>
                                    <small className="text-muted">
                                      Registered: {new Date(volunteer.registeredAt).toLocaleDateString()}
                                    </small>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted">No volunteers registered yet.</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;