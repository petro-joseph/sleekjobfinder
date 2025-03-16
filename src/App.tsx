
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResumeBuilder from "./pages/ResumeBuilder";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Progress from "./pages/Progress";
import SavedJobs from "./pages/SavedJobs";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./lib/store";
import BottomNav from "./components/BottomNav";
import "./styles/mobile.css"; // Import mobile styles

// Import new pages
import Blog from "./pages/Blog";
import CareerGuides from "./pages/CareerGuides";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import ForgotPassword from "./pages/ForgotPassword";

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="relative min-h-screen">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              
              {/* New public pages */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/career-guides" element={<CareerGuides />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Auth routes */}
              <Route 
                path="/login" 
                element={
                  isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
                } 
              />
              <Route 
                path="/signup" 
                element={
                  isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />
                } 
              />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/progress" 
                element={
                  <ProtectedRoute>
                    <Progress />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/saved-jobs" 
                element={
                  <ProtectedRoute>
                    <SavedJobs />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
