
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/lib/store';

const UserAvatar = ({ className }: { className?: string }) => {
  const { user } = useAuthStore();
  
  if (!user) return null;
  
  const initials = user.firstName && user.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`
    : 'U';
    
  return (
    <Avatar className={className}>
      <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
      <AvatarFallback className="bg-primary/10 text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
