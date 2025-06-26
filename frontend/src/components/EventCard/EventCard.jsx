import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventCard.css';

export default function EventCard({ event, showVolunteerActions = true }) {
  const navigate = useNavigate();
  const [registering, setRegistering] = useState(false);
  const [registeredPositions, setRegisteredPositions] = useState([]);

  const handleVolunteerClick = () => {
    navigate(`/event/${event.id}`);
  };

  const handleRegisterForPosition = async (position) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      alert('Please log in to register as a volunteer');
      return;
    }

    setRegistering(true);
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
          eventId: event.id,
          position: position
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to register');
      }

      setRegisteredPositions([...registeredPositions, position]);
      alert(`Successfully registered for "${position}"!`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setRegistering(false);
    }
  };

  // Format date to be more readable
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
      return dateString; // Fallback to original string
    }
  };

  return (
    <div className="card h-100 shadow-sm event-card-bootstrap">
      {/* Image - Using Bootstrap card-img-top */}
      <div className="event-image-container position-relative overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="card-img-top event-image"
          style={{ height: '200px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1600566752225-555bdd87c640?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
          }}
        />
      </div>

      {/* Content - Using Bootstrap card-body */}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold text-dark mb-3">{event.title}</h5>
        
        <div className="event-details mb-3">
          <div className="d-flex align-items-center mb-2">
            <i className="fas fa-calendar-alt text-primary me-2" style={{ width: '16px' }}></i>
            <span className="text-muted fw-semibold">{formatDate(event.date)}</span>
          </div>
          
          <div className="d-flex align-items-center">
            <i className="fas fa-map-marker-alt text-primary me-2" style={{ width: '16px' }}></i>
            <span className="text-muted">{event.location}</span>
          </div>
        </div>

        {event.description && (
          <p className="card-text text-muted mb-3 event-description-truncate">{event.description}</p>
        )}

        {event.volunteerPositions?.length > 0 && showVolunteerActions && (
          <div className="volunteer-section mt-auto pt-3 border-top">
            <h6 className="fw-semibold text-dark mb-2">Volunteer Opportunities:</h6>
            <div className="volunteer-positions mb-3">
              {event.volunteerPositions.map((position, index) => (
                <div key={index} className="position-item d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-gradient position-tag-custom flex-grow-1 me-2">
                    {position}
                  </span>
                  {!registeredPositions.includes(position) ? (
                    <button 
                      className="btn btn-outline-success btn-sm"
                      onClick={() => handleRegisterForPosition(position)}
                      disabled={registering}
                    >
                      {registering ? 'Registering...' : 'Register'}
                    </button>
                  ) : (
                    <span className="text-success fw-semibold">✓ Registered</span>
                  )}
                </div>
              ))}
            </div>
            <button className="btn btn-primary w-100 volunteer-btn-custom" onClick={handleVolunteerClick}>
              <i className="fas fa-info-circle me-2"></i>
              View Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}