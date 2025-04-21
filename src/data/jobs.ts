
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  description: string;
  requirements: string[];
  posted_at: string;
  postedAt?: string; // For backward compatibility
  logo?: string;
  featured?: boolean;
  industry: string;
  url?: string;
  tags: string[];
  created_at?: string;
}
