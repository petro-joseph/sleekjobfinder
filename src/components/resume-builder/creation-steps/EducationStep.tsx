
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
import { Resume, Education } from '@/types/resume';
import { Separator } from '../../ui/separator';

const educationSchema = z.object({
  education: z.array(
    z.object({
      institution: z.string().min(1, "Institution name is required"),
      degree: z.string().min(1, "Degree is required"),
      field: z.string().optional(),
      gpa: z.string().optional(),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().min(1, "End date is required"),
    })
  ).min(1, "At least one education entry is required"),
});

type EducationFormValues = z.infer<typeof educationSchema>;

interface EducationStepProps {
  data: Partial<Resume>;
  onNext: (data: Partial<Resume>) => void;
}

export const EducationStep: React.FC<EducationStepProps> = ({ data, onNext }) => {
  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: data.education || [
        {
          institution: '',
          degree: '',
          field: '',
          gpa: '',
          startDate: '',
          endDate: '',
        },
      ],
    },
  });

  const onSubmit = (values: EducationFormValues) => {
    // Ensure all required fields are present for the Education type
    const education: Education[] = values.education.map(edu => ({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      gpa: edu.gpa,
      startDate: edu.startDate,
      endDate: edu.endDate,
    }));
    
    onNext({ education });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Education</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Add your educational background, starting with your most recent degree.
          </p>

          {form.getValues().education.map((_, index) => (
            <div key={index} className="space-y-4 mb-6">
              <h3 className="font-medium">Education {index + 1}</h3>
              <Separator className="mb-4" />
              
              <FormField
                control={form.control}
                name={`education.${index}.institution`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input placeholder="University or school name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`education.${index}.degree`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Bachelor of Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`education.${index}.field`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`education.${index}.gpa`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GPA (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 3.8/4.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`education.${index}.startDate`}
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
                  name={`education.${index}.endDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date (or Expected)</FormLabel>
                      <FormControl>
                        <Input placeholder="MM/YYYY" {...field} />
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
              const currentEducation = form.getValues().education;
              form.setValue('education', [
                ...currentEducation,
                {
                  institution: '',
                  degree: '',
                  field: '',
                  gpa: '',
                  startDate: '',
                  endDate: '',
                },
              ]);
            }}
          >
            Add Another Education
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
