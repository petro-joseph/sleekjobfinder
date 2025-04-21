
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

// Export a dummy array for backward compatibility
// This will be replaced with API calls to Supabase as we migrate components
export const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechGrowth",
    location: "San Francisco, CA (Remote)",
    salary: "$120,000 - $150,000",
    type: "Remote",
    description: "We are looking for an experienced Frontend Developer to join our product team to build innovative solutions for our growing customer base.",
    requirements: ["5+ years of experience with React and modern JavaScript", "Experience with TypeScript and Next.js", "Strong UI/UX sensibilities", "Experience with state management libraries"],
    posted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    postedAt: "2 days ago",
    logo: "https://example.com/logo.png",
    featured: true,
    industry: "Technology",
    url: "https://example.com/job/1",
    tags: ["React", "TypeScript", "Frontend", "UI/UX"]
  },
  {
    id: "2",
    title: "Product Manager",
    company: "InnovateCo",
    location: "New York, NY",
    salary: "$130,000 - $160,000",
    type: "Full-time",
    description: "Looking for a strategic Product Manager to lead our core product initiatives and drive growth through data-driven decision making.",
    requirements: ["3+ years of product management experience", "Experience with agile methodologies", "Strong analytical and communication skills", "Background in SaaS products preferred"],
    posted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    postedAt: "1 day ago",
    logo: "https://example.com/logo.png",
    featured: true,
    industry: "Technology",
    url: "https://example.com/job/2",
    tags: ["Product Management", "Agile", "SaaS", "Analytics"]
  },
  {
    id: "3",
    title: "DevOps Engineer",
    company: "CloudScale",
    location: "Remote",
    salary: "$110,000 - $140,000",
    type: "Remote",
    description: "Join our infrastructure team to build and maintain scalable, reliable cloud services for our enterprise customers.",
    requirements: ["Experience with AWS or GCP", "Knowledge of containerization and orchestration", "Experience with CI/CD pipelines", "Understanding of infrastructure as code"],
    posted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    postedAt: "3 days ago",
    logo: "https://example.com/logo.png",
    featured: false,
    industry: "Cloud Computing",
    url: "https://example.com/job/3",
    tags: ["AWS", "Docker", "Kubernetes", "CI/CD"]
  },
  {
    id: "4",
    title: "UX/UI Designer",
    company: "DesignFusion",
    location: "Austin, TX (Hybrid)",
    salary: "$90,000 - $120,000",
    type: "Full-time",
    description: "Looking for a creative UX/UI Designer to craft beautiful, intuitive interfaces for our suite of products.",
    requirements: ["Strong portfolio showcasing UX process", "Experience with Figma or similar tools", "Understanding of design systems", "Ability to translate user needs into design solutions"],
    posted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    postedAt: "1 week ago",
    logo: "https://example.com/logo.png",
    featured: false,
    industry: "Design",
    url: "https://example.com/job/4",
    tags: ["Figma", "UI Design", "UX Research", "Prototyping"]
  },
  {
    id: "5",
    title: "Data Scientist",
    company: "AnalyticsPro",
    location: "Remote",
    salary: "$125,000 - $155,000",
    type: "Remote",
    description: "Join our data science team to extract insights from complex datasets and create predictive models that drive business decisions.",
    requirements: ["MS or PhD in a quantitative field", "Experience with Python, SQL, and data visualization", "Background in machine learning and statistical analysis", "Ability to communicate technical concepts to non-technical stakeholders"],
    posted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    postedAt: "5 days ago",
    logo: "https://example.com/logo.png",
    featured: false,
    industry: "Data Science",
    url: "https://example.com/job/5",
    tags: ["Python", "Machine Learning", "SQL", "Data Visualization"]
  }
];

// Helper function to fetch demo data for components that haven't been migrated yet
export const fetchDummyJobs = async (): Promise<Job[]> => {
  return jobs;
};

