import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Pricing from './pages/Pricing';
import Blog from './pages/Blog';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SavedJobs from './pages/SavedJobs';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Apply from './pages/Apply';
import Progress from './pages/Progress';
import ResumeBuilder from './pages/ResumeBuilder';
import './styles/index.css';
import './styles/mobile.css';
import { AuthProvider } from './lib/store';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blog" element={<Blog />} />

          {/* Job-related routes */}
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/apply/:id" element={<Apply />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />

          {/* User-specific routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
