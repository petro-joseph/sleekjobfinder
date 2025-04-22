import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './lib/store';
import { supabase } from './integrations/supabase/client';
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
import ResumeGuide from './pages/guides/ResumeGuide';
import InterviewGuide from './pages/guides/InterviewGuide';
import SalaryGuide from './pages/guides/SalaryGuide';
import FAQ from './pages/FAQ';
import About from './pages/About';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Support from './pages/Support';
import Callback from './pages/auth/Callback';
import './index.css';
import './styles/mobile.css';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import UserPreferences from './pages/UserPreferences';
import CareerAssistant from './pages/CareerAssistant';
import { ThemeProvider } from 'next-themes';

function App() {
  const { login, logout } = useAuthStore();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            login(profile.email || session.user.email || '', '');
          }
        } else if (event === 'SIGNED_OUT') {
          logout();
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              login(profile.email || session.user.email || '', '');
            }
          });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [login, logout]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/career-guides" element={<CareerGuides />} />
          <Route path="/guides/resume" element={<ResumeGuide />} />
          <Route path="/guides/interview" element={<InterviewGuide />} />
          <Route path="/guides/salary" element={<SalaryGuide />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/support" element={<Support />} />
          
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/apply/:id" element={<Apply />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/preferences" element={<UserPreferences />} />
          <Route path="/career-assistant" element={<CareerAssistant />} />

          <Route path="/auth/callback" element={<Callback />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <SonnerToaster position="bottom-right" />
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
