
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../ui/button';
import { ChevronRight } from 'lucide-react';
import { Input } from '../../ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Resume } from '@/types/resume';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  contactInfo: z.object({
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    linkedin: z.string().url("Please enter a valid LinkedIn URL").optional(),
  }),
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
});

type PersonalInfoForm = z.infer<typeof formSchema>;

interface PersonalInfoStepProps {
  data: Partial<Resume>;
  onNext: (data: Partial<Resume>) => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, onNext }) => {
  const form = useForm<PersonalInfoForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name || '',
      contactInfo: {
        email: data.contactInfo?.email || '',
        phone: data.contactInfo?.phone || '',
        linkedin: data.contactInfo?.linkedin || '',
      },
      jobTitle: data.jobTitle || '',
    },
  });

  const onSubmit = (values: PersonalInfoForm) => {
    onNext(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactInfo.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactInfo.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="(123) 456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactInfo.linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/in/johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="Software Engineer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          Next Step
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
};
