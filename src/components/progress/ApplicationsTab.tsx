
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Application, ApplicationStatus, APPLICATION_STATUSES } from '@/types/progress';
import { formatStatusLabel, formatDate } from '@/utils/progressHelpers';

// UI Components
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronRight, Filter, PlusCircle } from 'lucide-react';
import { TableSkeleton } from '@/components/jobs/LoadingState';

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
      toast.info("No associated job listing found for this application.");
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
        <TableSkeleton />
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

export default ApplicationsTab;
