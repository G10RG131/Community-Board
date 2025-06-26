import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard/EventCard';
import './EventsPage.css';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/events');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }
      
      const backendEvents = await response.json();
      
      // Transform backend events to match frontend expectations
      const transformedEvents = backendEvents.map(event => ({
        ...event,
        // Add default image if not provided
        image: event.image || "https://images.unsplash.com/photo-1600566752225-555bdd87c640?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        // Add default volunteer positions if not provided
        volunteerPositions: event.volunteerPositions || ["General Volunteer", "Event Assistant"]
      }));
      
      setEvents(transformedEvents);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12 text-center mb-4">
          <h1 className="display-4 fw-bold text-dark">Upcoming Events</h1>
        </div>
      </div>
      
      {loading && (
        <div className="row">
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading events...</span>
            </div>
            <p className="mt-2 text-muted">Loading events...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger d-flex align-items-center justify-content-between" role="alert">
              <div>
                <i className="fas fa-exclamation-triangle me-2"></i>
                Error: {error}
              </div>
              <button className="btn btn-outline-danger btn-sm" onClick={fetchEvents}>
                <i className="fas fa-redo me-1"></i>
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
      
      {!loading && !error && events.length === 0 && (
        <div className="row">
          <div className="col-12 text-center">
            <div className="alert alert-info" role="alert">
              <i className="fas fa-info-circle me-2"></i>
              No events found. Check back later!
            </div>
          </div>
        </div>
      )}
      
      {!loading && !error && events.length > 0 && (
        <div className="row g-4">
          {events.map(event => (
            <div key={event.id} className="col-lg-4 col-md-6 col-sm-12">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}