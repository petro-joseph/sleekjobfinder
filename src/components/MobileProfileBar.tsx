
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
  const hasProfile = user.bio && user.location;
  
  return (
    <div className={cn(
      "sticky top-0 z-40 w-full md:hidden",
      isAtTop ? 'py-4' : 'py-2',
      "transition-all duration-300",
      scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'
    )}>
      <div className="backdrop-blur-md bg-background/80 border-b border-border/40 px-4">
        <Link to="/profile" className="flex items-center space-x-3 py-2">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{fullName}</p>
            {hasProfile ? (
              <p className="text-sm text-muted-foreground truncate">
                {user.bio?.split(' ').slice(0, 5).join(' ')}...
              </p>
            ) : (
              <p className="text-sm text-primary truncate">
                Complete your profile →
              </p>
            )}
          </div>
          
          <UserIcon className="h-5 w-5 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
};

export default MobileProfileBar;
