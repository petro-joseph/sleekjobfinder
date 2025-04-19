
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../ui/button';
import { ChevronRight, X } from 'lucide-react';
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

const skillsSchema = z.object({
  skills: z.array(z.string()).min(3, "Please add at least 3 skills"),
  yearsOfExperience: z.number().min(0, "Years of experience must be 0 or higher"),
  industries: z.array(z.string()).min(1, "Please add at least one industry"),
  currentSkill: z.string().optional(),
  currentIndustry: z.string().optional(),
});

type SkillsFormValues = z.infer<typeof skillsSchema>;

interface SkillsStepProps {
  data: Partial<Resume>;
  onNext: (data: Partial<Resume>) => void;
}

export const SkillsStep: React.FC<SkillsStepProps> = ({ data, onNext }) => {
  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: data.skills || [],
      yearsOfExperience: data.yearsOfExperience || 0,
      industries: data.industries || [],
      currentSkill: '',
      currentIndustry: '',
    },
  });

  const addSkill = () => {
    const currentSkill = form.getValues('currentSkill');
    if (currentSkill && currentSkill.trim() !== '') {
      const currentSkills = form.getValues('skills');
      if (!currentSkills.includes(currentSkill.trim())) {
        form.setValue('skills', [...currentSkills, currentSkill.trim()]);
      }
      form.setValue('currentSkill', '');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues('skills');
    form.setValue('skills', currentSkills.filter(skill => skill !== skillToRemove));
  };

  const addIndustry = () => {
    const currentIndustry = form.getValues('currentIndustry');
    if (currentIndustry && currentIndustry.trim() !== '') {
      const currentIndustries = form.getValues('industries');
      if (!currentIndustries.includes(currentIndustry.trim())) {
        form.setValue('industries', [...currentIndustries, currentIndustry.trim()]);
      }
      form.setValue('currentIndustry', '');
    }
  };

  const removeIndustry = (industryToRemove: string) => {
    const currentIndustries = form.getValues('industries');
    form.setValue('industries', currentIndustries.filter(industry => industry !== industryToRemove));
  };

  const onSubmit = (values: SkillsFormValues) => {
    // Extract only the fields we need for Resume
    const { skills, yearsOfExperience, industries } = values;
    onNext({ skills, yearsOfExperience, industries });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Skills & Expertise</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Add your professional skills, years of experience, and industries you've worked in.
          </p>

          <FormField
            control={form.control}
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="1"
                    placeholder="0" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mb-6">
            <FormLabel>Skills</FormLabel>
            <div className="flex gap-2 mb-2">
              <FormField
                control={form.control}
                name="currentSkill"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input 
                        placeholder="Add a skill (e.g., JavaScript, Project Management)" 
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="button" 
                onClick={addSkill}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.watch('skills').map((skill, index) => (
                <div 
                  key={index}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-1"
                >
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => removeSkill(skill)}
                    className="text-secondary-foreground/70 hover:text-secondary-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            {form.formState.errors.skills && (
              <p className="text-sm font-medium text-destructive mt-2">
                {form.formState.errors.skills.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <FormLabel>Industries</FormLabel>
            <div className="flex gap-2 mb-2">
              <FormField
                control={form.control}
                name="currentIndustry"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input 
                        placeholder="Add an industry (e.g., Technology, Healthcare)" 
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addIndustry();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="button" 
                onClick={addIndustry}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.watch('industries').map((industry, index) => (
                <div 
                  key={index}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-1"
                >
                  {industry}
                  <button 
                    type="button" 
                    onClick={() => removeIndustry(industry)}
                    className="text-secondary-foreground/70 hover:text-secondary-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            {form.formState.errors.industries && (
              <p className="text-sm font-medium text-destructive mt-2">
                {form.formState.errors.industries.message}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Next Step
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
};
