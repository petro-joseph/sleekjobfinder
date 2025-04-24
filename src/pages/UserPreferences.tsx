import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Resume } from '@/lib/store';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronsUpDown, Check, X, Trash2, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';

const countries = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'CN', label: 'China' },
  { value: 'IN', label: 'India' },
  { value: 'BR', label: 'Brazil' },
].sort((a, b) => a.label.localeCompare(b.label));

const jobTypes = [
  { id: 'full-time', label: 'Full-time' },
  { id: 'part-time', label: 'Part-time' },
  { id: 'contract', label: 'Contract' },
  { id: 'freelance', label: 'Freelance' },
  { id: 'internship', label: 'Internship' },
  { id: 'remote', label: 'Remote' },
  { id: 'hybrid', label: 'Hybrid' },
];

const industries = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'marketing', label: 'Marketing & Advertising' },
  { value: 'hospitality', label: 'Hospitality & Tourism' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'construction', label: 'Construction' },
].sort((a, b) => a.label.localeCompare(b.label));

interface JobPreferences {
  locations?: string[];
  job_types?: string[];
  industries?: string[];
  salary_range?: {
    min: number;
    max: number;
  };
}

const formSchema = z.object({
  locations: z.array(z.string()).min(1, 'Select at least one location'),
  jobTypes: z.array(z.string()).min(1, 'Select at least one job type'),
  industries: z.array(z.string()).min(1, 'Select at least one industry'),
  salaryMin: z.string().refine(val => !isNaN(parseInt(val)), { message: "Minimum salary must be a number" }),
  salaryMax: z.string().refine(val => !isNaN(parseInt(val)), { message: "Maximum salary must be a number" }),
});

const UserPreferences = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [openCountry, setOpenCountry] = useState(false);
  const [openIndustry, setOpenIndustry] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [resumeFiles, setResumeFiles] = useState<Resume[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState({
    notifications: false,
    emailUpdates: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      locations: [],
      jobTypes: [],
      industries: [],
      salaryMin: '50000',
      salaryMax: '100000'
    }
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Please log in to access preferences");
          navigate('/login');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          toast.error("Error fetching user profile");
          return;
        }

        const { data: resumesData, error: resumesError } = await supabase
          .from('resumes')
          .select('*')
          .eq('user_id', user.id);

        if (resumesError) {
          toast.error("Error fetching resumes");
        }

        const resumes = resumesError ? [] : resumesData.map(resume => ({
          id: resume.id,
          name: resume.name,
          file_path: resume.file_path,
          isPrimary: resume.is_primary,
          created_at: resume.created_at,
          updated_at: resume.updated_at,
          uploadDate: resume.upload_date || resume.created_at
        }));

        setUser({
          id: user.id,
          firstName: profile?.first_name || '',
          lastName: profile?.last_name || '',
          email: user.email || '',
          applications: [],
          savedJobs: [],
          alerts: [],
          resumes: resumes,
          settings: {
            notifications: profile?.settings?.notifications || false,
            emailUpdates: profile?.settings?.emailUpdates || false,
            darkMode: profile?.settings?.darkMode || false
          }
        });

        setNotificationSettings({
          notifications: profile?.settings?.notifications || false,
          emailUpdates: profile?.settings?.emailUpdates || false
        });

        setResumeFiles(resumes);

        const jobPreferences = profile?.job_preferences as JobPreferences || {};
        
        const locations = jobPreferences?.locations || [];
        const jobTypes = jobPreferences?.job_types || [];
        const industries = jobPreferences?.industries || [];
        
        form.reset({
          locations: locations,
          jobTypes: jobTypes,
          industries: industries,
          salaryMin: jobPreferences?.salary_range?.min?.toString() || '50000',
          salaryMax: jobPreferences?.salary_range?.max?.toString() || '100000'
        });

        setSelectedLocations(locations);
        setSelectedIndustries(industries);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          job_preferences: {
            locations: data.locations,
            job_types: data.jobTypes,
            industries: data.industries,
            salary_range: {
              min: parseInt(data.salaryMin),
              max: parseInt(data.salaryMax)
            }
          },
          settings: {
            ...notificationSettings,
          },
          onboarding_step: 3,
          is_onboarding_complete: true
        })
        .eq('id', user.id);

      if (error) {
        console.error("Update error:", error);
        toast.error("Failed to update preferences");
        return;
      }

      toast.success("Preferences updated successfully");
      navigate('/dashboard');
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size limit exceeded", {
        description: "Please upload a file smaller than 5MB"
      });
      return;
    }
    
    if (file.type !== 'application/pdf') {
      toast.error("Invalid file type", {
        description: "Please upload a PDF file"
      });
      return;
    }
    
    if (resumeFiles.length >= 3) {
      toast.error("Maximum resume limit reached", {
        description: "You can only upload up to 3 resumes. Delete one to upload another."
      });
      return;
    }
    
    try {
      setUploading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      const fileUrl = urlData.publicUrl;

      const isPrimary = resumeFiles.length === 0;
      const { error: dbError, data: resumeData } = await supabase
        .from('resumes')
        .insert([{
          user_id: user.id,
          name: file.name,
          file_path: fileUrl,
          is_primary: isPrimary,
          upload_date: new Date().toISOString()
        }])
        .select()
        .single();

      if (dbError) {
        throw new Error(dbError.message);
      }

      const newResume: Resume = {
        id: resumeData.id,
        name: file.name,
        file_path: fileUrl,
        isPrimary,
        created_at: resumeData.created_at,
        updated_at: resumeData.updated_at,
        uploadDate: new Date()
      };
      
      const updatedResumes = [...resumeFiles, newResume];
      setResumeFiles(updatedResumes);
      
      if (user) {
        setUser({
          ...user,
          resumes: updatedResumes
        });
      }
      
      toast.success("Resume uploaded successfully");
    } catch (error) {
      console.error("Resume upload error:", error);
      toast.error("Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const updatedResumes = resumeFiles.filter(resume => resume.id !== id);
      
      if (resumeFiles.find(r => r.id === id)?.isPrimary && updatedResumes.length > 0) {
        await supabase
          .from('resumes')
          .update({ is_primary: true })
          .eq('id', updatedResumes[0].id);
          
        updatedResumes[0].isPrimary = true;
      }
      
      setResumeFiles(updatedResumes);
      
      if (user) {
        setUser({
          ...user,
          resumes: updatedResumes
        });
      }
      
      toast.success("Resume deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete resume");
    }
  };

  const handleSetPrimaryResume = async (id: string) => {
    try {
      await supabase
        .from('resumes')
        .update({ is_primary: false })
        .eq('user_id', user?.id);
      
      await supabase
        .from('resumes')
        .update({ is_primary: true })
        .eq('id', id);

      const updatedResumes = resumeFiles.map(resume => ({
        ...resume,
        isPrimary: resume.id === id
      }));
      
      setResumeFiles(updatedResumes);
      
      if (user) {
        setUser({
          ...user,
          resumes: updatedResumes
        });
      }
      
      toast.success("Primary resume updated");
    } catch (error) {
      console.error("Primary resume update error:", error);
      toast.error("Failed to update primary resume");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-160px)] bg-white dark:bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center items-center h-64">
                <p>Loading preferences...</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-160px)] bg-white dark:bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Job Preferences</h1>
            
            <div className="grid gap-6">
              <Card className="backdrop-blur-xl border border-primary/20 shadow-lg overflow-hidden rounded-xl">
                <CardHeader>
                  <CardTitle>Preferred Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Countries</Label>
                      <Popover open={openCountry} onOpenChange={setOpenCountry}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCountry}
                            className="w-full justify-between"
                          >
                            {selectedLocations.length > 0
                              ? `${selectedLocations.length} selected`
                              : "Select countries..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search countries..." />
                            <CommandList>
                              <CommandEmpty>No country found.</CommandEmpty>
                              <CommandGroup className="max-h-64 overflow-y-auto">
                                {countries.map((country) => (
                                  <CommandItem
                                    key={country.value}
                                    value={country.label}
                                    onSelect={() => {
                                      const updatedLocations = selectedLocations.includes(country.label)
                                        ? selectedLocations.filter((l) => l !== country.label)
                                        : [...selectedLocations, country.label];
                                      
                                      setSelectedLocations(updatedLocations);
                                      form.setValue('locations', updatedLocations);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedLocations.includes(country.label) ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {country.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedLocations.map((location) => (
                          <Badge key={location} variant="secondary" className="px-3 py-1">
                            {location}
                            <X
                              className="ml-1 h-3 w-3 cursor-pointer"
                              onClick={() => {
                                const updatedLocations = selectedLocations.filter(l => l !== location);
                                setSelectedLocations(updatedLocations);
                                form.setValue('locations', updatedLocations);
                              }}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <Card className="backdrop-blur-xl border border-primary/20 shadow-lg overflow-hidden rounded-xl">
                    <CardHeader>
                      <CardTitle>Job Types & Industries</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="jobTypes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Types</FormLabel>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {jobTypes.map((type) => (
                                  <FormItem
                                    key={type.id}
                                    className="flex items-center space-x-2 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(type.id)}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            field.onChange([...field.value, type.id]);
                                          } else {
                                            field.onChange(field.value?.filter((value) => value !== type.id));
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {type.label}
                                    </FormLabel>
                                  </FormItem>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="industries"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Industries</FormLabel>
                              <Popover open={openIndustry} onOpenChange={setOpenIndustry}>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between"
                                  >
                                    {selectedIndustries.length > 0
                                      ? `${selectedIndustries.length} selected`
                                      : "Select industries..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                  <Command>
                                    <CommandInput placeholder="Search industries..." />
                                    <CommandList>
                                      <CommandEmpty>No industry found.</CommandEmpty>
                                      <CommandGroup className="max-h-64 overflow-y-auto">
                                        {industries.map((industry) => (
                                          <CommandItem
                                            key={industry.value}
                                            value={industry.label}
                                            onSelect={() => {
                                              const updatedIndustries = selectedIndustries.includes(industry.label)
                                                ? selectedIndustries.filter((i) => i !== industry.label)
                                                : [...selectedIndustries, industry.label];
                                              
                                              setSelectedIndustries(updatedIndustries);
                                              form.setValue('industries', updatedIndustries);
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedIndustries.includes(industry.label) ? "opacity-100" : "opacity-0"
                                              )}
                                            />
                                            {industry.label}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              
                              <div className="flex flex-wrap gap-2 mt-2">
                                {selectedIndustries.map((industry) => (
                                  <Badge key={industry} variant="secondary" className="px-3 py-1">
                                    {industry}
                                    <X
                                      className="ml-1 h-3 w-3 cursor-pointer"
                                      onClick={() => {
                                        const updatedIndustries = selectedIndustries.filter(i => i !== industry);
                                        setSelectedIndustries(updatedIndustries);
                                        form.setValue('industries', updatedIndustries);
                                      }}
                                    />
                                  </Badge>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="backdrop-blur-xl border border-primary/20 shadow-lg overflow-hidden rounded-xl mt-6">
                    <CardHeader>
                      <CardTitle>Salary Range</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="salaryMin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Salary (USD)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="e.g. 50000"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="salaryMax"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Salary (USD)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="e.g. 100000"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="backdrop-blur-xl border border-primary/20 shadow-lg overflow-hidden rounded-xl mt-6">
                    <CardHeader>
                      <CardTitle>Resume Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                          <Input
                            type="file"
                            accept=".pdf"
                            id="resume-upload"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={uploading || resumeFiles.length >= 3}
                          />
                          <Label
                            htmlFor="resume-upload"
                            className="flex flex-col items-center cursor-pointer"
                          >
                            <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {uploading ? 'Uploading...' : 'Click to upload your resume (PDF only)'}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                              Maximum 3 resumes, 5MB each
                            </span>
                          </Label>
                        </div>
                        
                        <div className="space-y-2">
                          {resumeFiles.map((resume) => (
                            <div
                              key={resume.id}
                              className="flex items-center justify-between p-3 border rounded-lg bg-background/50"
                            >
                              <div className="flex items-center">
                                <div className="mr-3">
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    PDF
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium">{resume.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Uploaded {resume.uploadDate ? new Date(resume.uploadDate).toLocaleDateString() : new Date(resume.created_at || "").toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {resume.isPrimary ? (
                                  <Badge className="mr-2" variant="secondary">Primary</Badge>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mr-2 text-xs h-8"
                                    onClick={() => handleSetPrimaryResume(resume.id)}
                                  >
                                    Set as Primary
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDeleteResume(resume.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="backdrop-blur-xl border border-primary/20 shadow-lg overflow-hidden rounded-xl mt-6">
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="notifications" className="font-medium">
                              App Notifications
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications about job matches and application updates
                            </p>
                          </div>
                          <Switch 
                            id="notifications" 
                            checked={notificationSettings.notifications} 
                            onCheckedChange={(checked) => {
                              setNotificationSettings(prev => ({
                                ...prev,
                                notifications: checked
                              }));
                            }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="email-updates" className="font-medium">
                              Email Updates
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Receive emails about new job opportunities and career tips
                            </p>
                          </div>
                          <Switch 
                            id="email-updates" 
                            checked={notificationSettings.emailUpdates} 
                            onCheckedChange={(checked) => {
                              setNotificationSettings(prev => ({
                                ...prev,
                                emailUpdates: checked
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="mt-6 flex justify-end">
                    <Button type="submit" size="lg" className="w-full md:w-auto">
                      Save Preferences
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserPreferences;
