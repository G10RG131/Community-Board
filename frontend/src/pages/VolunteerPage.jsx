import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './VolunteerPage.css';

export default function VolunteerPage() {
  const location = useLocation();
  const event = location.state?.event;
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    selectedJob: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Volunteer submission:', { eventId: event?.id, ...formData });
    alert(`Thank you ${formData.fullName} for volunteering as ${formData.selectedJob}!`);
  };

  const isFormValid = () => {
    return formData.fullName && formData.email && formData.phone && formData.selectedJob;
  };

  return (
    <div className="volunteer-page">
      <div className="volunteer-container">
        <h2>Volunteer for: {event?.title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Select Volunteer Position</label>
            <select
              value={formData.selectedJob}
              onChange={(e) => setFormData({...formData, selectedJob: e.target.value})}
              required
            >
              <option value="">Choose a position</option>
              {event?.volunteerPositions?.map((job, index) => (
                <option key={index} value={job}>{job}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Additional Message (Optional)</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows="4"
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={!isFormValid()}
          >
            <i className="fas fa-handshake"></i> Submit Volunteer Application
          </button>
        </form>
      </div>
    </div>
  );
}