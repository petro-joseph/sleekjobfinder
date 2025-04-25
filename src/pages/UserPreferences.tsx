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
import { COUNTRIES, JOB_TYPES, INDUSTRIES } from '@/constants';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Types
interface JobPreferences {
  locations: string[];
  jobTypes: string[];
  industries: string[];
  salaryRange: { min: number; max: number };
}

interface FormData {
  locations: string[];
  jobTypes: string[];
  industries: string[];
  salaryMin: string;
  salaryMax: string;
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
  salaryMin: z.string().refine(val => !isNaN(parseInt(val)), { message: 'Must be a number' }),
  salaryMax: z.string().refine(val => !isNaN(parseInt(val)), { message: 'Must be a number' }),
});

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
      salaryMax: '100000',
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
          salaryMax: profile.job_preferences?.salary_range?.max?.toString() || '100000',
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
        data.salaryMax !== '' &&
        resumes.length > 0
      );

      const updates: Partial<DbProfile> = {
        job_preferences: {
          locations: data.locations,
          job_types: data.jobTypes,
          industries: data.industries,
          salary_range: {
            min: parseInt(data.salaryMin),
            max: parseInt(data.salaryMax),
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
      toast.error('Failed to save preferences');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton height={32} width={256} className="mb-6" />
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton height={24} width={128} />
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <Skeleton height={16} width={96} className="mb-2" />
                  <Skeleton height={40} width="100%" />
                </div>
                <div>
                  <Skeleton height={16} width={96} className="mb-2" />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} height={24} width="100%" />
                    ))}
                  </div>
                </div>
                <div>
                  <Skeleton height={16} width={96} className="mb-2" />
                  <Skeleton height={40} width="100%" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Skeleton height={16} width={128} className="mb-2" />
                    <Skeleton height={40} width="100%" />
                  </div>
                  <div>
                    <Skeleton height={16} width={128} className="mb-2" />
                    <Skeleton height={40} width="100%" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton height={24} width={128} />
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-6">
                  <Skeleton height={32} width={32} className="mx-auto mb-2" />
                  <Skeleton height={16} width={256} className="mx-auto mb-1" />
                  <Skeleton height={12} width={192} className="mx-auto" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton height={24} width={128} />
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="flex justify-between">
                    <Skeleton height={16} width={160} />
                    <Skeleton height={24} width={40} />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton height={16} width={160} />
                    <Skeleton height={24} width={40} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Skeleton height={40} width={100} className="ml-auto" />
          </div>
        </div>
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
              <CardContent className="space-y-8">
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

            <Button type="submit" className="w-full md:w-auto">Save</Button>
          </form>
        </Form>
      </div>
    </Layout>
  );
});

export default UserPreferences;