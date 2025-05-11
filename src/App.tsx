
import React, { lazy, Suspense, useEffect, memo, startTransition } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useRoutes } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { supabase } from './integrations/supabase/client'
import { useAuthStore } from './lib/store'
import ProtectedRoute from './components/ProtectedRoute'
import { getSuspenseFallback } from './config/suspense'
import { QueryProvider } from './providers/QueryProvider'

// Global CSS
import './index.css'
import './styles/mobile.css'
import 'react-loading-skeleton/dist/skeleton.css'

// Toasters
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'

// Eagerly import frequently used components for better performance
import Home from './pages/Index'
import Login from './pages/Login'
import Signup from './pages/Signup'

// Route components with suspense and performance optimization
const RouteComponent = ({ Component }: { Component: React.ComponentType }) => {
  const location = useLocation();
  const fallback = getSuspenseFallback(location.pathname);
  
  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  );
};

// Lazily import routes with automatic code splitting
const Jobs = lazy(() => import('./pages/Jobs'))
const JobDetail = lazy(() => import('./pages/JobDetail'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const VerifyOtp = lazy(() => import('./pages/VerifyOtp'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogDetail = lazy(() => import('./pages/BlogDetail'))
const CareerGuides = lazy(() => import('./pages/CareerGuides'))
const ResumeGuide = lazy(() => import('./pages/guides/ResumeGuide'))
const InterviewGuide = lazy(() => import('./pages/guides/InterviewGuide'))
const SalaryGuide = lazy(() => import('./pages/guides/SalaryGuide'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Support = lazy(() => import('./pages/Support'))
const About = lazy(() => import('./pages/About'))
const Careers = lazy(() => import('./pages/Careers'))
const Contact = lazy(() => import('./pages/Contact'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const Apply = lazy(() => import('./pages/Apply'))
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'))
const Profile = lazy(() => import('./pages/Profile'))
const SavedJobs = lazy(() => import('./pages/SavedJobs'))
const Progress = lazy(() => import('./pages/Progress'))
const UserPreferences = lazy(() => import('./pages/UserPreferences'))
const CareerAssistant = lazy(() => import('./pages/CareerAssistant'))
const Callback = lazy(() => import('./pages/auth/Callback'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ManageResumes = lazy(() => import('./pages/ManageResumes'))

// Preload important routes for better UX
function RoutePreloader() {
  const location = useLocation();

  useEffect(() => {
    // Only preload if we're not on a slow connection
    if (navigator.connection &&
      (navigator.connection.saveData ||
        navigator.connection.effectiveType === '2g' ||
        navigator.connection.effectiveType === 'slow-2g')) {
      return; // Skip preloading on slow connections
    }

    // Create a queue of preloads to manage resource priority
    const preloadQueue = [];

    if (location.pathname === '/') {
      preloadQueue.push(
        () => import('./pages/Jobs'),
        () => import('./pages/Login'),
        () => import('./pages/Signup')
      );
    } else if (location.pathname.startsWith('/jobs')) {
      preloadQueue.push(
        () => import('./pages/JobDetail'),
        () => import('./pages/Apply')
      );
    } else if (['/login', '/signup'].includes(location.pathname)) {
      preloadQueue.push(
        () => import('./pages/Dashboard'),
        () => import('./pages/Profile')
      );
    }

    // Execute preloads with a delay to not block main thread
    let index = 0;
    const loadNext = () => {
      if (index < preloadQueue.length) {
        startTransition(() => {
          preloadQueue[index]().then(() => {
            index++;
            setTimeout(loadNext, 200); // Stagger preloads
          });
        });
      }
    };

    // Start preloading
    if (preloadQueue.length) {
      setTimeout(loadNext, 300); // Start after initial render completes
    }
  }, [location.pathname]);

  return null;
}

function App() {
  const { login, logout } = useAuthStore()

  useEffect(() => {
    if (!document.startViewTransition) return;

    const handleNavigation = () => {
      document.startViewTransition(() => {
        // React will update the DOM during this callback
      });
    };

    window.addEventListener('beforenavigate', handleNavigation);
    return () => window.removeEventListener('beforenavigate', handleNavigation);
  }, []);

  useEffect(() => {
    // 1) Listen for auth changes - using a local variable to prevent memory leaks
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;

    const setupAuthListener = async () => {
      const { data } = await supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            // Use setTimeout to prevent potential deadlocks with Supabase client
            setTimeout(() => {
              fetchAndStoreProfile(session.user.id, session.user.email || '')

            }, 0);
          } else if (event === 'SIGNED_OUT') {

          }
        }
      );

      authListener = data;
    };

    // 2) Check initial session on mount - separated from the listener setup
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        fetchAndStoreProfile(session.user.id, session.user.email || '');
      }
    };

    // Run both functions
    setupAuthListener();
    checkInitialSession();

    // cleanup listener
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    }
  }, [login, logout])

  // helper to fetch profile row and dispatch login
  const fetchAndStoreProfile = async (userId: string, fallbackEmail: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      login(profile?.email ?? fallbackEmail, '')
    } catch (err) {
      console.error('fetch profile failed:', err)
      login(fallbackEmail, '')
    }
  }

  return (
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <BrowserRouter>
          <RoutePreloader />
          
          <Routes>
            {/* Public routes - not using suspense for critical landing page */}
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            
            {/* Public routes with suspense */}
            <Route path="verify-otp" element={<RouteComponent Component={VerifyOtp} />} />
            <Route path="pricing" element={<RouteComponent Component={Pricing} />} />
            <Route path="blog" element={<RouteComponent Component={Blog} />} />
            <Route path="blog/:id" element={<RouteComponent Component={BlogDetail} />} />
            <Route path="career-guides" element={<RouteComponent Component={CareerGuides} />} />
            <Route path="guides/resume" element={<RouteComponent Component={ResumeGuide} />} />
            <Route path="guides/interview" element={<RouteComponent Component={InterviewGuide} />} />
            <Route path="guides/salary" element={<RouteComponent Component={SalaryGuide} />} />
            <Route path="faq" element={<RouteComponent Component={FAQ} />} />
            <Route path="support" element={<RouteComponent Component={Support} />} />
            <Route path="about" element={<RouteComponent Component={About} />} />
            <Route path="careers" element={<RouteComponent Component={Careers} />} />
            <Route path="contact" element={<RouteComponent Component={Contact} />} />
            <Route path="privacy" element={<RouteComponent Component={Privacy} />} />
            <Route path="terms" element={<RouteComponent Component={Terms} />} />
            <Route path="jobs" element={<RouteComponent Component={Jobs} />} />
            <Route path="jobs/:id" element={<RouteComponent Component={JobDetail} />} />
            <Route path="apply/:id" element={<RouteComponent Component={Apply} />} />
            <Route path="resume-builder" element={<RouteComponent Component={ResumeBuilder} />} />
            <Route path="auth/callback" element={<RouteComponent Component={Callback} />} />

            {/* Protected routes with suspense */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<RouteComponent Component={Dashboard} />} />
              <Route path="saved-jobs" element={<RouteComponent Component={SavedJobs} />} />
              <Route path="profile" element={<RouteComponent Component={Profile} />} />
              <Route path="progress" element={<RouteComponent Component={Progress} />} />
              <Route path="preferences" element={<RouteComponent Component={UserPreferences} />} />
              <Route path="career-assistant" element={<RouteComponent Component={CareerAssistant} />} />
              <Route path="manage-resumes" element={<RouteComponent Component={ManageResumes} />} />
            </Route>

            {/* catch-all */}
            <Route path="*" element={<RouteComponent Component={NotFound} />} />
          </Routes>

          <SonnerToaster position="top-center" />
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </QueryProvider>
  )
}

export default App
