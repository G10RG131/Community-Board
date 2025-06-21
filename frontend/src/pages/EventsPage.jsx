import React, { useState } from 'react';
import EventCard from '../components/EventCard/EventCard';
import './EventsPage.css';

const EventsPage = () => {
  const [events] = useState([
    {
      id: 1,
      title: 'Tech Conference',
      date: '2023-11-15',
      location: 'San Francisco',
      description: 'Annual tech conference',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'
    },
    // Add more events...
  ]);

  return (
    <div className="events-page">
      <header className="events-header">
        <h1>Event Catalog</h1>
        <a href="/login" className="login-link">Admin Login</a>
      </header>
      
      <div className="events-grid">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventsPage;