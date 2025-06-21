import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  const [event, setEvent] = useState({
    name: '',
    image: '',
    time: '',
    place: '',
    description: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log('Event submitted for approval:', event);
    alert('Event submitted for admin approval');
    navigate('/');
  };

  return (
    <div className="user-dashboard">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Name</label>
          <input
            type="text"
            value={event.name}
            onChange={(e) => setEvent({...event, name: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Image URL</label>
          <input
            type="url"
            value={event.image}
            onChange={(e) => setEvent({...event, image: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Date & Time</label>
          <input
            type="datetime-local"
            value={event.time}
            onChange={(e) => setEvent({...event, time: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={event.place}
            onChange={(e) => setEvent({...event, place: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={event.description}
            onChange={(e) => setEvent({...event, description: e.target.value})}
            required
          />
        </div>
        
        <button type="submit" className="submit-btn">Submit for Approval</button>
      </form>
    </div>
  );
};

export default UserDashboard;