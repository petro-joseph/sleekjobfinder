
import { useAuthStore } from '@/lib/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollDirection } from '@/hooks/useScrollDirection';

const MobileProfileBar = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { scrollDirection, isAtTop } = useScrollDirection();
  
  if (!isAuthenticated || !user) return null;
  
  const initials = user.firstName && user.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`
    : 'U';
  
  const fullName = `${user.firstName} ${user.lastName}`;
  
  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-40 w-full md:hidden border-b",
      "transition-all duration-300 backdrop-blur-lg bg-background/80 shadow-sm",
      "glassmorphism animate-in",
      scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'
    )}>
      <div className="px-4 py-2">
        <Link to="/profile" className="flex items-center space-x-3 py-2">
          <Avatar className="h-8 w-8 border-2 border-primary/20">
            <AvatarImage src={user.avatarUrl || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate text-sm">{fullName}</p>
          </div>
          
          <UserIcon className="h-5 w-5 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
};

export default MobileProfileBar;
