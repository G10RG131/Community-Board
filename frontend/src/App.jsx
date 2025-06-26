import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import EventsPage from './pages/EventsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PendingEvents from './pages/PendingEvents';
import VolunteerPage from './pages/VolunteerPage';
import MyEventsPage from './pages/MyEventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import './App.css';

export default function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/my-events" element={<MyEventsPage />} />
          <Route path="/event/:eventId" element={<EventDetailsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/pending-events" element={<PendingEvents />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
        </Routes>
      </main>
    </Router>
  );
}