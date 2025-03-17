
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Check, X, Save, PlusCircle, MinusCircle, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

// Define possible job types, locations and industries
const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Temporary',
  'Internship',
  'Remote',
  'Freelance'
];

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Marketing',
  'Sales',
  'Customer Service',
  'Manufacturing',
  'Retail',
  'Construction',
  'Legal',
  'Hospitality',
  'Non-profit',
  'Media',
  'Design'
];

const LOCATIONS = [
  'Remote',
  'New York, NY',
  'San Francisco, CA',
  'Los Angeles, CA',
  'Chicago, IL',
  'Boston, MA',
  'Seattle, WA',
  'Austin, TX',
  'Denver, CO',
  'Atlanta, GA',
  'Washington, DC'
];

const UserPreferences = () => {
  const { user, updateUser, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [newJobType, setNewJobType] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  
  // Local state for form
  const [preferences, setPreferences] = useState({
    locations: [] as string[],
    jobTypes: [] as string[],
    industries: [] as string[],
    salaryRange: {
      min: 0,
      max: 0
    },
    notifications: {
      email: false,
      app: true,
      jobAlerts: true
    }
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to access your preferences", {
        description: "You've been redirected to the login page"
      });
      navigate('/login');
    }
    
    // Initialize form with user data if available
    if (user && user.jobPreferences) {
      setPreferences({
        locations: user.jobPreferences.locations || [],
        jobTypes: user.jobPreferences.jobTypes || [],
        industries: user.jobPreferences.industries || [],
        salaryRange: {
          min: user.jobPreferences.salaryRange?.min || 0,
          max: user.jobPreferences.salaryRange?.max || 0
        },
        notifications: {
          email: user.settings?.emailUpdates || false,
          app: user.settings?.notifications || true,
          jobAlerts: true
        }
      });
    }
  }, [isAuthenticated, navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateUser({
        jobPreferences: {
          locations: preferences.locations,
          jobTypes: preferences.jobTypes,
          industries: preferences.industries,
          salaryRange: preferences.salaryRange
        },
        settings: {
          emailUpdates: preferences.notifications.email,
          notifications: preferences.notifications.app,
          darkMode: user?.settings?.darkMode || false
        }
      });
      
      toast.success("Preferences updated successfully");
    } catch (error) {
      toast.error("Failed to update preferences");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const addLocation = () => {
    if (newLocation && !preferences.locations.includes(newLocation)) {
      setPreferences(prev => ({
        ...prev,
        locations: [...prev.locations, newLocation]
      }));
      setNewLocation('');
    }
  };
  
  const removeLocation = (location: string) => {
    setPreferences(prev => ({
      ...prev,
      locations: prev.locations.filter(loc => loc !== location)
    }));
  };
  
  const addJobType = () => {
    if (newJobType && !preferences.jobTypes.includes(newJobType)) {
      setPreferences(prev => ({
        ...prev,
        jobTypes: [...prev.jobTypes, newJobType]
      }));
      setNewJobType('');
    }
  };
  
  const removeJobType = (type: string) => {
    setPreferences(prev => ({
      ...prev,
      jobTypes: prev.jobTypes.filter(t => t !== type)
    }));
  };
  
  const addIndustry = () => {
    if (newIndustry && !preferences.industries.includes(newIndustry)) {
      setPreferences(prev => ({
        ...prev,
        industries: [...prev.industries, newIndustry]
      }));
      setNewIndustry('');
    }
  };
  
  const removeIndustry = (industry: string) => {
    setPreferences(prev => ({
      ...prev,
      industries: prev.industries.filter(i => i !== industry)
    }));
  };

  if (!user) {
    return null; // Will be redirected by useEffect
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-160px)] bg-gradient-mesh">
        <div className="container mx-auto px-4 py-6 md:px-6">
          <div className="mb-6 flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Job Preferences</h1>
          </div>
          
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-8">
              <form onSubmit={handleSubmit}>
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Locations */}
                  <Card className="backdrop-blur-xl border-primary/20 shadow-lg hover:border-primary/40 transition-all duration-300 rounded-xl">
                    <CardHeader>
                      <CardTitle>Preferred Locations</CardTitle>
                      <CardDescription>Select locations where you'd like to work</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {preferences.locations.map(location => (
                          <Badge key={location} variant="secondary" className="py-2 px-3 hover:bg-muted">
                            {location}
                            <button 
                              type="button" 
                              onClick={() => removeLocation(location)}
                              className="ml-2 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Select 
                          value={newLocation} 
                          onValueChange={setNewLocation}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a location" />
                          </SelectTrigger>
                          <SelectContent>
                            {LOCATIONS.filter(loc => !preferences.locations.includes(loc)).map(location => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          type="button" 
                          onClick={addLocation}
                          variant="outline"
                          className="flex-shrink-0"
                          disabled={!newLocation}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Job Types */}
                  <Card className="backdrop-blur-xl border-primary/20 shadow-lg hover:border-primary/40 transition-all duration-300 rounded-xl">
                    <CardHeader>
                      <CardTitle>Job Types</CardTitle>
                      <CardDescription>Select the types of employment you're looking for</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {preferences.jobTypes.map(type => (
                          <Badge key={type} variant="secondary" className="py-2 px-3 hover:bg-muted">
                            {type}
                            <button 
                              type="button" 
                              onClick={() => removeJobType(type)}
                              className="ml-2 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Select 
                          value={newJobType} 
                          onValueChange={setNewJobType}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a job type" />
                          </SelectTrigger>
                          <SelectContent>
                            {JOB_TYPES.filter(type => !preferences.jobTypes.includes(type)).map(type => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          type="button" 
                          onClick={addJobType}
                          variant="outline"
                          className="flex-shrink-0"
                          disabled={!newJobType}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Industries */}
                  <Card className="backdrop-blur-xl border-primary/20 shadow-lg hover:border-primary/40 transition-all duration-300 rounded-xl">
                    <CardHeader>
                      <CardTitle>Industries</CardTitle>
                      <CardDescription>Select industries you're interested in</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {preferences.industries.map(industry => (
                          <Badge key={industry} variant="secondary" className="py-2 px-3 hover:bg-muted">
                            {industry}
                            <button 
                              type="button" 
                              onClick={() => removeIndustry(industry)}
                              className="ml-2 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Select 
                          value={newIndustry} 
                          onValueChange={setNewIndustry}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {INDUSTRIES.filter(ind => !preferences.industries.includes(ind)).map(industry => (
                              <SelectItem key={industry} value={industry}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          type="button" 
                          onClick={addIndustry}
                          variant="outline"
                          className="flex-shrink-0"
                          disabled={!newIndustry}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Salary Range */}
                  <Card className="backdrop-blur-xl border-primary/20 shadow-lg hover:border-primary/40 transition-all duration-300 rounded-xl">
                    <CardHeader>
                      <CardTitle>Salary Range</CardTitle>
                      <CardDescription>Set your expected salary range</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="minSalary">Minimum ($)</Label>
                          <Input 
                            id="minSalary"
                            type="number"
                            value={preferences.salaryRange.min}
                            onChange={(e) => setPreferences({
                              ...preferences,
                              salaryRange: {
                                ...preferences.salaryRange,
                                min: parseInt(e.target.value) || 0
                              }
                            })}
                            placeholder="Minimum salary"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="maxSalary">Maximum ($)</Label>
                          <Input 
                            id="maxSalary"
                            type="number"
                            value={preferences.salaryRange.max}
                            onChange={(e) => setPreferences({
                              ...preferences,
                              salaryRange: {
                                ...preferences.salaryRange,
                                max: parseInt(e.target.value) || 0
                              }
                            })}
                            placeholder="Maximum salary"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Notification Settings */}
                  <Card className="backdrop-blur-xl border-primary/20 shadow-lg hover:border-primary/40 transition-all duration-300 rounded-xl">
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Manage how you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive job updates via email</p>
                        </div>
                        <Switch
                          checked={preferences.notifications.email}
                          onCheckedChange={(checked) => setPreferences({
                            ...preferences,
                            notifications: {
                              ...preferences.notifications,
                              email: checked
                            }
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">App Notifications</p>
                          <p className="text-sm text-muted-foreground">In-app notifications and alerts</p>
                        </div>
                        <Switch
                          checked={preferences.notifications.app}
                          onCheckedChange={(checked) => setPreferences({
                            ...preferences,
                            notifications: {
                              ...preferences.notifications,
                              app: checked
                            }
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">Job Alert Notifications</p>
                          <p className="text-sm text-muted-foreground">Get notified about new job matches</p>
                        </div>
                        <Switch
                          checked={preferences.notifications.jobAlerts}
                          onCheckedChange={(checked) => setPreferences({
                            ...preferences,
                            notifications: {
                              ...preferences.notifications,
                              jobAlerts: checked
                            }
                          })}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/dashboard')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={loading}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {loading ? 
                        <span className="flex items-center">
                          <div className="loader mr-2" />
                          Saving...
                        </span> : 
                        <span className="flex items-center">
                          <Save className="h-4 w-4 mr-2" />
                          Save Preferences
                        </span>
                      }
                    </Button>
                  </div>
                </motion.div>
              </form>
            </div>
            
            <div className="md:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="backdrop-blur-xl border-primary/20 shadow-lg hover:border-primary/40 transition-all duration-300 rounded-xl sticky top-20">
                  <CardHeader>
                    <CardTitle>Why Set Preferences?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start">
                      <div className="mr-3 p-2 rounded-full bg-primary/10 flex-shrink-0">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-sm">Get more relevant job recommendations</p>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mr-3 p-2 rounded-full bg-primary/10 flex-shrink-0">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-sm">Receive notifications for jobs that match your criteria</p>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mr-3 p-2 rounded-full bg-primary/10 flex-shrink-0">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-sm">Increase your chances of finding the perfect job faster</p>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mr-3 p-2 rounded-full bg-primary/10 flex-shrink-0">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-sm">Control how and when you receive notifications</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserPreferences;
