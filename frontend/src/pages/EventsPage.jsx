import React from 'react';
import EventCard from '../components/EventCard/EventCard';
import './EventsPage.css';

export default function EventsPage() {
  const events = [
    {
      id: 1,
      title: "Community Cleanup",
      date: "November 20, 2023",
      location: "City Park, Main Street",
      description: "Join us for our annual community cleanup day. We'll provide all necessary equipment and refreshments for volunteers.",
      image: "https://images.unsplash.com/photo-1600566752225-555bdd87c640?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      volunteerPositions: [
        "Trash Collector",
        "Recycling Supervisor",
        "Registration Volunteer"
      ]
    },
    {
      id: 2,
      title: "Food Drive",
      date: "December 5-7, 2023",
      location: "Community Center",
      description: "Help us collect and distribute food to families in need during the holiday season.",
      image: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      volunteerPositions: [
        "Food Sorter",
        "Donation Collector",
        "Delivery Driver"
      ]
    }
  ];

  return (
    <div className="events-page">
      <h1>Upcoming Events</h1>
      <div className="events-grid">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}