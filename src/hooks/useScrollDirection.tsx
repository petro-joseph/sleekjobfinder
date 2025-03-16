
import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      
      // Only update direction when scrolled more than 10px
      if (Math.abs(scrollY - lastScrollY) > 5) {
        setScrollDirection(direction);
        setLastScrollY(scrollY);
      }
      
      // Check if at top
      setIsAtTop(scrollY < 10);
    };

    window.addEventListener('scroll', updateScrollDirection);
    
    return () => {
      window.removeEventListener('scroll', updateScrollDirection);
    };
  }, [lastScrollY]);

  return { scrollDirection, isAtTop };
}
