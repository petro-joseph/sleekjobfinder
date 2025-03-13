import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { jobs } from '@/data/jobs';
import { Briefcase, Bell, AlertTriangle, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';

const Progress = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState([
    { jobId: '1', status: 'reviewing', date: '2024-03-10' },
    { jobId: '2', status: 'interview', date: '2024-03-15' },
    { jobId: '3', status: 'offered', date: '2024-03-20' },
    { jobId: '4', status: 'rejected', date: '2024-03-25' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleStatusUpdate = (jobId: string, newStatus: string) => {
    setApplications(applications.map(app =>
      app.jobId === jobId ? { ...app, status: newStatus } : app
    ));
    toast({
      title: "Status Updated",
      description: `Application status updated to ${newStatus}`,
    });
  };

  const handleApplicationDelete = (jobId: string) => {
    setApplications(applications.filter(app => app.jobId !== jobId));
    toast({
      title: "Application Deleted",
      description: "Application has been removed from your list.",
    });
  };

  const filteredApplications = applications.filter(application => {
    const job = jobs.find(j => j.id === application.jobId);
    if (!job) return false;
    return job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           job.company.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const statusColors = {
    reviewing: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    interview: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    offered: 'bg-green-500/10 text-green-500 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Application Progress</h1>
          <p className="text-muted-foreground">Track the status of your job applications</p>
        </motion.div>

        <div className="mb-6 flex items-center justify-between">
          <Input
            type="text"
            placeholder="Search by job title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Button variant="outline" onClick={toggleSortOrder}>
            <Calendar className="w-4 h-4 mr-2" />
            Sort by Date ({sortOrder === 'asc' ? 'Asc' : 'Desc'})
          </Button>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          initial="hidden"
          animate="visible"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedApplications.length > 0 ? (
                sortedApplications.map((application) => {
                  const job = jobs.find(j => j.id === application.jobId);
                  if (!job) return null;

                  return (
                    <TableRow key={application.jobId}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[application.status as keyof typeof statusColors] || 'bg-primary/10 text-primary border-primary/20'}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                        <span className="ml-2 text-muted-foreground">{application.date}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Update Status
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Update Application Status</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Choose the new status for your application.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogBody 
                                jobId={job.id} 
                                onStatusUpdate={handleStatusUpdate} 
                                onClose={() => {}}
                              />
                            </AlertDialogContent>
                          </AlertDialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your application from our records.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleApplicationDelete(job.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </Layout>
  );
};

interface AlertDialogBodyProps {
  jobId: string;
  onStatusUpdate: (jobId: string, newStatus: string) => void;
  onClose: () => void;
}

const AlertDialogBody: React.FC<AlertDialogBodyProps> = ({ jobId, onStatusUpdate, onClose }) => {
  const [status, setStatus] = useState('reviewing');

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handleSubmit = () => {
    onStatusUpdate(jobId, status);
    onClose();
  };

  return (
    <AlertDialogFooter>
      <select
        value={status}
        onChange={handleStatusChange}
        className="border rounded px-4 py-2"
      >
        <option value="reviewing">Reviewing</option>
        <option value="interview">Interview</option>
        <option value="offered">Offered</option>
        <option value="rejected">Rejected</option>
      </select>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <Button onClick={handleSubmit}>Update</Button>
    </AlertDialogFooter>
  );
};

export default Progress;
