import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Search, CalendarDays, Briefcase, DollarSign, MapPin, X, Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { JobFilters } from '@/api/jobs';

interface JobsHeaderProps {
  filters: JobFilters;
  onFilterChange: (newFilters: Partial<JobFilters>) => void;
  onResetFilters: () => void;
  onJobTypeToggle: (type: string, isSelected: boolean) => void;
  onExpLevelToggle: (level: string, isSelected: boolean) => void;
  jobTypes: Record<string, boolean>;
  expLevels: Record<string, boolean>;
  isPending: boolean; // Add this prop to match usage in Jobs.tsx
}

// Helper function to get date posted label
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

// FilterButton component
interface FilterButtonProps {
  children: React.ReactNode;
}

const FilterButton: React.FC<FilterButtonProps> = ({ children }) => {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchThreshold = 10;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = Math.abs(touchEndX - touchStartX.current);
    const deltaY = Math.abs(touchEndY - touchStartY.current);

    if (deltaX > touchThreshold || deltaY > touchThreshold) {
      e.preventDefault();
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {children}
    </div>
  );
};

export const JobsHeader: React.FC<JobsHeaderProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  onJobTypeToggle,
  onExpLevelToggle,
  jobTypes,
  expLevels,
  isPending
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm);
  const [showSearchButton, setShowSearchButton] = useState(true);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ searchTerm });
  };

  const getExperienceLevelLabel = () => {
    const selectedLevels = Object.entries(expLevels)
      .filter(([_, value]) => value)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1) + " Level");

    if (selectedLevels.length === 0) return "Experience Level";
    if (selectedLevels.length === 1) return selectedLevels[0];
    if (selectedLevels.length === 2) return selectedLevels.join(" & ");
    return "Multiple Levels";
  };

  const getSalaryLabel = () => {
    if (filters.salaryRange[0] === 50 && filters.salaryRange[1] === 150) {
      return "Salary";
    }
    return `$${filters.salaryRange[0]}K - $${filters.salaryRange[1]}K`;
  };

  const getLocationLabel = () => {
    return filters.location || "Location";
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth > 640) {
        setShowSearchButton(true);
        return;
      }

      const scrollPosition = window.scrollY;
      setShowSearchButton(scrollPosition < 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Extract experience levels from the expLevels object
  const updateExperienceLevels = () => {
    const selectedExperienceLevels = Object.keys(expLevels).filter(key => expLevels[key]);
    onFilterChange({ experienceLevels: selectedExperienceLevels });
  };

  const handleExperienceLevelToggle = (level: string) => {
    onExpLevelToggle(level, !expLevels[level]);
    updateExperienceLevels();
  };

  return (
    <div className="bg-background sticky top-0 z-10 border-b border-border shadow-lg backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col gap-6">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-6 w-6" />
                <Input
                  className="pl-14 h-14 rounded-xl bg-background border-border shadow-md focus:ring-2 focus:ring-primary/50 transition-all text-base placeholder:text-muted-foreground/70"
                  placeholder="Search for job title, company or location..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <Button
                type="submit"
                variant="default"
                className={`h-14 px-8 rounded-xl bg-primary hover:bg-primary/90 shadow-md transition-all text-base font-medium sm:w-auto w-full sm:block ${showSearchButton ? 'block' : 'hidden'
                  }`}
              >
                Search Jobs
              </Button>
            </div>
          </form>

          <div className="flex overflow-x-auto gap-3 no-scrollbar">
            <FilterButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-11 px-5 rounded-xl bg-background border-border shadow-sm hover:bg-secondary/50 transition-all text-sm font-medium flex items-center min-w-[140px] truncate"
                  >
                    <CalendarDays className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">
                      {filters.datePosted ? getDatePostedLabel(filters.datePosted) : "Date Posted"}
                    </span>
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
            </FilterButton>

            <FilterButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-11 px-5 rounded-xl bg-background border-border shadow-sm hover:bg-secondary/50 transition-all text-sm font-medium flex items-center min-w-[140px] truncate"
                  >
                    <Briefcase className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{getExperienceLevelLabel()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-background border-border rounded-lg shadow-lg">
                  <DropdownMenuItem
                    onClick={() => handleExperienceLevelToggle('entry')}
                    className="hover:bg-secondary/50 transition-all"
                  >
                    Entry Level {expLevels.entry && "✓"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExperienceLevelToggle('mid')}
                    className="hover:bg-secondary/50 transition-all"
                  >
                    Mid Level {expLevels.mid && "✓"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExperienceLevelToggle('senior')}
                    className="hover:bg-secondary/50 transition-all"
                  >
                    Senior Level {expLevels.senior && "✓"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </FilterButton>

            <FilterButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-11 px-5 rounded-xl bg-background border-border shadow-sm hover:bg-secondary/50 transition-all text-sm font-medium flex items-center min-w-[140px] truncate"
                  >
                    <DollarSign className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{getSalaryLabel()}</span>
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
            </FilterButton>

            <FilterButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-11 px-5 rounded-xl bg-background border-border shadow-sm hover:bg-secondary/50 transition-all text-sm font-medium flex items-center min-w-[140px] truncate"
                  >
                    <MapPin className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{getLocationLabel()}</span>
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
            </FilterButton>

            <FilterButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-11 px-5 rounded-xl bg-background border-border shadow-sm hover:bg-secondary/50 transition-all text-sm font-medium flex items-center min-w-[140px] truncate"
                  >
                    <Building className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{filters.industry || "Industry"}</span>
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
            </FilterButton>

            <Button
              variant="ghost"
              size="sm"
              className="h-11 px-5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all text-sm font-medium min-w-[100px]"
              onClick={onResetFilters}
            >
              Reset all
            </Button>
          </div>

          {(filters.datePosted ||
            filters.location ||
            filters.industry ||
            Object.values(expLevels).some((v) => v) ||
            (filters.salaryRange[0] !== 50 || filters.salaryRange[1] !== 150)) && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground font-medium">Active filters:</span>

                {filters.datePosted && (
                  <Badge variant="outline" className="flex items-center gap-1 rounded-full px-3 py-1 bg-background border-border shadow-sm hover:bg-secondary/30 transition-all">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    {getDatePostedLabel(filters.datePosted)}
                    <X
                      className="h-4 w-4 ml-1 cursor-pointer text-muted-foreground hover:text-foreground transition-all"
                      onClick={() => onFilterChange({ datePosted: '' })}
                    />
                  </Badge>
                )}

                {filters.location && (
                  <Badge variant="outline" className="flex items-center gap-1 rounded-full px-3 py-1 bg-background border-border shadow-sm hover:bg-secondary/30 transition-all">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {filters.location}
                    <X
                      className="h-4 w-4 ml-1 cursor-pointer text-muted-foreground hover:text-foreground transition-all"
                      onClick={() => onFilterChange({ location: '' })}
                    />
                  </Badge>
                )}

                {filters.industry && (
                  <Badge variant="outline" className="flex items-center gap-1 rounded-full px-3 py-1 bg-background border-border shadow-sm hover:bg-secondary/30 transition-all">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    {filters.industry}
                    <X
                      className="h-4 w-4 ml-1 cursor-pointer text-muted-foreground hover:text-foreground transition-all"
                      onClick={() => onFilterChange({ industry: '' })}
                    />
                  </Badge>
                )}

                {(filters.salaryRange[0] !== 50 || filters.salaryRange[1] !== 150) && (
                  <Badge variant="outline" className="flex items-center gap-1 rounded-full px-3 py-1 bg-background border-border shadow-sm hover:bg-secondary/30 transition-all">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    ${filters.salaryRange[0]}K - ${filters.salaryRange[1]}K
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

export default JobsHeader;
