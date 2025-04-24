import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Filter, Search, ListFilter } from 'lucide-react';
import { JobFilters } from '@/api/jobs';
import JobFilter from '@/components/JobFilter';

interface JobsHeaderProps {
  activeFilters: JobFilters;
  onFilterChange: (filters: Partial<JobFilters>) => void;
  onResetFilters: () => void;
  onJobTypeToggle: (type: string, isSelected: boolean) => void;
  onExpLevelToggle: (level: string, isSelected: boolean) => void;
  activeJobTypes: Record<string, boolean>;
  activeExpLevels: Record<string, boolean>;
}

const JobsHeader = ({
  activeFilters,
  onFilterChange,
  onResetFilters,
  onJobTypeToggle,
  onExpLevelToggle,
  activeJobTypes,
  activeExpLevels,
}: JobsHeaderProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ searchTerm: e.target.value });
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="relative w-full md:w-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search for jobs..."
          className="pl-10"
          value={activeFilters.searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="ml-auto">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Filters</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium leading-none">Job Type</h3>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="full-time"
                    checked={activeJobTypes['full-time'] || false}
                    onCheckedChange={(checked) => onJobTypeToggle('full-time', checked || false)}
                  />
                  <Label htmlFor="full-time">Full-time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="part-time"
                    checked={activeJobTypes['part-time'] || false}
                    onCheckedChange={(checked) => onJobTypeToggle('part-time', checked || false)}
                  />
                  <Label htmlFor="part-time">Part-time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="contract"
                    checked={activeJobTypes.contract || false}
                    onCheckedChange={(checked) => onJobTypeToggle('contract', checked || false)}
                  />
                  <Label htmlFor="contract">Contract</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remote"
                    checked={activeJobTypes.remote || false}
                    onCheckedChange={(checked) => onJobTypeToggle('remote', checked || false)}
                  />
                  <Label htmlFor="remote">Remote</Label>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium leading-none">Experience Level</h3>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="entry"
                    checked={activeExpLevels.entry || false}
                    onCheckedChange={(checked) => onExpLevelToggle('entry', checked || false)}
                  />
                  <Label htmlFor="entry">Entry Level</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mid"
                    checked={activeExpLevels.mid || false}
                    onCheckedChange={(checked) => onExpLevelToggle('mid', checked || false)}
                  />
                  <Label htmlFor="mid">Mid Level</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="senior"
                    checked={activeExpLevels.senior || false}
                    onCheckedChange={(checked) => onExpLevelToggle('senior', checked || false)}
                  />
                  <Label htmlFor="senior">Senior Level</Label>
                </div>
              </div>
            </div>
          </div>
          <Button variant="primary" onClick={() => setIsFilterOpen(false)}>
            Apply filters
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobsHeader;
