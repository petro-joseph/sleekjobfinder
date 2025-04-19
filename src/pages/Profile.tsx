import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/lib/store';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { User, Globe, MapPin, FileEdit, LogOut, Settings } from 'lucide-react';

const Profile = () => {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    settings: {
      notifications: user?.settings?.notifications || false,
      emailUpdates: user?.settings?.emailUpdates || false,
      darkMode: user?.settings?.darkMode || false,
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSettingChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [name]: checked
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    
    toast.success("Profile updated successfully", {
      position: "top-center"
    });
  };

  const handleLogout = () => {
    logout();
    toast.info("You've been logged out", {
      position: "top-center"
    });
    navigate('/login');
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6 text-gradient bg-gradient-to-r from-primary to-primary/70">
          Your Profile
        </h1>
        
        <div className="flex items-center justify-between mb-8">
          <p className="text-muted-foreground">Manage your personal information and account settings</p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/preferences')}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Job Preferences
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-12">
          {/* Profile Info */}
          <div className="md:col-span-8">
            <Card className="glass hover backdrop-blur-xl border-primary/20 shadow-lg animate-fade-in">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and public profile
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="pl-10 transition-all border-muted/30 focus:border-primary"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="pl-10 transition-all border-muted/30 focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="transition-all border-muted/30 focus:border-primary"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Your email address is used for login and cannot be changed
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <div className="relative">
                      <FileEdit className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell us a bit about yourself"
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="pl-10 min-h-[120px] transition-all border-muted/30 focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="location"
                          name="location"
                          placeholder="Country"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="pl-10 transition-all border-muted/30 focus:border-primary"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="website"
                          name="website"
                          placeholder="https://your-website.com"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="pl-10 transition-all border-muted/30 focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="transition-all duration-300 hover:shadow-lg group"
                    >
                      Save Changes
                      <span className="ml-2 group-hover:rotate-45 transition-transform">
                        ↗
                      </span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Settings & Logout */}
          <div className="md:col-span-4 space-y-6">
            <Card className="glass hover backdrop-blur-xl border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive job alerts and updates
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={formData.settings.notifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailUpdates">Email Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Weekly job recommendations
                    </p>
                  </div>
                  <Switch
                    id="emailUpdates"
                    checked={formData.settings.emailUpdates}
                    onCheckedChange={(checked) => handleSettingChange('emailUpdates', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle dark/light theme
                    </p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={formData.settings.darkMode}
                    onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                  />
                </div>
              </CardContent>
              
              <CardFooter className="pt-2 pb-4 px-6">
                <Button 
                  variant="outline" 
                  className="w-full justify-center"
                  onClick={() => navigate('/user-preferences')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Job Preferences
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="glass hover backdrop-blur-xl border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Button 
                  variant="destructive" 
                  className="w-full justify-center"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-6">
                <p className="text-sm">
                  <span className="font-medium">Need help?</span> Contact our support team at support@sleekjobs.com
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Wrap with ProtectedRoute component
const ProtectedProfilePage = () => (
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
);

export default ProtectedProfilePage;
