import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';
import { ApplicationStatus, APPLICATION_STATUSES } from '@/types/progress';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Custom hooks
import { useProgressQueries } from '@/hooks/useProgressQueries';
import { useProgressMutations } from '@/hooks/useProgressMutations';

// Modularized components
import ApplicationsTab from '@/components/progress/ApplicationsTab';
import CreateAlertForm from '@/components/progress/CreateAlertForm';
import AlertList from '@/components/progress/AlertList';

const Progress = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("applications");
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | null>(null);

  // Use our custom hooks for data fetching and mutations
  const { 
    applications, 
    isApplicationsLoading, 
    jobAlerts,
    isJobAlertsLoading,
    getFilteredApplications,
    activeApplicationsCount
  } = useProgressQueries(user?.id);

  const {
    updateStatusMutation,
    createAlertMutation,
    deleteAlertMutation,
    updateAlertMutation
  } = useProgressMutations(user?.id);

  // Calculate filtered applications based on current filter
  const filteredApplications = getFilteredApplications(applications, filterStatus);

  // --- Event Handlers ---
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
              totalApplicationsCount={applications.length}
              filteredApplicationsCount={filteredApplications.length}
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
