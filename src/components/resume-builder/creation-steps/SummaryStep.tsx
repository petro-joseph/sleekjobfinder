
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
import { Resume } from '@/types/resume';
import { Textarea } from '../../ui/textarea';

const summarySchema = z.object({
  summary: z.string().min(50, "Your professional summary should be at least 50 characters")
    .max(1000, "Your professional summary should not exceed 1000 characters"),
});

type SummaryFormValues = z.infer<typeof summarySchema>;

interface SummaryStepProps {
  data: Partial<Resume>;
  onNext: (data: Partial<Resume>) => void;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({ data, onNext }) => {
  const form = useForm<SummaryFormValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: data.summary || '',
    },
  });

  const onSubmit = (values: SummaryFormValues) => {
    onNext(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Professional Summary</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Write a concise summary highlighting your expertise, experience, and career achievements.
            This will appear at the top of your resume.
          </p>

          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Summary</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Experienced software engineer with 5+ years of expertise in developing scalable web applications using modern technologies..."
                    className="min-h-32"
                    {...field} 
                  />
                </FormControl>
                <div className="flex justify-between mt-1">
                  <FormMessage />
                  <p className={`text-xs ${
                    field.value.length > 1000 ? 'text-destructive' : 
                    field.value.length < 50 ? 'text-amber-500' : 
                    'text-muted-foreground'
                  }`}>
                    {field.value.length}/1000
                  </p>
                </div>
              </FormItem>
            )}
          />

          <div className="bg-muted/50 p-4 rounded-md mt-8">
            <h3 className="text-sm font-medium mb-2">Tips for a great summary:</h3>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>Keep it concise and focused on your most relevant qualifications</li>
              <li>Highlight your years of experience and areas of expertise</li>
              <li>Mention key achievements that set you apart</li>
              <li>Tailor it to your target role and industry</li>
              <li>Use active language and avoid generic phrases</li>
            </ul>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Finish Resume
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
};
