
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  postedAt: string;
  logo?: string;
  featured?: boolean;
  industry: string;
  url?: string;
  tags: string[];
  created_at?: string;
  // Make sure we handle potential project-like data correctly
  projects?: Array<{
    title: string;
    role?: string;
    impact?: string;
    technologies?: string[];
    description?: string;
  }>;
}
