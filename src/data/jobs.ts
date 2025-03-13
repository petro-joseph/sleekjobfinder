
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  description: string;
  requirements: string[];
  postedAt: string;
  logo?: string;
  featured?: boolean;
  industry: string;
  tags: string[]; // Added tags property
}

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechGrowth',
    location: 'San Francisco, CA (Remote)',
    salary: '$120,000 - $150,000',
    type: 'Remote',
    description: 'We are looking for an experienced Frontend Developer to join our product team to build innovative solutions for our growing customer base.',
    requirements: [
      '5+ years of experience with React and modern JavaScript',
      'Experience with TypeScript and Next.js',
      'Strong UI/UX sensibilities',
      'Experience with state management libraries',
    ],
    postedAt: '2 days ago',
    featured: true,
    industry: 'Technology',
    tags: ['React', 'TypeScript', 'Frontend', 'UI/UX'],
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InnovateCo',
    location: 'New York, NY',
    salary: '$130,000 - $160,000',
    type: 'Full-time',
    description: 'Looking for a strategic Product Manager to lead our core product initiatives and drive growth through data-driven decision making.',
    requirements: [
      '3+ years of product management experience',
      'Experience with agile methodologies',
      'Strong analytical and communication skills',
      'Background in SaaS products preferred',
    ],
    postedAt: '1 day ago',
    featured: true,
    industry: 'Technology',
    tags: ['Product Management', 'Agile', 'SaaS', 'Analytics'],
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    company: 'CloudScale',
    location: 'Remote',
    salary: '$110,000 - $140,000',
    type: 'Remote',
    description: 'Join our infrastructure team to build and maintain scalable, reliable cloud services for our enterprise customers.',
    requirements: [
      'Experience with AWS or GCP',
      'Knowledge of containerization and orchestration',
      'Experience with CI/CD pipelines',
      'Understanding of infrastructure as code',
    ],
    postedAt: '3 days ago',
    industry: 'Cloud Computing',
    tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
  },
  {
    id: '4',
    title: 'UX/UI Designer',
    company: 'DesignFusion',
    location: 'Austin, TX (Hybrid)',
    salary: '$90,000 - $120,000',
    type: 'Full-time',
    description: 'Looking for a creative UX/UI Designer to craft beautiful, intuitive interfaces for our suite of products.',
    requirements: [
      'Strong portfolio showcasing UX process',
      'Experience with Figma or similar tools',
      'Understanding of design systems',
      'Ability to translate user needs into design solutions',
    ],
    postedAt: '1 week ago',
    industry: 'Design',
    tags: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
  },
  {
    id: '5',
    title: 'Data Scientist',
    company: 'AnalyticsPro',
    location: 'Remote',
    salary: '$125,000 - $155,000',
    type: 'Remote',
    description: 'Join our data science team to extract insights from complex datasets and create predictive models that drive business decisions.',
    requirements: [
      'MS or PhD in a quantitative field',
      'Experience with Python, SQL, and data visualization',
      'Background in machine learning and statistical analysis',
      'Ability to communicate technical concepts to non-technical stakeholders',
    ],
    postedAt: '5 days ago',
    industry: 'Data Science',
    tags: ['Python', 'Machine Learning', 'SQL', 'Data Visualization'],
  },
  {
    id: '6',
    title: 'Full Stack Engineer',
    company: 'OmniTech',
    location: 'Boston, MA (Flexible)',
    salary: '$110,000 - $140,000',
    type: 'Full-time',
    description: 'Seeking a versatile Full Stack Engineer to work across our entire platform, from database design to frontend implementation.',
    requirements: [
      'Experience with Node.js and React',
      'Database design and optimization skills',
      'Understanding of RESTful APIs',
      'Experience with microservices architecture a plus',
    ],
    postedAt: '3 days ago',
    industry: 'Software Development',
    tags: ['Node.js', 'React', 'RESTful APIs', 'Databases'],
  },
  {
    id: '7',
    title: 'Content Marketing Manager',
    company: 'ContentHub',
    location: 'Remote',
    salary: '$85,000 - $105,000',
    type: 'Remote',
    description: 'Lead our content marketing efforts to drive organic growth through blog posts, case studies, and thought leadership content.',
    requirements: [
      '3+ years of content marketing experience',
      'Strong writing and editing skills',
      'SEO knowledge and experience',
      'Experience with content analytics',
    ],
    postedAt: '1 week ago',
    industry: 'Marketing',
    tags: ['Content Strategy', 'SEO', 'Copywriting', 'Analytics'],
  },
  {
    id: '8',
    title: 'Customer Success Manager',
    company: 'ClientFirst',
    location: 'Chicago, IL',
    salary: '$75,000 - $95,000',
    type: 'Full-time',
    description: 'Help our customers achieve their goals using our platform through onboarding, training, and ongoing support.',
    requirements: [
      'Experience in customer success or account management',
      'Strong communication and relationship-building skills',
      'Problem-solving abilities',
      'Experience with CRM software',
    ],
    postedAt: '2 weeks ago',
    industry: 'Customer Service',
    tags: ['Customer Success', 'Account Management', 'CRM', 'Training'],
  },
];

export const getJob = (id: string): Job | undefined => {
  return jobs.find(job => job.id === id);
};
