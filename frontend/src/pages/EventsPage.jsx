import React from 'react';
import EventCard from '../components/EventCard/EventCard';
import './EventsPage.css';

const EventsPage = () => {
  const events = [
    {
      id: 1,
      title: 'Tech Conference 2023',
      date: 'November 15-17, 2023',
      location: 'San Francisco',
      description: 'Annual technology conference featuring keynote speakers and workshops about the latest trends in software development and AI.',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'
    },
    {
      id: 2,
      title: 'Music Festival',
      date: 'December 10-12, 2023',
      location: 'New York',
      description: 'Three days of live performances from top artists around the world across multiple genres including rock, jazz, and electronic music.',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3'
    }
  ];

  return (
    <div className="events-page">
      <h1>Upcoming Events</h1>
      <div className="events-container">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventsPage;