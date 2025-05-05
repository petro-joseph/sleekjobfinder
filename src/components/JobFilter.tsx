
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, Loader2 } from 'lucide-react';
import { JobFilters } from '@/api/jobs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface JobFilterProps {
  filters: JobFilters;
  onFilterChange: (filters: Partial<JobFilters>) => void;
  onResetFilters: () => void;
  onJobTypeToggle: (type: string, isSelected: boolean) => void;
  onExpLevelToggle: (level: string, isSelected: boolean) => void;
  jobTypes: Record<string, boolean>;
  expLevels: Record<string, boolean>;
  isPending?: boolean;
}

const JobFilter = ({ 
  filters,
  onFilterChange,
  onResetFilters,
  onJobTypeToggle,
  onExpLevelToggle,
  jobTypes,
  expLevels,
  isPending
}: JobFilterProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSearchSubmit = () => {
    onFilterChange({ searchTerm });
    setOpen(false);
  };

  const handleSalaryChange = (value: number[]) => {
    if (value.length >= 2) {
      onFilterChange({ salaryRange: [value[0], value[1]] });
    }
  };

  const handleJobTypeChange = (type: string, checked: boolean) => {
    onJobTypeToggle(type, checked);
  };

  const handleExperienceChange = (level: string, checked: boolean) => {
    onExpLevelToggle(level, checked);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Filter className="h-3.5 w-3.5" />}
          <span>Filters</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Search</h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Keywords..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <Button size="sm" onClick={handleSearchSubmit}>
                Search
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Job Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(jobTypes).map(([type, isChecked]) => (
                <div className="flex items-center space-x-2" key={type}>
                  <Checkbox 
                    id={`job-type-${type}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => handleJobTypeChange(type, !!checked)}
                  />
                  <Label htmlFor={`job-type-${type}`} className="text-sm capitalize">
                    {type.replace('-', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">Salary Range</h3>
              <p className="text-sm text-muted-foreground">
                ${filters.salaryRange?.[0]}k - ${filters.salaryRange?.[1]}k
              </p>
            </div>
            <Slider
              min={30}
              max={200}
              step={5}
              value={filters.salaryRange}
              onValueChange={handleSalaryChange}
              className="mt-2"
            />
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Experience Level</h3>
            <div className="space-y-2">
              {Object.entries(expLevels).map(([level, isChecked]) => (
                <div className="flex items-center space-x-2" key={level}>
                  <Checkbox 
                    id={`exp-${level}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => handleExperienceChange(level, !!checked)}
                  />
                  <Label htmlFor={`exp-${level}`} className="text-sm capitalize">
                    {level === 'entry' ? 'Entry Level' : level === 'mid' ? 'Mid Level' : 'Senior Level'}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between pt-2 border-t">
            <Button variant="ghost" size="sm" onClick={onResetFilters}>Reset all</Button>
            <Button size="sm" onClick={() => setOpen(false)}>Apply</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default JobFilter;
