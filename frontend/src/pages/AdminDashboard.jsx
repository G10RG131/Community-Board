import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  // In a real app, you would fetch these from your backend
  const stats = {
    pendingEvents: 5,
    approvedEvents: 12,
    totalUsers: 43
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      
      <div className="stats-container">
        <div className="stat-card">
          <h3>Pending Events</h3>
          <p>{stats.pendingEvents}</p>
          <Link to="/pending-events">Review</Link>
        </div>
        
        <div className="stat-card">
          <h3>Approved Events</h3>
          <p>{stats.approvedEvents}</p>
          <Link to="/">View All</Link>
        </div>
        
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;