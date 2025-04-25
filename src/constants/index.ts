
export const JOBS_PER_PAGE = 10;


export const EXPERIENCE_LEVELS = [
  'Entry Level',
  'Mid Level',
  'Senior Level',
  'Manager',
  'Director',
  'Executive',
];

export const LOCATIONS = [
  'Remote',
  'San Francisco, CA',
  'New York, NY',
  'Austin, TX',
  'Seattle, WA',
  'Boston, MA',
  'Chicago, IL',
  'Los Angeles, CA',
];


export const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'CN', label: 'China' },
  { value: 'IN', label: 'India' },
  { value: 'BR', label: 'Brazil' },
].sort((a, b) => a.label.localeCompare(b.label));

export const JOB_TYPES = [
  { id: 'full-time', value: 'full-time', label: 'Full-time' },
  { id: 'part-time', value: 'part-time',label: 'Part-time' },
  { id: 'contract', value: 'contract', label: 'Contract' },
  { id: 'freelance', value: 'freelance', label: 'Freelance' },
  { id: 'internship', value: 'internship', label: 'Internship' },
  { id: 'remote', value: 'remote', label: 'Remote' },
  { id: 'hybrid', value: 'hybrid', label: 'Hybrid' },
];


export const INDUSTRIES = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'marketing', label: 'Marketing & Advertising' },
  { value: 'hospitality', label: 'Hospitality & Tourism' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'construction', label: 'Construction' },
].sort((a, b) => a.label.localeCompare(b.label));
