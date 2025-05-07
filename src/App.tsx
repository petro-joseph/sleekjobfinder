import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider"
import {
  SignIn,
  SignUp,
  Dashboard,
  JobDetail,
  Profile,
  UserPreferences,
  VerifyOTP,
  ResetPassword,
  ManageResumes
} from './imports';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/manage-resumes" element={<ManageResumes />} />
          <Route path="/preferences" element={<UserPreferences />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
        <Toaster position="bottom-right" />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
