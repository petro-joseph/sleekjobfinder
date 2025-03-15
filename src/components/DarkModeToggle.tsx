
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  // Initialize theme based on localStorage or system preference
  useEffect(() => {
    const initializeTheme = () => {
      // Check if dark mode is saved in local storage
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Set initial theme based on localStorage or system preference
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDarkMode(false);
      }
    };

    initializeTheme();
  }, [location.pathname]); // Re-run when pathname changes to ensure it works on all pages

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <Button 
      variant="glass" 
      size="icon" 
      onClick={toggleDarkMode}
      className="rounded-full shadow-lg backdrop-blur-md"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 animate-in" />
      ) : (
        <Moon className="h-5 w-5 animate-in" />
      )}
    </Button>
  );
};

export default DarkModeToggle;
