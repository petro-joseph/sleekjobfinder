import React, { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { User, Resume, DbProfile, mapProfileToUser } from '@/lib/store';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { SalaryRange } from '@/components/ui/SalaryRange';
import { NotificationSettings } from '@/components/ui/NotificationSettings';
import ResumeManagement from '@/components/ResumeManagement';
import { UserPreferencesSkeleton } from '@/components/jobs/LoadingState';
import { COUNTRIES, JOB_TYPES, INDUSTRIES } from '@/constants';

// Types
interface JobPreferences {
  locations: string[];
  jobTypes: string[];
  industries: string[];
  salary_range: { min: number; max: number; currency: string };
}

interface FormData {
  locations: string[];
  jobTypes: string[];
  industries: string[];
  salaryMin: string;
  currency: string;
}

interface NotificationSettingsType {
  notifications: boolean;
  emailUpdates: boolean;
  darkMode: boolean;
}

// Schema
const formSchema = z.object({
  locations: z.array(z.string()).min(1, 'Select at least one location'),
  jobTypes: z.array(z.string()).min(1, 'Select at least one job type'),
  industries: z.array(z.string()).min(1, 'Select at least one industry'),
  salaryMin: z.string().refine(val => !isNaN(parseInt(val.replace(/,/g, ''))), { message: 'Must be a number' }),
  currency: z.string().min(1, 'Select a currency'),
});

// Utility to clean thousand separators
const cleanNumber = (value: string): string => value.replace(/,/g, '');

// Main Component
const UserPreferences = memo(() => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsType>({
    notifications: false,
    emailUpdates: false,
    darkMode: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      locations: [],
      jobTypes: [],
      industries: [],
      salaryMin: '50000',
      currency: 'USD',
    },
  });

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
          toast.error('Please log in');
          navigate('/login');
          return;
        }

        const [profileData, resumesData] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle(),
          supabase.from('resumes').select('*').eq('user_id', authUser.id),
        ]);

        if (profileData.error || resumesData.error) {
          throw new Error('Failed to fetch data');
        }

        const profile = profileData.data as DbProfile;
        const resumes = resumesData.data?.map((resume: any) => ({
          id: resume.id,
          name: resume.name,
          file_path: resume.file_path,
          isPrimary: resume.is_primary,
          created_at: resume.created_at,
          updated_at: resume.updated_at,
          uploadDate: resume.upload_date || resume.created_at,
        })) || [];

        setNotificationSettings(profile.settings || {
          notifications: false,
          emailUpdates: false,
          darkMode: false,
        });
        setResumes(resumes);
        setUser(mapProfileToUser(profile, [], resumes));

        form.reset({
          locations: profile.job_preferences?.locations || [],
          jobTypes: profile.job_preferences?.job_types || [],
          industries: profile.job_preferences?.industries || [],
          salaryMin: profile.job_preferences?.salary_range?.min?.toString() || '50000',
          currency: profile.job_preferences?.salary_range?.currency || 'USD',
        });
      } catch (error) {
        toast.error('Failed to load preferences');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, form]);

  // Form submission
  const onSubmit = async (data: FormData) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('User not authenticated');

      // Validate mandatory CV upload
      if (resumes.length === 0) {
        toast.error('Please upload at least one resume');
        return;
      }

      // Check if all fields are filled
      const isComplete = (
        data.locations.length > 0 &&
        data.jobTypes.length > 0 &&
        data.industries.length > 0 &&
        data.salaryMin !== '' &&
        data.currency !== '' &&
        resumes.length > 0
      );

      const updates: Partial<DbProfile> = {
        job_preferences: {
          locations: data.locations,
          job_types: data.jobTypes,
          industries: data.industries,
          salary_range: {
            min: parseInt(cleanNumber(data.salaryMin)),
            max: 100000000, // Assuming a default max value
            currency: data.currency,
          },
        },
        settings: notificationSettings,
      };

      // Only set onboarding complete if all fields are filled
      if (isComplete) {
        updates.onboarding_step = 3;
        updates.is_onboarding_complete = true;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', authUser.id);

      if (error) throw error;

      toast.success('Preferences saved');
      navigate('/dashboard');
    } catch (error) {
      toast.error(`Failed to save preferences: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <UserPreferencesSkeleton />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Job Preferences</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MultiSelect
                  form={form}
                  name="locations"
                  label="Locations"
                  options={COUNTRIES}
                  placeholder="Select countries..."
                />
                <MultiSelect
                  form={form}
                  name="jobTypes"
                  label="Job Types"
                  options={JOB_TYPES}
                  placeholder="Select job types..."
                  checkbox
                />
                <MultiSelect
                  form={form}
                  name="industries"
                  label="Industries"
                  options={INDUSTRIES}
                  placeholder="Select industries..."
                />
                <SalaryRange form={form} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResumeManagement
                  resumes={resumes}
                  setResumes={setResumes}
                  userId={user?.id}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <NotificationSettings
                  settings={notificationSettings}
                  onChange={setNotificationSettings}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" className="h-12 text-lg px-6">Save</Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
});

export default UserPreferences;