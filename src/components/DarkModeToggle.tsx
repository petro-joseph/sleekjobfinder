
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface DarkModeToggleProps {
  className?: string;
}

const DarkModeToggle = ({ className }: DarkModeToggleProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if dark mode is saved in local storage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme based on localStorage (user preference) or fall back to system preference
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (prefersDark) {
      // Only use system preference if there's no saved user preference
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, [location.pathname]); 

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return (
    <Button 
      variant="glass" 
      size="icon" 
      onClick={toggleDarkMode}
      className={cn("rounded-full shadow-lg backdrop-blur-md h-12 w-12", className)}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className="h-6 w-6 animate-in" />
      ) : (
        <Moon className="h-6 w-6 animate-in" />
      )}
    </Button>
  );
};

export default DarkModeToggle;

