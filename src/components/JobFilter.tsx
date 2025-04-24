
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Search } from 'lucide-react';
import { JobFilters } from '@/api/jobs';

interface FilterValues {
  jobTypes: string[];
  experienceLevels: string[];
  salaryRange: [number, number];
  searchTerm: string;
}

interface JobFilterProps {
  onFilterChange: (filters: Partial<JobFilters>) => void;
}

const JobFilter = ({ onFilterChange }: JobFilterProps) => {
  const [jobTypesState, setJobTypesState] = useState({
    fullTime: false,
    partTime: false,
    contract: false,
    remote: false,
  });

  const [experienceLevelsState, setExperienceLevelsState] = useState({
    entry: false,
    mid: false,
    senior: false,
  });

  const [salaryRange, setSalaryRange] = useState<[number, number]>([50, 150]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleJobTypeChange = (type: keyof typeof jobTypesState) => {
    const updatedJobTypes = { ...jobTypesState, [type]: !jobTypesState[type] };
    setJobTypesState(updatedJobTypes);
    
    // Convert object to array of selected job types
    const jobTypesArray = Object.entries(updatedJobTypes)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => mapTypeKeys(type));
      
    applyFilters(jobTypesArray, getExperienceLevelsArray(), salaryRange, searchTerm);
  };

  const handleExperienceChange = (level: keyof typeof experienceLevelsState) => {
    const updatedLevels = { ...experienceLevelsState, [level]: !experienceLevelsState[level] };
    setExperienceLevelsState(updatedLevels);
    
    // Convert object to array of selected experience levels
    const expLevelsArray = Object.entries(updatedLevels)
      .filter(([_, isSelected]) => isSelected)
      .map(([level]) => level);
      
    applyFilters(getJobTypesArray(), expLevelsArray, salaryRange, searchTerm);
  };

  const handleSalaryChange = (value: number[]) => {
    // Ensure the value has exactly two elements to satisfy the [number, number] type
    const typedSalaryRange: [number, number] = value.length >= 2 
      ? [value[0], value[1]] 
      : [value[0] || 50, value[1] || 150];
      
    setSalaryRange(typedSalaryRange);
    applyFilters(getJobTypesArray(), getExperienceLevelsArray(), typedSalaryRange, searchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    applyFilters(getJobTypesArray(), getExperienceLevelsArray(), salaryRange, e.target.value);
  };

  // Helper to convert internal state to filter array format
  const getJobTypesArray = (): string[] => {
    return Object.entries(jobTypesState)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => mapTypeKeys(type));
  };

  // Helper to convert internal state to filter array format
  const getExperienceLevelsArray = (): string[] => {
    return Object.entries(experienceLevelsState)
      .filter(([_, isSelected]) => isSelected)
      .map(([level]) => level);
  };

  // Map frontend keys to backend keys if needed
  const mapTypeKeys = (key: string): string => {
    const mapping: Record<string, string> = {
      fullTime: "full-time",
      partTime: "part-time",
    };
    return mapping[key as keyof typeof mapping] || key;
  };

  const applyFilters = (
    types: string[],
    levels: string[],
    salary: [number, number],
    search: string
  ) => {
    onFilterChange({
      jobTypes: types,
      experienceLevels: levels,
      salaryRange: salary,
      searchTerm: search,
    });
  };

  const clearFilters = () => {
    setJobTypesState({
      fullTime: false,
      partTime: false,
      contract: false,
      remote: false,
    });
    setExperienceLevelsState({
      entry: false,
      mid: false,
      senior: false,
    });
    setSalaryRange([50, 150]);
    setSearchTerm('');
    
    onFilterChange({
      jobTypes: [],
      experienceLevels: [],
      salaryRange: [50, 150],
      searchTerm: '',
    });
  };

  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-24">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-3 text-foreground">Job Type</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="full-time" 
                checked={jobTypesState.fullTime}
                onCheckedChange={() => handleJobTypeChange('fullTime')}
              />
              <Label htmlFor="full-time">Full-time</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="part-time" 
                checked={jobTypesState.partTime}
                onCheckedChange={() => handleJobTypeChange('partTime')}
              />
              <Label htmlFor="part-time">Part-time</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="contract" 
                checked={jobTypesState.contract}
                onCheckedChange={() => handleJobTypeChange('contract')}
              />
              <Label htmlFor="contract">Contract</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remote" 
                checked={jobTypesState.remote}
                onCheckedChange={() => handleJobTypeChange('remote')}
              />
              <Label htmlFor="remote">Remote</Label>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-3">
            <h3 className="font-medium text-foreground">Salary Range</h3>
            <p className="text-sm text-muted-foreground">
              ${salaryRange[0]}k - ${salaryRange[1]}k
            </p>
          </div>
          <Slider
            defaultValue={salaryRange}
            min={30}
            max={200}
            step={5}
            value={salaryRange}
            onValueChange={handleSalaryChange}
            className="my-4"
          />
        </div>

        <div>
          <h3 className="font-medium mb-3 text-foreground">Experience Level</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="entry"
                checked={experienceLevelsState.entry}
                onCheckedChange={() => handleExperienceChange('entry')}
              />
              <Label htmlFor="entry">Entry Level</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mid"
                checked={experienceLevelsState.mid}
                onCheckedChange={() => handleExperienceChange('mid')}
              />
              <Label htmlFor="mid">Mid Level</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="senior"
                checked={experienceLevelsState.senior}
                onCheckedChange={() => handleExperienceChange('senior')}
              />
              <Label htmlFor="senior">Senior Level</Label>
            </div>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default JobFilter;
