
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Search, SlidersHorizontal } from 'lucide-react';

interface JobFilterProps {
  onFilterChange: (filters: any) => void;
}

const JobFilter = ({ onFilterChange }: JobFilterProps) => {
  const [jobTypes, setJobTypes] = useState({
    fullTime: false,
    partTime: false,
    contract: false,
    remote: false,
  });

  const [salaryRange, setSalaryRange] = useState([50, 150]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleJobTypeChange = (type: keyof typeof jobTypes) => {
    const updatedJobTypes = { ...jobTypes, [type]: !jobTypes[type] };
    setJobTypes(updatedJobTypes);
    applyFilters(updatedJobTypes, salaryRange, searchTerm);
  };

  const handleSalaryChange = (value: number[]) => {
    setSalaryRange(value);
    applyFilters(jobTypes, value, searchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    applyFilters(jobTypes, salaryRange, e.target.value);
  };

  const applyFilters = (
    types: typeof jobTypes,
    salary: number[],
    search: string
  ) => {
    onFilterChange({
      jobTypes: types,
      salaryRange: salary,
      searchTerm: search,
    });
  };

  const clearFilters = () => {
    setJobTypes({
      fullTime: false,
      partTime: false,
      contract: false,
      remote: false,
    });
    setSalaryRange([50, 150]);
    setSearchTerm('');
    
    onFilterChange({
      jobTypes: {
        fullTime: false,
        partTime: false,
        contract: false,
        remote: false,
      },
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
                checked={jobTypes.fullTime}
                onCheckedChange={() => handleJobTypeChange('fullTime')}
              />
              <Label htmlFor="full-time">Full-time</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="part-time" 
                checked={jobTypes.partTime}
                onCheckedChange={() => handleJobTypeChange('partTime')}
              />
              <Label htmlFor="part-time">Part-time</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="contract" 
                checked={jobTypes.contract}
                onCheckedChange={() => handleJobTypeChange('contract')}
              />
              <Label htmlFor="contract">Contract</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remote" 
                checked={jobTypes.remote}
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
              <Checkbox id="entry" />
              <Label htmlFor="entry">Entry Level</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="mid" />
              <Label htmlFor="mid">Mid Level</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="senior" />
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
