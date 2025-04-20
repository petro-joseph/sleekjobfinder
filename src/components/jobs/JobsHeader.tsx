import { useState } from 'react';
import { Search, CalendarDays, Briefcase, DollarSign, MapPin, X, Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface JobsHeaderProps {
  activeFilters: {
    jobTypes: Record<string, boolean>;
    experienceLevels: Record<string, boolean>;
    salaryRange: [number, number];
    searchTerm: string;
    industry: string;
    datePosted: string;
    location: string;
    sortBy: string;
  };
  onFilterChange: (filters: any) => void;
  onResetFilters: () => void;
}

const JobsHeader = ({ activeFilters, onFilterChange, onResetFilters }: JobsHeaderProps) => {
  const [searchTerm, setSearchTerm] = useState(activeFilters.searchTerm);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ searchTerm });
  };

  return (
    <div className="bg-gradient-to-b mb-6 from-primary/5 to-background border-b rounded-lg shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col gap-6">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  className="pl-12 h-14 rounded-lg shadow-sm transition-all"
                  placeholder="Search for Product Manager, Developer, or company..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <Button
                type="submit"
                className="h-14 px-6 rounded-lg shadow-md transition-all sm:w-auto w-full"
              >
                Search Jobs
              </Button>
            </div>
          </form>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Date Posted Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 rounded-lg shadow-sm transition-all"
                >
                  <CalendarDays className="mr-2 h-5 w-5" />
                  {activeFilters.datePosted ? getDatePostedLabel(activeFilters.datePosted) : "Date Posted"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => onFilterChange({ datePosted: 'any' })}>
                  Any time
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ datePosted: '24h' })}>
                  Last 24 hours
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ datePosted: '7d' })}>
                  Last 7 days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ datePosted: '14d' })}>
                  Last 14 days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ datePosted: '30d' })}>
                  Last 30 days
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Experience Level Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 rounded-lg shadow-sm transition-all"
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Experience Level
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() =>
                    onFilterChange({
                      experienceLevels: { ...activeFilters.experienceLevels, entry: !activeFilters.experienceLevels.entry },
                    })
                  }
                >
                  Entry Level {activeFilters.experienceLevels.entry && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    onFilterChange({
                      experienceLevels: { ...activeFilters.experienceLevels, mid: !activeFilters.experienceLevels.mid },
                    })
                  }
                >
                  Mid Level {activeFilters.experienceLevels.mid && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    onFilterChange({
                      experienceLevels: { ...activeFilters.experienceLevels, senior: !activeFilters.experienceLevels.senior },
                    })
                  }
                >
                  Senior Level {activeFilters.experienceLevels.senior && "✓"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Salary Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 rounded-lg shadow-sm transition-all"
                >
                  <DollarSign className="mr-2 h-5 w-5" />
                  Salary
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => onFilterChange({ salaryRange: [30, 60] })}>
                  $30K - $60K
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ salaryRange: [60, 90] })}>
                  $60K - $90K
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ salaryRange: [90, 120] })}>
                  $90K - $120K
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ salaryRange: [120, 150] })}>
                  $120K - $150K
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ salaryRange: [150, 200] })}>
                  $150K+
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Location Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 rounded-lg shadow-sm transition-all"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Location
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => onFilterChange({ location: 'Remote' })}>
                  Remote
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ location: 'San Francisco' })}>
                  San Francisco
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ location: 'New York' })}>
                  New York
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ location: 'Austin' })}>
                  Austin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ location: 'Chicago' })}>
                  Chicago
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Industry Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 rounded-lg shadowhearts-sm transition-all"
                >
                  <Building className="mr-2 h-5 w-5" />
                  {activeFilters.industry ? activeFilters.industry : "Industry"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => onFilterChange({ industry: 'Technology' })}>
                  Technology
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ industry: 'Finance' })}>
                  Finance
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ industry: 'Healthcare' })}>
                  Healthcare
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ industry: 'Education' })}>
                  Education
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ industry: 'Marketing' })}>
                  Marketing
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Reset Filters */}
            <Button
              variant="ghost"
              size="sm"
              className="h-10 rounded-lg transition-all"
              onClick={onResetFilters}
            >
              Reset all
            </Button>
          </div>

          {/* Active Filters Display */}
          {(activeFilters.datePosted ||
            activeFilters.location ||
            activeFilters.industry ||
            Object.values(activeFilters.experienceLevels).some((v) => v) ||
            (activeFilters.salaryRange[0] !== 50 || activeFilters.salaryRange[1] !== 150)) && (
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span className="text-sm text-muted-foreground">Active filters:</span>

                {activeFilters.datePosted && (
                  <Badge variant="outline" className="flex items-center gap-1 rounded-full px-3 py-1">
                    <CalendarDays className="h-4 w-4" />
                    {getDatePostedLabel(activeFilters.datePosted)}
                    <X
                      className="h-4 w-4 ml-1 cursor-pointer"
                      onClick={() => onFilterChange({ datePosted: '' })}
                    />
                  </Badge>
                )}

                {activeFilters.location && (
                  <Badge variant="outline" className="flex items-center gap-1 rounded-full px-3 py-1">
                    <MapPin className="h-4 w-4" />
                    {activeFilters.location}
                    <X
                      className="h-4 w-4 ml-1 cursor-pointer"
                      onClick={() => onFilterChange({ location: '' })}
                    />
                  </Badge>
                )}

                {activeFilters.industry && (
                  <Badge variant="outline" className="flex items-center gap-1 rounded-full px-3 py-1">
                    <Building className="h-4 w-4" />
                    {activeFilters.industry}
                    <X
                      className="h-4 w-4 ml-1 cursor-pointer"
                      onClick={() => onFilterChange({ industry: '' })}
                    />
                  </Badge>
                )}

                {Object.entries(activeFilters.experienceLevels)
                  .filter(([_, value]) => value)
                  .map(([key]) => (
                    <Badge key={key} variant="outline" className="flex items-center gap-1 rounded-full px-3 py-1">
                      <Briefcase className="h-4 w-4" />
                      {key.charAt(0).toUpperCase() + key.slice(1)} Level
                      <X
                        className="h-4 w-4 ml-1 cursor-pointer"
                        onClick={() =>
                          onFilterChange({
                            experienceLevels: { ...activeFilters.experienceLevels, [key]: false },
                          })
                        }
                      />
                    </Badge>
                  ))}

                {(activeFilters.salaryRange[0] !== 50 || activeFilters.salaryRange[1] !== 150) && (
                  <Badge variant="outline" className="flex items-center gap-1 rounded-full px-3 py-1">
                    <DollarSign className="h-4 w-4" />
                    ${activeFilters.salaryRange[0]}K - ${activeFilters.salaryRange[1]}K
                    <X
                      className="h-4 w-4 ml-1 cursor-pointer"
                      onClick={() => onFilterChange({ salaryRange: [50, 150] })}
                    />
                  </Badge>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

function getDatePostedLabel(datePosted: string): string {
  switch (datePosted) {
    case '24h':
      return 'Last 24 hours';
    case '7d':
      return 'Last 7 days';
    case '14d':
      return 'Last 14 days';
    case '30d':
      return 'Last 30 days';
    case 'any':
      return 'Any time';
    default:
      return 'Date Posted';
  }
}

export default JobsHeader;