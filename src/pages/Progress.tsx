
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from '@/lib/store';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { 
  ChevronRight, 
  ChevronLeft, 
  PlusCircle, 
  Bell, 
  Clock, 
  Filter, 
  CheckCircle, 
  XCircle,
  MailOpen,
  MailQuestion
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Progress = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("applications");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  if (!user) return null;

  const sortedApplications = [...user.applications].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  const filteredApplications = filterStatus
    ? sortedApplications.filter(app => app.status === filterStatus)
    : sortedApplications;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
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
          <TabsList className="grid grid-cols-2 w-full md:w-80">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="alerts">Job Alerts</TabsTrigger>
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
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                      All Applications
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("reviewed")}>
                      Reviewed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("interview")}>
                      Interview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("rejected")}>
                      Rejected
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("accepted")}>
                      Accepted
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <span className="text-sm text-muted-foreground">
                  Showing {filteredApplications.length} of {user.applications.length} applications
                </span>
              </div>
              
              <Button size="sm" onClick={() => navigate('/jobs')}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Find Jobs
              </Button>
            </div>
            
            <div className="rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
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
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            app.status === 'interview' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                            app.status === 'accepted' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                            app.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {new Date(app.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/jobs/${app.jobId || ''}`)}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}

                    {filteredApplications.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          No applications found. Start applying to jobs!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass hover backdrop-blur-xl border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle>Create Job Alert</CardTitle>
                  <CardDescription>
                    Get notified when new jobs matching your criteria are posted
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="alert-keywords">Keywords</Label>
                    <Input 
                      id="alert-keywords" 
                      placeholder="e.g. React, Frontend Developer" 
                      className="transition-all border-muted/30 focus:border-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="alert-location">Location (Optional)</Label>
                    <Input 
                      id="alert-location" 
                      placeholder="e.g. Remote, New York" 
                      className="transition-all border-muted/30 focus:border-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="alert-frequency">Alert Frequency</Label>
                    <Select defaultValue="daily">
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
                  <Button className="w-full">
                    <Bell className="h-4 w-4 mr-2" />
                    Create Alert
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Your Job Alerts</h3>
                
                {user.alerts.map((alert) => (
                  <Card key={alert.id} className="bg-transparent border transition-all hover:bg-muted/5">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium mb-1">
                            {alert.query}
                          </h4>
                          {alert.location && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {alert.location}
                            </p>
                          )}
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {alert.frequency}
                            <span className="mx-2">•</span>
                            Created on {new Date(alert.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {user.alerts.length === 0 && (
                  <Card className="bg-transparent border">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <MailQuestion className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        No alerts created yet. Create your first job alert to stay updated.
                      </p>
                    </CardContent>
                  </Card>
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
