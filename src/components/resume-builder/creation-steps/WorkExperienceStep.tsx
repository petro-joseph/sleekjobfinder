
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../ui/button';
import { ChevronRight } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Resume } from '@/types/resume';
import { Separator } from '../../ui/separator';

const workExperienceSchema = z.object({
  workExperiences: z.array(
    z.object({
      company: z.string().min(1, "Company name is required"),
      title: z.string().min(1, "Job title is required"),
      location: z.string().min(1, "Location is required"),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().optional(),
      responsibilities: z.array(z.string()),
    })
  ).min(1, "At least one work experience is required"),
});

type WorkExperienceFormValues = z.infer<typeof workExperienceSchema>;

interface WorkExperienceStepProps {
  data: Partial<Resume>;
  onNext: (data: Partial<Resume>) => void;
}

export const WorkExperienceStep: React.FC<WorkExperienceStepProps> = ({ data, onNext }) => {
  const form = useForm<WorkExperienceFormValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      workExperiences: data.workExperiences || [
        {
          company: '',
          title: '',
          location: '',
          startDate: '',
          endDate: '',
          responsibilities: [''],
        },
      ],
    },
  });

  const onSubmit = (values: WorkExperienceFormValues) => {
    onNext(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Add your relevant work history, starting with your most recent position.
          </p>

          {form.getValues().workExperiences.map((_, index) => (
            <div key={index} className="space-y-4 mb-6">
              <h3 className="font-medium">Experience {index + 1}</h3>
              <Separator className="mb-4" />
              
              <FormField
                control={form.control}
                name={`workExperiences.${index}.company`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`workExperiences.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Your job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`workExperiences.${index}.location`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, State or Remote" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`workExperiences.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input placeholder="MM/YYYY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`workExperiences.${index}.endDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date (or "Present")</FormLabel>
                      <FormControl>
                        <Input placeholder="MM/YYYY or Present" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

          <Button 
            type="button" 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => {
              const currentExperiences = form.getValues().workExperiences;
              form.setValue('workExperiences', [
                ...currentExperiences,
                {
                  company: '',
                  title: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  responsibilities: [''],
                },
              ]);
            }}
          >
            Add Another Work Experience
          </Button>
        </div>

        <Button type="submit" className="w-full">
          Next Step
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
};
