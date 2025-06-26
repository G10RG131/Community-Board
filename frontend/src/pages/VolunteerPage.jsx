import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './VolunteerPage.css';

const VolunteerPage = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [formData, setFormData] = useState({
    skills: '',
    age: '',
    gender: '',
    contactEmail: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load volunteers and check auth status
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!user);
    };

    const loadVolunteers = async () => {
      try {
        const response = await api.get('/volunteers/public');
        setVolunteers(response.data);
      } catch (err) {
        setError('Failed to load volunteers');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    loadVolunteers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/volunteers/register', {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim())
      });
      alert('Thank you for volunteering!');
      // Refresh the list after registration
      const response = await api.get('/volunteers/public');
      setVolunteers(response.data);
      setFormData({
        skills: '',
        age: '',
        gender: '',
        contactEmail: ''
      });
    } catch (err) {
      alert('Registration failed. Please try again.');
      console.error(err);
    }
  };

  if (isLoading) return <div className="loading">Loading volunteers...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="volunteer-page">
      <h1>Community Volunteers</h1>
      
      {/* Public Volunteer List */}
      <div className="volunteer-list">
        {volunteers.length > 0 ? (
          volunteers.map(volunteer => (
            <div key={volunteer.id} className="volunteer-card">
              <h3>{volunteer.skills.join(', ')}</h3>
              <p>Age: {volunteer.age}</p>
              <p>Gender: {volunteer.gender}</p>
            </div>
          ))
        ) : (
          <p>No volunteers yet. Be the first to join!</p>
        )}
      </div>

      {/* Registration Section */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="volunteer-form">
          <h2>Register as Volunteer</h2>
          
          <div className="form-group">
            <label>Your Skills (comma separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
              required
              placeholder="e.g., Cooking, Teaching, First Aid"
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              min="16"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div className="form-group">
            <label>Contact Email</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Register as Volunteer
          </button>
        </form>
      ) : (
        <div className="login-prompt">
          <p>
            Want to join our volunteers?{' '}
            <Link to="/login" className="login-link">Login to register</Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default VolunteerPage;