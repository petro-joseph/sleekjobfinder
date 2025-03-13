
import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/lib/store';
import { toast } from 'sonner';
import { UserCircle, Mail, Globe, Shield, LogOut, Camera, ChevronRight } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuthStore();
  const [publicProfile, setPublicProfile] = useState(false);
  const [jobAlerts, setJobAlerts] = useState(true);

  const handleLogout = () => {
    logout();
    toast.success("You've been logged out successfully");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully");
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings updated successfully");
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Layout>
      <section className="py-8 md:py-12">
        <div className="container px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your profile information and account settings
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="md:col-span-1"
            >
              <div className="space-y-6">
                {/* User Profile */}
                <div className="bg-card rounded-xl border shadow-sm p-6 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-medium">
                        {user?.firstName.charAt(0)}
                        {user?.lastName.charAt(0)}
                      </div>
                    )}
                    <button className="absolute -right-1 bottom-0 bg-primary text-white p-1.5 rounded-full hover:bg-primary/90 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-lg">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
                  <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </div>

                {/* Quick Links */}
                <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                  <div className="p-4 border-b">
                    <h3 className="font-medium text-sm">Quick Links</h3>
                  </div>
                  <div className="divide-y">
                    <ProfileLink href="/dashboard" label="Dashboard" />
                    <ProfileLink href="/saved-jobs" label="Saved Jobs" />
                    <ProfileLink href="/progress" label="Application Progress" />
                    <ProfileLink href="/resume-builder" label="Resume Builder" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="md:col-span-3"
            >
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                {/* Personal Info Tab */}
                <TabsContent value="personal">
                  <div className="bg-card rounded-xl border shadow-sm">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold">Personal Information</h3>
                      <p className="text-sm text-muted-foreground">
                        Update your basic profile information
                      </p>
                    </div>
                    <form onSubmit={handleSaveProfile} className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            defaultValue={user?.firstName}
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            defaultValue={user?.lastName}
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            defaultValue={user?.email}
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(123) 456-7890"
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="headline">Professional Headline</Label>
                          <Input
                            id="headline"
                            placeholder="e.g. Senior Software Engineer with 5+ years experience"
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="bio">About Me</Label>
                          <Textarea
                            id="bio"
                            placeholder="Tell employers about yourself..."
                            className="bg-background"
                            rows={4}
                          />
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t flex justify-end">
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  </div>

                  <div className="bg-card rounded-xl border shadow-sm mt-6">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold">Public Profile</h3>
                      <p className="text-sm text-muted-foreground">
                        Control how your profile appears to employers
                      </p>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Public Profile</div>
                          <div className="text-sm text-muted-foreground">
                            Make your profile visible to employers
                          </div>
                        </div>
                        <Switch
                          checked={publicProfile}
                          onCheckedChange={setPublicProfile}
                        />
                      </div>

                      {publicProfile && (
                        <div className="mt-4 p-4 border rounded-lg bg-secondary/30">
                          <div className="text-sm mb-2">Your public profile URL:</div>
                          <div className="flex">
                            <div className="bg-background text-muted-foreground text-sm rounded-l-md border border-r-0 py-2 px-3 flex-grow">
                              sleekjobs.com/p/{user?.firstName.toLowerCase()}-{user?.lastName.toLowerCase()}
                            </div>
                            <Button variant="secondary" size="sm" className="rounded-l-none">
                              Copy
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                  <div className="bg-card rounded-xl border shadow-sm">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold">Password</h3>
                      <p className="text-sm text-muted-foreground">
                        Update your password to keep your account secure
                      </p>
                    </div>
                    <form onSubmit={handleSaveSettings} className="p-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            className="bg-background"
                          />
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t flex justify-end">
                        <Button type="submit">Update Password</Button>
                      </div>
                    </form>
                  </div>

                  <div className="bg-card rounded-xl border shadow-sm mt-6">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold">Account Security</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your account security settings
                      </p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">Two-Factor Authentication</div>
                            <div className="text-sm text-muted-foreground">
                              Add an extra layer of security to your account
                            </div>
                          </div>
                          <Button variant="outline">Enable</Button>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-2">Active Sessions</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                              <div>
                                <div className="font-medium text-sm">Current Device</div>
                                <div className="text-xs text-muted-foreground">
                                  Chrome on Windows • IP: 192.168.1.1
                                </div>
                              </div>
                              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                Active
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences">
                  <div className="bg-card rounded-xl border shadow-sm">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Control what emails you receive from us
                      </p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">Job Alerts</div>
                            <div className="text-sm text-muted-foreground">
                              Receive emails for new job matches
                            </div>
                          </div>
                          <Switch
                            checked={jobAlerts}
                            onCheckedChange={setJobAlerts}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">Application Updates</div>
                            <div className="text-sm text-muted-foreground">
                              Get notified when your application status changes
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">Product Updates</div>
                            <div className="text-sm text-muted-foreground">
                              Learn about new features and improvements
                            </div>
                          </div>
                          <Switch />
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t flex justify-end">
                        <Button onClick={() => toast.success("Preferences saved")}>
                          Save Preferences
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border shadow-sm mt-6">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold">Privacy Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Control how your data is used
                      </p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">Analytics Cookies</div>
                            <div className="text-sm text-muted-foreground">
                              Help us improve by allowing analytics cookies
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium">Personalized Experience</div>
                            <div className="text-sm text-muted-foreground">
                              Tailor your experience based on your activity
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

// Helper component for sidebar links
const ProfileLink = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    className="flex items-center justify-between p-3 hover:bg-primary/5 transition-colors"
  >
    <span className="text-sm">{label}</span>
    <ChevronRight className="h-4 w-4 text-muted-foreground" />
  </a>
);

export default Profile;
