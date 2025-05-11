
import React, { lazy, Suspense, useEffect, memo, startTransition } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { supabase } from './integrations/supabase/client'
import { useAuthStore } from './lib/store'
import ProtectedRoute from './components/ProtectedRoute'
import { LoadingSpinner } from './components/jobs/LoadingState'
import { toast } from 'sonner'

// Global CSS
import './index.css'
import './styles/mobile.css'
import 'react-loading-skeleton/dist/skeleton.css'

// Define a custom interface for Navigator with connection property
interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

declare global {
  interface Navigator {
    connection?: NetworkInformation;
  }
}

// Toasters
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'

// Eagerly import frequently used components for better performance
import Home from './pages/Index'
import Jobs from './pages/Jobs'
import Login from './pages/Login'
import Signup from './pages/Signup'
import JobDetail from './pages/JobDetail'
import Dashboard from './pages/Dashboard'

// Lazy-load less frequently accessed pages
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

// Create optimized loading component
const PageLoader = memo(() => <LoadingSpinner />)

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
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <RoutePreloader />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="verify-otp" element={<VerifyOtp />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<BlogDetail />} />
            <Route path="career-guides" element={<CareerGuides />} />
            <Route path="guides/resume" element={<ResumeGuide />} />
            <Route path="guides/interview" element={<InterviewGuide />} />
            <Route path="guides/salary" element={<SalaryGuide />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="support" element={<Support />} />
            <Route path="about" element={<About />} />
            <Route path="careers" element={<Careers />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/:id" element={<JobDetail />} />
            <Route path="apply/:id" element={<Apply />} />
            <Route path="resume-builder" element={<ResumeBuilder />} />
            <Route path="auth/callback" element={<Callback />} />

            {/* Protected */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="saved-jobs" element={<SavedJobs />} />
              <Route path="profile" element={<Profile />} />
              <Route path="progress" element={<Progress />} />
              <Route path="preferences" element={<UserPreferences />} />
              <Route path="career-assistant" element={<CareerAssistant />} />
              <Route path="/manage-resumes" element={<ManageResumes />} />
            </Route>

            {/* catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>

        <SonnerToaster position="top-center" />
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
