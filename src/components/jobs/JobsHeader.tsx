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
    <div className="bg-background sticky top-0 z-10 border-b border-border shadow-lg backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col gap-6">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-6 w-6" />
                <Input
                  className="pl-14 h-14 rounded-xl bg-background border-border shadow-md focus:ring-2 focus:ring-primary/50 transition-all text-base placeholder:text-muted-foreground/70"
                  placeholder="Search for Product Manager, Developer, or company..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <Button
                type="submit"
                className="h-14 px-8 rounded-xl bg-primary hover:bg-primary/90 shadow-md transition-all text-base font-medium sm:w-auto w-full"
              >
                Search Jobs
              </Button>
            </div>
          </form>

          {/* Filters Row */}
          <div className="flex overflow-x-auto gap-3 no-scrollbar">
            {/* Date Posted Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-11 px-5 rounded-xl bg-background border-border shadow-sm hover:bg-secondary/50 transition-all text-sm font-medium flex items-center"
                >
                  <CalendarDays className="mr-2 h-5 w-5 text-muted-foreground" />
                  {activeFilters.datePosted ? getDatePostedLabel(activeFilters.datePosted) : "Date Posted"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-background border-border rounded-lg shadow-lg">
                <DropdownMenuItem onClick={() => onFilterChange({ datePosted: 'any' })} className="hover:bg-secondary/50 transition-all">
                  Any time
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ datePosted: '24h' })} className="hover:bg-secondary/50 transition-all">
                  Last 24 hours
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ datePosted: '7d' })} className="hover:bg-secondary/50 transition-all">
                  Last 7 days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ datePosted: '14d' })} className="hover:bg-secondary/50 transition-all">
                  Last 14 days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ datePosted: '30d' })} className="hover:bg-secondary/50 transition-all">
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
                  className="h-11 px-5 rounded-xl bg-background border-border shadow-sm hover:bg-secondary/50 transition-all text-sm font-medium flex items-center"
                >
                  <Briefcase className="mr-2 h-5 w-5 text-muted-foreground" />
                  Experience Level
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-background border-border rounded-lg shadow-lg">
                <DropdownMenuItem
                  onClick={() =>
                    onFilterChange({
                      experienceLevels: { ...activeFilters.experienceLevels, entry: !activeFilters.experienceLevels.entry },
                    })
                  }
                  className="hover:bg-secondary/50 transition-all"
                >
                  Entry Level {activeFilters.experienceLevels.entry && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    onFilterChange({
                      experienceLevels: { ...activeFilters.experienceLevels, mid: !activeFilters.experienceLevels.mid },
                    })
                  }
                  className="hover:bg-secondary/50 transition-all"
                >
                  Mid Level {activeFilters.experienceLevels.mid && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    onFilterChange({
                      experienceLevels: { ...activeFilters.experienceLevels, senior: !activeFilters.experienceLevels.senior },
                    })
                  }
                  className="hover:bg-secondary/50 transition-all"
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
                  className="h-11 px-5 rounded-xl bg-background border-border shadow-sm hover:bg-secondary/50 transition-all text-sm font-medium flex items-center"
                >
                  <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
                  Salary
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-background border-border rounded-lg shadow-lg">
                <DropdownMenuItem onClick={() => onFilterChange({ salaryRange: [30, 60] })} className="hover:bg-secondary/50 transition-all">
                  $30K - $60K
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ salaryRange: [60, 90] })} className="hover:bg-secondary/50 transition-all">
                  $60K - $90K
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ salaryRange: [90, 120] })} className="hover:bg-secondary/50 transition-all">
                  $90K - $120K
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ salaryRange: [120, 150] })} className="hover:bg-secondary/50 transition-all">
                  $120K - $150K
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ salaryRange: [150, 200] })} className="hover:bg-secondary/50 transition-all">
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
                  className="h-11 px-5 rounded-xl bg-background border-border shadow-sm hover:bg-secondary/50 transition-all text-sm font-medium flex items-center"
                >
                  <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                  Location
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-background border-border rounded-lg shadow-lg">
                <DropdownMenuItem onClick={() => onFilterChange({ location: 'Remote' })} className="hover:bg-secondary/50 transition-all">
                  Remote
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ location: 'San Francisco' })} className="hover:bg-secondary/50 transition-all">
                  San Francisco
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ location: 'New York' })} className="hover:bg-secondary/50 transition-all">
                  New York
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ location: 'Austin' })} className="hover:bg-secondary/50 transition-all">
                  Austin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ location: 'Chicago' })} className="hover:bg-secondary/50 transition-all">
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
                  className="h-11 px-5 rounded-xl bg-background border-border shadow-sm hover:bg-secondary/50 transition-all text-sm font-medium flex items-center"
                >
                  <Building className="mr-2 h-5 w-5 text-muted-foreground" />
                  {activeFilters.industry ? activeFilters.industry : "Industry"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-background border-border rounded-lg shadow-lg">
                <DropdownMenuItem onClick={() => onFilterChange({ industry: 'Technology' })} className="hover:bg-secondary/50 transition-all">
                  Technology
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ industry: 'Finance' })} className="hover:bg-secondary/50 transition-all">
                  Finance
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ industry: 'Healthcare' })} className="hover:bg-secondary/50 transition-all">
                  Healthcare
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ industry: 'Education' })} className="hover:bg-secondary/50 transition-all">
                  Education
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange({ industry: 'Marketing' })} className="hover:bg-secondary/50 transition-all">
                  Marketing
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Reset Filters */}
            <Button
              variant="ghost"
              size="sm"
              className="h-11 px-5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all text-sm font-medium"
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground font-medium">Active filters:</span>

              {activeFilters.datePosted && (
                <Badge variant="outline" className="flex items-center gap-1 rounded-full px-3 py-1 bg-background border-border shadow-sm hover:bg-secondary/30 transition-all">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  {getDatePostedLabel(activeFilters.datePosted)}
                  <X
                    className="h-4 w-4 ml-1 cursor-pointer text-muted-foreground hover:text-foreground transition-all"
                    onClick={() => onFilterChange({ datePosted: '' })}
                  />
                </Badge>
              )}

              {activeFilters.location && (
                <Badge variant="outline" className="flex items-center gap-1 rounded-full px-3 py-1 bg-background border-border shadow-sm hover:bg-secondary/30 transition-all">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {activeFilters.location}
                  <X
                    className="h-4 w-4 ml-1 cursor-pointer text-muted-foreground hover:text-foreground transition-all"
                    onClick={() => onFilterChange({ location: '' })}
                  />
                </Badge>
              )}

              {activeFilters.industry && (
                <Badge variant="outline" className="flex items-center gap-1 rounded-full px-3 py-1 bg-background border-border shadow-sm hover:bg-secondary/30 transition-all">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  {activeFilters.industry}
                  <X
                    className="h-4 w-4 ml-1 cursor-pointer text-muted-foreground hover:text-foreground transition-all"
                    onClick={() => onFilterChange({ industry: '' })}
                  />
                </Badge>
              )}

              {Object.entries(activeFilters.experienceLevels)
                .filter(([_, value]) => value)
                .map(([key]) => (
                  <Badge key={key} variant="outline" className="flex items-center gap-1 rounded-full px-3 py-1 bg-background border-border shadow-sm hover:bg-secondary/30 transition-all">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    {key.charAt(0).toUpperCase() + key.slice(1)} Level
                    <X
                      className="h-4 w-4 ml-1 cursor-pointer text-muted-foreground hover:text-foreground transition-all"
                      onClick={() =>
                        onFilterChange({
                          experienceLevels: { ...activeFilters.experienceLevels, [key]: false },
                        })
                      }
                    />
                  </Badge>
                ))}

              {(activeFilters.salaryRange[0] !== 50 || activeFilters.salaryRange[1] !== 150) && (
                <Badge variant="outline" className="flex items-center gap-1 rounded-full px-3 py-1 bg-background border-border shadow-sm hover:bg-secondary/30 transition-all">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  ${activeFilters.salaryRange[0]}K - ${activeFilters.salaryRange[1]}K
                  <X
                    className="h-4 w-4 ml-1 cursor-pointer text-muted-foreground hover:text-foreground transition-all"
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