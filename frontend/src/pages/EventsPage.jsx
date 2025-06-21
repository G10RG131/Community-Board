import React from 'react';
import EventCard from '../components/EventCard/EventCard';
import './EventsPage.css';

const EventsPage = () => {
  const events = [
    {
      id: 1,
      title: 'Tech Conference',
      date: '2023-11-15',
      location: 'San Francisco',
      description: 'Annual technology conference featuring the latest innovations',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'
    },
    {
      id: 2,
      title: 'Music Festival',
      date: '2023-12-10',
      location: 'New York',
      description: 'Three days of live music with top artists',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3'
    }
  ];

  return (
    <div className="events-page">
      <h1 className="events-header">Upcoming Events</h1>
      <div className="events-grid">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventsPage;