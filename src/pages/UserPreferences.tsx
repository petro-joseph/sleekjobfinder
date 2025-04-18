import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Form,
  FormControl,
  FormDescription,
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
import { useNavigate } from 'react-router-dom';
import { useAuthStore, Resume } from '@/lib/store';
import { Check, ChevronsUpDown, Trash2, Upload, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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

const formSchema = z.object({
  locations: z.array(z.string()).min(1, 'Select at least one location'),
  jobTypes: z.array(z.string()).min(1, 'Select at least one job type'),
  industries: z.array(z.string()).min(1, 'Select at least one industry'),
  salaryMin: z.string().min(1, 'Minimum salary is required'),
  salaryMax: z.string().min(1, 'Maximum salary is required')
});

const UserPreferences = () => {
  const { user, updateUser, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [openCountry, setOpenCountry] = useState(false);
  const [openIndustry, setOpenIndustry] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [resumeFiles, setResumeFiles] = useState<Resume[]>([]);
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      locations: user?.jobPreferences?.locations || [],
      jobTypes: user?.jobPreferences?.jobTypes || [],
      industries: user?.jobPreferences?.industries || [],
      salaryMin: user?.jobPreferences?.salaryRange?.min.toString() || '50000',
      salaryMax: user?.jobPreferences?.salaryRange?.max.toString() || '100000'
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to access preferences", {
        description: "You've been redirected to the login page"
      });
      navigate('/login');
      return;
    }

    if (user) {
      if (user.jobPreferences?.locations) {
        setSelectedLocations(user.jobPreferences.locations);
      }
      
      if (user.jobPreferences?.industries) {
        setSelectedIndustries(user.jobPreferences.industries);
      }
      
      if (user.resumes) {
        setResumeFiles(user.resumes);
      }
      
      form.reset({
        locations: user.jobPreferences?.locations || [],
        jobTypes: user.jobPreferences?.jobTypes || [],
        industries: user.jobPreferences?.industries || [],
        salaryMin: user.jobPreferences?.salaryRange?.min.toString() || '50000',
        salaryMax: user.jobPreferences?.salaryRange?.max.toString() || '100000'
      });
    }
  }, [user, isAuthenticated, navigate, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      jobPreferences: {
        locations: data.locations,
        jobTypes: data.jobTypes,
        industries: data.industries,
        salaryRange: {
          min: parseInt(data.salaryMin),
          max: parseInt(data.salaryMax)
        }
      },
      onboardingStep: 3,
      isOnboardingComplete: true
    };

    updateUser(updatedUser);
    
    toast.success("Preferences updated successfully");
    navigate('/dashboard');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    setUploading(true);
    
    setTimeout(() => {
      const newResume: Resume = {
        id: Date.now().toString(),
        name: file.name,
        filePath: URL.createObjectURL(file),
        isPrimary: resumeFiles.length === 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        uploadDate: new Date()
      };
      
      const updatedResumes = [...resumeFiles, newResume];
      setResumeFiles(updatedResumes);
      
      if (user) {
        updateUser({
          ...user,
          resumes: updatedResumes
        });
      }
      
      setUploading(false);
      toast.success("Resume uploaded successfully");
    }, 1500);
  };

  const handleDeleteResume = (id: string) => {
    const updatedResumes = resumeFiles.filter(resume => resume.id !== id);
    
    if (resumeFiles.find(r => r.id === id)?.isPrimary && updatedResumes.length > 0) {
      updatedResumes[0].isPrimary = true;
    }
    
    setResumeFiles(updatedResumes);
    
    if (user) {
      updateUser({
        ...user,
        resumes: updatedResumes
      });
    }
    
    toast.success("Resume deleted successfully");
  };

  const handleSetPrimaryResume = (id: string) => {
    const updatedResumes = resumeFiles.map(resume => ({
      ...resume,
      isPrimary: resume.id === id
    }));
    
    setResumeFiles(updatedResumes);
    
    if (user) {
      updateUser({
        ...user,
        resumes: updatedResumes
      });
    }
    
    toast.success("Primary resume updated");
  };

  if (!user) {
    return null;
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
                          render={() => (
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
                                    Uploaded {resume.uploadDate ? new Date(resume.uploadDate).toLocaleDateString() : new Date(resume.createdAt).toLocaleDateString()}
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
                            checked={user.settings?.notifications} 
                            onCheckedChange={(checked) => {
                              updateUser({
                                ...user,
                                settings: {
                                  ...user.settings,
                                  notifications: checked
                                }
                              });
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
                            checked={user.settings?.emailUpdates} 
                            onCheckedChange={(checked) => {
                              updateUser({
                                ...user,
                                settings: {
                                  ...user.settings,
                                  emailUpdates: checked
                                }
                              });
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
