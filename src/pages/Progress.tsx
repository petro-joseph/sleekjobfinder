
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from '@/lib/store';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ChevronRight, Bell, Clock, Filter, PlusCircle, Check, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

const Progress = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("applications");
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | null>(null);

  // Form state for creating a job alert
  const [newAlertQuery, setNewAlertQuery] = useState('');
  const [newAlertLocation, setNewAlertLocation] = useState('');
  const [newAlertFrequency, setNewAlertFrequency] = useState('daily');

  if (!user) return null;

  // Fetch user's applications excluding archived in counts but including for viewing/editing
  const { data: applications = [], isLoading: isApplicationsLoading } = useQuery<Application[]>({
    queryKey: ['applications', user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from<Application>('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data ?? [];
    }
  });

  // Filter applications by status if filterStatus is set, else show all except archived by default in counts
  const filteredApplications = filterStatus
    ? applications.filter(app => app.status === filterStatus)
    : applications.filter(app => app.status !== 'archived');

  // Group applications by status for UI tabs with counts (excluding archived from total applications count)
  const applicationsCountByStatus = APPLICATION_STATUSES.reduce<Record<ApplicationStatus, number>>((acc, status) => {
    acc[status] = applications.filter(app => app.status === status).length;
    return acc;
  }, {} as Record<ApplicationStatus, number>);

  // Mutation to update status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ApplicationStatus }) => {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);
      if (error) throw new Error(error.message);
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['applications', user.id]);
      toast.success('Application status updated');
    },
    onError: (error: any) => {
      toast.error(`Error updating status: ${error.message}`);
    }
  });

  // Fetch user's job alerts
  const { data: jobAlerts = [], isLoading: isJobAlertsLoading } = useQuery<JobAlert[]>({
    queryKey: ['job_alerts', user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from<JobAlert>('job_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    }
  });

  // Mutation to create job alert
  const createAlertMutation = useMutation({
    mutationFn: async () => {
      const keywordsArray = newAlertQuery
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const { data, error } = await supabase
        .from('job_alerts')
        .insert({
          user_id: user.id,
          query: newAlertQuery,
          keywords: keywordsArray.length > 0 ? keywordsArray : null,
          location: newAlertLocation || null,
          frequency: newAlertFrequency,
        });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['job_alerts', user.id]);
      setNewAlertQuery('');
      setNewAlertLocation('');
      setNewAlertFrequency('daily');
      toast.success('Job alert created');
    },
    onError: (error: any) => {
      toast.error(`Error creating alert: ${error.message}`);
    }
  });

  // Mutation to delete job alert
  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('job_alerts')
        .delete()
        .eq('id', alertId)
        .eq('user_id', user.id);
      if (error) throw new Error(error.message);
      return alertId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['job_alerts', user.id]);
      toast.success('Job alert deleted');
    },
    onError: (error: any) => {
      toast.error(`Error deleting alert: ${error.message}`);
    }
  });

  // Mutation to update job alert frequency (and optionally location)
  const updateAlertMutation = useMutation({
    mutationFn: async (alert: Partial<JobAlert> & { id: string }) => {
      const { id, frequency, location } = alert;
      const { error } = await supabase
        .from('job_alerts')
        .update({ frequency, location })
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw new Error(error.message);
      return alert;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['job_alerts', user.id]);
      toast.success('Job alert updated');
    },
    onError: (error: any) => {
      toast.error(`Error updating alert: ${error.message}`);
    }
  });

  // Handle status change for an application
  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    updateStatusMutation.mutate({ id: appId, status: newStatus });
  };

  // Handle create alert form submit
  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertQuery.trim()) {
      toast.error('Please enter keywords for the alert');
      return;
    }
    createAlertMutation.mutate();
  };

  // Handle alert frequency change
  const handleAlertFrequencyChange = (alertId: string, frequency: string) => {
    updateAlertMutation.mutate({ id: alertId, frequency });
  };

  // Handle alert location change
  const handleAlertLocationChange = (alertId: string, location: string | null) => {
    updateAlertMutation.mutate({ id: alertId, location });
  };

  if (!user) {
    return null; // Will be redirected by auth wrapper
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-6 md:py-12">
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
          <TabsList className="grid grid-cols-2 w-full md:w-80 glassmorphism">
            <TabsTrigger value="applications">
              Applications ({applicationsCountByStatus.applied + applicationsCountByStatus.interview + applicationsCountByStatus.offer_received + applicationsCountByStatus.rejected})
            </TabsTrigger>
            <TabsTrigger value="alerts">Job Alerts ({jobAlerts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div className="flex items-center mb-4 md:mb-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="mr-2">
                      <Filter className="h-4 w-4 mr-2" />
                      {filterStatus ? `Filter: ${filterStatus}` : "Filter"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="z-50 bg-background border border-border rounded-md shadow-md">
                    <DropdownMenuItem onClick={() => setFilterStatus(null)}>All Active</DropdownMenuItem>
                    {APPLICATION_STATUSES.filter(s => s !== 'archived').map((status) => (
                      <DropdownMenuItem key={status} onClick={() => setFilterStatus(status)}>
                        {status.charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem onClick={() => setFilterStatus('archived')}>Archived</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <span className="text-sm text-muted-foreground ml-2">
                  Showing {filteredApplications.length} of {applications.length} applications
                </span>
              </div>

              <Button size="sm" onClick={() => navigate('/jobs')}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Find Jobs
              </Button>
            </div>

            {isApplicationsLoading ? (
              <div className="h-40 flex items-center justify-center p-8">
                <div className="loader" />
              </div>
            ) : (
              <div className="border rounded-lg overflow-auto max-h-[450px]">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-muted/30 border-b">
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Company</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Position</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Applied</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Status</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Last Update</th>
                      <th className="py-3 px-4 text-right font-medium text-muted-foreground text-sm"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4 text-sm">{app.company}</td>
                        <td className="py-3 px-4 text-sm font-medium">{app.position}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {new Date(app.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <Select
                            value={app.status}
                            onValueChange={(value) => handleStatusChange(app.id, value as ApplicationStatus)}
                            className="max-w-[160px]"
                            disabled={updateStatusMutation.isLoading}
                          >
                            {APPLICATION_STATUSES.map(status => (
                              <SelectItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                              </SelectItem>
                            ))}
                          </Select>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {new Date(app.updated_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/jobs/${app.job_id || ''}`)}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}

                    {filteredApplications.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          No applications found for this filter. Try another status.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Create Job Alert Card */}
              <Card className="glass hover backdrop-blur-xl border-primary/20 shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle>Create Job Alert</CardTitle>
                  <CardDescription>
                    Get notified when new jobs matching your criteria are posted
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleCreateAlert}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="alert-keywords">Keywords</Label>
                      <Input
                        id="alert-keywords"
                        placeholder="e.g. React, Frontend Developer"
                        value={newAlertQuery}
                        onChange={(e) => setNewAlertQuery(e.target.value)}
                        className="transition-all border-muted/30 focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alert-location">Location (Optional)</Label>
                      <Input
                        id="alert-location"
                        placeholder="e.g. Remote, New York"
                        value={newAlertLocation}
                        onChange={(e) => setNewAlertLocation(e.target.value)}
                        className="transition-all border-muted/30 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alert-frequency">Alert Frequency</Label>
                      <Select
                        id="alert-frequency"
                        value={newAlertFrequency}
                        onValueChange={setNewAlertFrequency}
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
                    <Button type="submit" disabled={createAlertMutation.isLoading} className="w-full">
                      <Bell className="h-4 w-4 mr-2" />
                      Create Alert
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              {/* Display Existing Alerts */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Your Job Alerts</h3>

                {isJobAlertsLoading ? (
                  <div className="p-4 text-center text-muted-foreground">Loading job alerts...</div>
                ) : (
                  jobAlerts.length === 0 ? (
                    <Card className="bg-transparent border">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <X className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                          No alerts created yet. Create your first job alert to stay updated.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    jobAlerts.map((alert) => (
                      <Card key={alert.id} className="bg-transparent border transition-all hover:bg-muted/5 rounded-xl">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium mb-1 truncate" title={alert.query}>
                                {alert.query}
                              </h4>
                              {alert.location && (
                                <p className="text-sm text-muted-foreground mb-2 truncate" title={alert.location}>
                                  {alert.location}
                                </p>
                              )}
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {alert.frequency}
                                <span className="mx-2">•</span>
                                Created on {new Date(alert.created_at).toLocaleDateString()}
                              </div>
                            </div>

                            <div className="flex gap-2 items-center">
                              <Select
                                value={alert.frequency}
                                onValueChange={(frequency) => handleAlertFrequencyChange(alert.id, frequency)}
                                className="max-w-[120px]"
                              >
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                              </Select>
                              <Button variant="ghost" size="sm" onClick={() => deleteAlertMutation.mutate(alert.id)} className="h-8 w-8 p-0">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

// Wrap with ProtectedRoute component
const ProtectedProgressPage = () => (
  <ProtectedRoute>
    <Progress />
  </ProtectedRoute>
);

export default ProtectedProgressPage;
