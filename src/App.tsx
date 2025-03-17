import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Pricing from './pages/Pricing';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SavedJobs from './pages/SavedJobs';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Apply from './pages/Apply';
import Progress from './pages/Progress';
import ResumeBuilder from './pages/ResumeBuilder';
import NotFound from './pages/NotFound';
import CareerGuides from './pages/CareerGuides';
import FAQ from './pages/FAQ';
import About from './pages/About';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Support from './pages/Support';
import './index.css';
import './styles/mobile.css';
import { useAuthStore } from './lib/store';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import UserPreferences from './pages/UserPreferences';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/career-guides" element={<CareerGuides />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/support" element={<Support />} />
        
        {/* Company pages */}
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

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
        <Route path="/preferences" element={<UserPreferences />} />

        {/* 404 Route - must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <SonnerToaster position="bottom-right" />
      <Toaster />
    </Router>
  );
}

export default App;
