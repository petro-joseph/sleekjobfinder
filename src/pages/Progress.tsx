
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/lib/store';
import { jobs } from '@/data/jobs';
import { toast } from 'sonner';
import {
  Briefcase,
  Bell,
  AlertCircle,
  Clock,
  CheckCircle,
  BarChart3,
  Search,
  Plus,
  X,
  FileText,
  ExternalLink,
} from 'lucide-react';

const Progress = () => {
  const { user, addAlert, toggleAlert } = useAuthStore();
  const [newAlertQuery, setNewAlertQuery] = useState('');
  const [newAlertFrequency, setNewAlertFrequency] = useState<'daily' | 'weekly'>('daily');

  // Get application data with job details
  const applications = user?.applications.map(app => {
    const jobData = jobs.find(j => j.id === app.jobId);
    return {
      ...app,
      job: jobData
    };
  }) || [];

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    
    addAlert(newAlertQuery, newAlertFrequency);
    setNewAlertQuery('');
    toast.success("Job alert created");
  };

  const handleToggleAlert = (alertId: string) => {
    toggleAlert(alertId);
    toast.success("Alert status updated");
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const staggerItems = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Application Progress</h1>
            <p className="text-muted-foreground">
              Track your job applications and set up alerts for new opportunities
            </p>
          </motion.div>

          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="applications">
                <Briefcase className="h-4 w-4 mr-2" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="alerts">
                <Bell className="h-4 w-4 mr-2" />
                Job Alerts
              </TabsTrigger>
            </TabsList>

            {/* Applications Tab */}
            <TabsContent value="applications">
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="bg-card rounded-xl border shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                      Your Applications
                    </h3>
                    <Button asChild size="sm">
                      <Link to="/jobs">
                        <Search className="h-4 w-4 mr-2" />
                        Find Jobs
                      </Link>
                    </Button>
                  </div>
                </div>

                {applications.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Applied On</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <motion.div
                          variants={staggerItems}
                          initial="hidden"
                          animate="visible"
                          component={null}
                        >
                          {applications.map(app => (
                            <motion.tr
                              key={app.jobId}
                              variants={fadeInUp}
                              className="border-b"
                            >
                              <TableCell className="font-medium py-4">
                                {app.job?.title || "Unknown Job"}
                              </TableCell>
                              <TableCell>{app.job?.company || "Unknown Company"}</TableCell>
                              <TableCell>{app.date}</TableCell>
                              <TableCell>
                                <Badge 
                                  className={
                                    app.status === 'interview' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                    app.status === 'reviewing' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                    app.status === 'offered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                    app.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                    'bg-primary/10 text-primary border-primary/20'
                                  }
                                >
                                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button asChild size="sm" variant="ghost">
                                  <Link to={`/jobs/${app.jobId}`}>
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View
                                  </Link>
                                </Button>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </motion.div>
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-10 text-center">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No applications yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      Start applying to jobs to track your application progress and status updates
                    </p>
                    <Button asChild>
                      <Link to="/jobs">Browse Jobs</Link>
                    </Button>
                  </div>
                )}
              </motion.div>

              {applications.length > 0 && (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"
                >
                  <ApplicationsStat
                    icon={<Clock className="h-5 w-5 text-amber-500" />}
                    label="Pending"
                    value={applications.filter(a => ['applied', 'reviewing'].includes(a.status)).length}
                    color="bg-amber-500/10"
                  />
                  <ApplicationsStat
                    icon={<CheckCircle className="h-5 w-5 text-blue-500" />}
                    label="Interviewing"
                    value={applications.filter(a => a.status === 'interview').length}
                    color="bg-blue-500/10"
                  />
                  <ApplicationsStat
                    icon={<Briefcase className="h-5 w-5 text-green-500" />}
                    label="Offers"
                    value={applications.filter(a => a.status === 'offered').length}
                    color="bg-green-500/10"
                  />
                </motion.div>
              )}

              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="bg-card rounded-xl border shadow-sm mt-6"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Application Tips</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border bg-secondary/30">
                      <h4 className="font-medium mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-primary" />
                        Optimize Your Resume
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Tailor your resume for each application to highlight relevant skills.
                      </p>
                      <Button asChild variant="link" size="sm" className="mt-2 p-0">
                        <Link to="/resume-builder">Update Resume</Link>
                      </Button>
                    </div>
                    <div className="p-4 rounded-lg border bg-secondary/30">
                      <h4 className="font-medium mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                        Follow Up
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Send a follow-up email 1-2 weeks after applying to show your continued interest.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="md:col-span-2"
                >
                  <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Bell className="h-5 w-5 mr-2 text-primary" />
                        Your Job Alerts
                      </h3>
                    </div>

                    {user?.alerts && user.alerts.length > 0 ? (
                      <div className="p-6">
                        <motion.div
                          variants={staggerItems}
                          initial="hidden"
                          animate="visible"
                          className="space-y-4"
                        >
                          {user.alerts.map(alert => (
                            <motion.div
                              key={alert.id}
                              variants={fadeInUp}
                              className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/20 hover:bg-primary/5 transition-colors"
                            >
                              <div>
                                <h4 className="font-medium">{alert.query}</h4>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                  <span>{alert.frequency === 'daily' ? 'Daily' : 'Weekly'} updates</span>
                                  <Badge
                                    variant="outline"
                                    className={alert.active ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}
                                  >
                                    {alert.active ? 'Active' : 'Paused'}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleToggleAlert(alert.id)}
                                >
                                  {alert.active ? 'Pause' : 'Activate'}
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground"
                                  onClick={() => toast.info("Feature coming soon")}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    ) : (
                      <div className="p-10 text-center">
                        <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No job alerts yet</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                          Create your first job alert to get notified when new matching jobs are posted
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="md:col-span-1"
                >
                  <div className="bg-card rounded-xl border shadow-sm">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Plus className="h-5 w-5 mr-2 text-primary" />
                        Create Job Alert
                      </h3>
                    </div>
                    <form onSubmit={handleAddAlert} className="p-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="query">Search Term</Label>
                          <Input
                            id="query"
                            value={newAlertQuery}
                            onChange={(e) => setNewAlertQuery(e.target.value)}
                            placeholder="e.g. React Developer"
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="frequency">Frequency</Label>
                          <Select
                            value={newAlertFrequency}
                            onValueChange={(value) => setNewAlertFrequency(value as 'daily' | 'weekly')}
                          >
                            <SelectTrigger id="frequency" className="bg-background">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button type="submit" className="w-full mt-6">
                        Create Alert
                      </Button>
                    </form>
                  </div>

                  <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 mt-6">
                    <h3 className="font-semibold mb-3">Why Create Job Alerts?</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Get notified about new matching jobs</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Be one of the first to apply</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Save time on job searching</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

// Helper component for application stats
const ApplicationsStat = ({ 
  icon,
  label,
  value,
  color
}: { 
  icon: React.ReactNode, 
  label: string, 
  value: number,
  color: string
}) => (
  <div className={`p-6 rounded-xl border ${color}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold">{label}</h3>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  </div>
);

export default Progress;
