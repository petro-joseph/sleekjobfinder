import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";

// UI Components
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronRight, Bell, Clock, Filter, PlusCircle, Check, X } from 'lucide-react';

// Store, Auth, Supabase
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';
import { ApplicationTableSkeleton } from '@/components/jobs/LoadingState';

// --- Constants and Types (Ideally move to separate files: constants.ts, types.ts) ---

const APPLICATION_STATUSES = ['applied', 'interview', 'offer_received', 'rejected', 'archived'] as const;
type ApplicationStatus = typeof APPLICATION_STATUSES[number];

interface Application {
  id: string;
  job_id: string | null;
  user_id: string;
  position: string;
  company: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}

interface JobAlert {
  id: string;
  user_id: string;
  query: string;
  keywords: string[] | null;
  location: string | null;
  frequency: string;
  created_at: string;
}

// --- Helper Functions ---

const formatStatusLabel = (status: ApplicationStatus): string => {
  return status.charAt(0).toUpperCase() + status.replace('_', ' ').slice(1);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

// --- Child Components ---

// #region Applications Tab Component
interface ApplicationsTabProps {
  applications: Application[];
  isLoading: boolean;
  filterStatus: ApplicationStatus | null;
  onFilterChange: (status: ApplicationStatus | null) => void;
  onStatusChange: (appId: string, newStatus: ApplicationStatus) => void;
  isUpdatingStatus: boolean;
  totalApplicationsCount: number;
  filteredApplicationsCount: number;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = React.memo(({
  applications,
  isLoading,
  filterStatus,
  onFilterChange,
  onStatusChange,
  isUpdatingStatus,
  totalApplicationsCount,
  filteredApplicationsCount,
}) => {
  const navigate = useNavigate();

  const handleNavigateToJob = useCallback((jobId: string | null) => {
    if (jobId) {
      navigate(`/jobs/${jobId}`);
    } else {
      // Optionally show a toast or handle navigation differently if no job_id
      toast.info("No associated job listing found for this application.");
      // Or navigate to a generic application details page: navigate(`/applications/${appId}`)
    }
  }, [navigate]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div className="flex items-center mb-4 md:mb-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="mr-2">
                <Filter className="h-4 w-4 mr-2" />
                {filterStatus ? `Filter: ${formatStatusLabel(filterStatus)}` : "Filter"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="z-50 bg-background border border-border rounded-md shadow-md">
              <DropdownMenuItem onClick={() => onFilterChange(null)}>All Active</DropdownMenuItem>
              {APPLICATION_STATUSES.filter(s => s !== 'archived').map((status) => (
                <DropdownMenuItem key={status} onClick={() => onFilterChange(status)}>
                  {formatStatusLabel(status)}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => onFilterChange('archived')}>Archived</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-sm text-muted-foreground ml-2">
            Showing {filteredApplicationsCount} of {totalApplicationsCount} applications
          </span>
        </div>
        <Button size="sm" onClick={() => navigate('/jobs')}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Find Jobs
        </Button>
      </div>

      {isLoading ? (
        <ApplicationTableSkeleton />
      ) : (
        <div className="border rounded-lg overflow-auto max-h-[450px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    No applications found {filterStatus ? `with status "${formatStatusLabel(filterStatus)}"` : "matching the current filter"}.
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app) => (
                  <TableRow key={app.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell>{app.company}</TableCell>
                    <TableCell className="font-medium">{app.position}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(app.created_at)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={app.status}
                        onValueChange={(value) => onStatusChange(app.id, value as ApplicationStatus)}
                        disabled={isUpdatingStatus}
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {APPLICATION_STATUSES.map(status => (
                            <SelectItem key={status} value={status}>
                              {formatStatusLabel(status)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(app.updated_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      {/* Disable button slightly if no job_id */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleNavigateToJob(app.job_id)}
                        disabled={!app.job_id}
                        title={app.job_id ? "View Job Details" : "No linked job"}
                        className={!app.job_id ? "opacity-50 cursor-not-allowed" : ""}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
});
// #endregion Applications Tab Component


// #region Create Alert Form Component
interface CreateAlertFormProps {
  onCreateAlert: (query: string, location: string, frequency: string) => void;
  isCreatingAlert: boolean;
}

const CreateAlertForm: React.FC<CreateAlertFormProps> = React.memo(({ onCreateAlert, isCreatingAlert }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [frequency, setFrequency] = useState('daily');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter keywords for the alert');
      return;
    }
    onCreateAlert(query.trim(), location.trim(), frequency);
    // Reset form after successful submission (handled via onSuccess in mutation)
    // setQuery(''); setLocation(''); setFrequency('daily'); // Can be done here or in parent
  }, [onCreateAlert, query, location, frequency]);

  return (
    <Card className="glass hover backdrop-blur-xl border-primary/20 shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle>Create Job Alert</CardTitle>
        <CardDescription>
          Get notified when new jobs matching your criteria are posted
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alert-keywords">Keywords</Label>
            <Input
              id="alert-keywords"
              placeholder="e.g. React, Frontend Developer"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="transition-all border-muted/30 focus:border-primary"
              required
              disabled={isCreatingAlert}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alert-location">Location (Optional)</Label>
            <Input
              id="alert-location"
              placeholder="e.g. Remote, New York"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="transition-all border-muted/30 focus:border-primary"
              disabled={isCreatingAlert}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alert-frequency">Alert Frequency</Label>
            <Select
              value={frequency}
              onValueChange={setFrequency}
              disabled={isCreatingAlert}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isCreatingAlert} className="w-full">
            {isCreatingAlert ? <div className="loader-sm mr-2" /> : <Bell className="h-4 w-4 mr-2" />}
            {isCreatingAlert ? 'Creating...' : 'Create Alert'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
});
// #endregion Create Alert Form Component


// #region Alert List Component
interface AlertListProps {
  alerts: JobAlert[];
  isLoading: boolean;
  onUpdateAlert: (alertId: string, frequency: string) => void; // Can add location update later if needed
  onDeleteAlert: (alertId: string) => void;
  isUpdatingAlert: boolean;
  isDeletingAlert: boolean;
}

const AlertList: React.FC<AlertListProps> = React.memo(({
  alerts,
  isLoading,
  onUpdateAlert,
  onDeleteAlert,
  isUpdatingAlert,
  isDeletingAlert
}) => {

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Loading job alerts...</div>;
  }

  if (alerts.length === 0) {
    return (
      <Card className="bg-transparent border">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <X className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">
            No alerts created yet. Create one to stay updated.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Card key={alert.id} className="bg-transparent border transition-all hover:bg-muted/5 rounded-xl">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-grow min-w-0"> {/* Ensure text truncates */}
                <h4 className="font-medium mb-1 truncate" title={alert.query}>
                  {alert.query}
                </h4>
                {alert.location && (
                  <p className="text-sm text-muted-foreground mb-2 truncate" title={alert.location}>
                    {alert.location}
                  </p>
                )}
                <div className="flex items-center text-xs text-muted-foreground flex-wrap">
                  <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span>{alert.frequency}</span>
                  <span className="mx-2">•</span>
                  <span>Created on {formatDate(alert.created_at)}</span>
                </div>
              </div>

              <div className="flex gap-2 items-center flex-shrink-0">
                <Select
                  value={alert.frequency}
                  onValueChange={(frequency) => onUpdateAlert(alert.id, frequency)}
                  disabled={isUpdatingAlert || isDeletingAlert}
                >
                  <SelectTrigger className="w-[120px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteAlert(alert.id)}
                  disabled={isUpdatingAlert || isDeletingAlert}
                  className="h-8 w-8 p-0"
                  title="Delete Alert"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});
// #endregion Alert List Component


// #region Main Progress Component
const Progress = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("applications");
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | null>(null);

  // --- Queries ---
  const { data: applicationsData = [], isLoading: isApplicationsLoading } = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      if (!user?.id) return []; // Guard against missing user ID
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data as Application[];
    },
    enabled: !!user?.id, // Only run query if user exists
  });

  const { data: jobAlerts = [], isLoading: isJobAlertsLoading } = useQuery({
    queryKey: ['job_alerts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('job_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data as JobAlert[];
    },
    enabled: !!user?.id,
  });

  // --- Memoized Calculations ---
  const applicationsCountByStatus = useMemo(() => {
    return APPLICATION_STATUSES.reduce<Record<ApplicationStatus, number>>((acc, status) => {
      acc[status] = applicationsData.filter(app => app.status === status).length;
      return acc;
    }, {} as Record<ApplicationStatus, number>);
  }, [applicationsData]);

  const activeApplicationsCount = useMemo(() => {
    return applicationsData.filter(app => app.status !== 'archived').length;
  }, [applicationsData]);

  const filteredApplications = useMemo(() => {
    if (filterStatus === null) {
      // Show all non-archived by default when filter is null
      return applicationsData.filter(app => app.status !== 'archived');
    }
    return applicationsData.filter(app => app.status === filterStatus);
  }, [applicationsData, filterStatus]);


  // --- Mutations ---
  const commonMutationOptions = {
    onError: (error: any, variables: any, context: any) => {
      toast.error(`Error: ${error.message}`);
      console.error("Mutation Error:", error);
    },
  };

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ApplicationStatus }) => {
      const { error } = await supabase.from('applications').update({ status }).eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applications', user?.id] });
      toast.success(`Application status updated to ${formatStatusLabel(variables.status)}`);
    },
    ...commonMutationOptions,
  });

  const createAlertMutation = useMutation({
    mutationFn: async ({ query, location, frequency }: { query: string; location: string; frequency: string }) => {
      if (!user?.id) throw new Error("User not authenticated");
      const keywordsArray = query.split(',').map(s => s.trim()).filter(s => s.length > 0);
      const { data, error } = await supabase
        .from('job_alerts')
        .insert({
          user_id: user.id,
          query: query,
          keywords: keywordsArray.length > 0 ? keywordsArray : null,
          location: location || null,
          frequency: frequency,
        })
        .select() // Return the created record
        .single(); // Expect a single record
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_alerts', user?.id] });
      toast.success('Job alert created successfully');
      // Form reset can be handled within the CreateAlertForm component upon successful submission signal or here
    },
    ...commonMutationOptions,
  });

  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      if (!user?.id) throw new Error("User not authenticated");
      const { error } = await supabase.from('job_alerts').delete().eq('id', alertId).eq('user_id', user.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_alerts', user?.id] });
      toast.success('Job alert deleted');
    },
    ...commonMutationOptions,
  });

  // Simplified update - only frequency for now based on UI
  const updateAlertMutation = useMutation({
    mutationFn: async ({ id, frequency }: { id: string; frequency: string }) => {
      if (!user?.id) throw new Error("User not authenticated");
      // Can add location update later if needed
      const { error } = await supabase.from('job_alerts').update({ frequency }).eq('id', id).eq('user_id', user.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['job_alerts', user?.id] });
      toast.success(`Alert frequency updated to ${variables.frequency}`);
    },
    ...commonMutationOptions,
  });


  // --- Event Handlers (Memoized) ---
  const handleStatusChange = useCallback((appId: string, newStatus: ApplicationStatus) => {
    updateStatusMutation.mutate({ id: appId, status: newStatus });
  }, [updateStatusMutation]);

  const handleCreateAlert = useCallback((query: string, location: string, frequency: string) => {
    createAlertMutation.mutate({ query, location, frequency });
  }, [createAlertMutation]);

  const handleAlertFrequencyChange = useCallback((alertId: string, frequency: string) => {
    updateAlertMutation.mutate({ id: alertId, frequency });
  }, [updateAlertMutation]);

  const handleDeleteAlert = useCallback((alertId: string) => {
    deleteAlertMutation.mutate(alertId);
  }, [deleteAlertMutation]);

  const handleFilterChange = useCallback((status: ApplicationStatus | null) => {
    setFilterStatus(status);
  }, []);

  // Render null or a loading indicator if user is not yet available
  if (!user) {
    // Can return a specific loading component or null
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12 text-center">Loading user data...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-6 md:py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gradient bg-gradient-to-r from-primary to-primary/70">
              Your Progress
            </h1>
            <p className="text-muted-foreground">
              Track your job applications and manage alerts
            </p>
          </div>
        </div>

        <Tabs
          defaultValue="applications"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-2 w-full md:w-96 glassmorphism">
            {/* Display count of active applications */}
            <TabsTrigger value="applications">
              Applications ({activeApplicationsCount})
            </TabsTrigger>
            <TabsTrigger value="alerts">Job Alerts ({jobAlerts.length})</TabsTrigger>
          </TabsList>

          {/* Applications Tab Content */}
          <TabsContent value="applications">
            <ApplicationsTab
              applications={filteredApplications}
              isLoading={isApplicationsLoading}
              filterStatus={filterStatus}
              onFilterChange={handleFilterChange}
              onStatusChange={handleStatusChange}
              isUpdatingStatus={updateStatusMutation.isPending}
              totalApplicationsCount={applicationsData.length} // Pass total for context message
              filteredApplicationsCount={filteredApplications.length} // Pass filtered count
            />
          </TabsContent>

          {/* Alerts Tab Content */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {/* Create Alert Form */}
              <CreateAlertForm
                onCreateAlert={handleCreateAlert}
                isCreatingAlert={createAlertMutation.isPending}
              />

              {/* Existing Alerts List */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Your Job Alerts</h3>
                <AlertList
                  alerts={jobAlerts}
                  isLoading={isJobAlertsLoading}
                  onUpdateAlert={handleAlertFrequencyChange}
                  onDeleteAlert={handleDeleteAlert}
                  isUpdatingAlert={updateAlertMutation.isPending}
                  isDeletingAlert={deleteAlertMutation.isPending}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Progress;