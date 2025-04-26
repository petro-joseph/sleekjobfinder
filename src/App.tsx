import React, { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { supabase } from './integrations/supabase/client'
import { useAuthStore } from './lib/store'
import ProtectedRoute from './components/ProtectedRoute'
import { LoadingSpinner } from './components/jobs/LoadingState'

// Global CSS
import './index.css'
import './styles/mobile.css'
import 'react-loading-skeleton/dist/skeleton.css'

// Toasters
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'

// Lazy-load all pages
const Home = lazy(() => import('./pages/Index'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
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
const Jobs = lazy(() => import('./pages/Jobs'))
const JobDetail = lazy(() => import('./pages/JobDetail'))
const Apply = lazy(() => import('./pages/Apply'))
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Profile = lazy(() => import('./pages/Profile'))
const SavedJobs = lazy(() => import('./pages/SavedJobs'))
const Progress = lazy(() => import('./pages/Progress'))
const UserPreferences = lazy(() => import('./pages/UserPreferences'))
const CareerAssistant = lazy(() => import('./pages/CareerAssistant'))
const Callback = lazy(() => import('./pages/auth/Callback'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  const { login, logout } = useAuthStore()

  useEffect(() => {
    // 1) Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          fetchAndStoreProfile(session.user.id, session.user.email)
        } else if (event === 'SIGNED_OUT') {
          logout()
        }
      }
    );

      // 2) Check initial session on mount
      (async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          fetchAndStoreProfile(session.user.id, session.user.email)
        }
      })()

    // cleanup listener
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [login, logout])

  // helper to fetch profile row and dispatch login
  const fetchAndStoreProfile = async (userId, fallbackEmail) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
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
        <Suspense fallback={<LoadingSpinner />}>
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