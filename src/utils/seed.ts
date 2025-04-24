
import { supabase } from '@/integrations/supabase/client';

// Seed database with initial jobs data
export const seedJobs = async () => {
  // Check if we already have jobs data
  const { count, error: countError } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true });
    
  if (countError) {
    console.error('Error checking jobs count:', countError);
    return;
  }
  
  // If we already have jobs, don't seed
  if (count && count > 0) {
    console.log(`Database already has ${count} jobs, skipping seed.`);
    return;
  }
  
  console.log('Seeding jobs data...');
  
  const mockJobs = [
    {
      title: "Senior React Developer",
      company: "TechCorp",
      location: "Remote",
      salary: "$120K - $150K",
      type: "Full-time",
      description: "We're looking for a senior React developer to join our team and help build cutting-edge web applications. You'll be working with the latest technologies and frameworks to deliver exceptional user experiences.",
      requirements: ["5+ years experience", "React", "TypeScript", "Redux", "Node.js"],
      featured: true,
      industry: "Technology",
      url: "https://example.com/jobs/senior-react-developer",
      tags: ["React", "TypeScript", "Remote"]
    },
    {
      title: "UX Designer",
      company: "DesignStudio",
      location: "San Francisco, CA",
      salary: "$90K - $110K",
      type: "Full-time",
      description: "Join our creative team as a UX Designer and help shape the future of our digital products. You'll collaborate with cross-functional teams to create intuitive and engaging user experiences.",
      requirements: ["3+ years experience", "Figma", "User Research", "Prototyping", "UI Design"],
      featured: false,
      industry: "Design",
      tags: ["UX", "Figma", "Design"]
    },
    {
      title: "DevOps Engineer",
      company: "CloudSystems",
      location: "New York, NY",
      salary: "$130K - $160K",
      type: "Full-time",
      description: "We are seeking a DevOps Engineer to help us build and maintain our cloud infrastructure. You'll be responsible for automating deployment processes and ensuring the reliability of our systems.",
      requirements: ["AWS", "Kubernetes", "CI/CD", "Infrastructure as Code", "Linux"],
      featured: true,
      industry: "Cloud Computing",
      tags: ["DevOps", "AWS", "Kubernetes"]
    },
    {
      title: "Frontend Developer",
      company: "WebSolutions",
      location: "Remote",
      salary: "$80K - $100K",
      type: "Full-time",
      description: "We're looking for a frontend developer to help build responsive and accessible web applications. You'll work closely with designers to implement pixel-perfect UI components.",
      requirements: ["HTML", "CSS", "JavaScript", "React", "Responsive Design"],
      featured: false,
      industry: "Web Development",
      tags: ["Frontend", "React", "Remote"]
    },
    {
      title: "Product Manager",
      company: "ProductLabs",
      location: "Austin, TX",
      salary: "$110K - $140K",
      type: "Full-time",
      description: "Join our team as a Product Manager and help shape the roadmap for our SaaS products. You'll work with stakeholders to define requirements and prioritize features.",
      requirements: ["3+ years in product management", "Agile", "User stories", "Stakeholder management"],
      featured: false,
      industry: "Product Management",
      tags: ["Product", "SaaS", "Agile"]
    },
    {
      title: "Data Scientist",
      company: "DataInsights",
      location: "Remote",
      salary: "$120K - $150K",
      type: "Full-time",
      description: "We're seeking a Data Scientist to help us extract insights from complex datasets. You'll build machine learning models and work with stakeholders to drive data-informed decisions.",
      requirements: ["Python", "Machine Learning", "SQL", "Data Visualization", "Statistics"],
      featured: true,
      industry: "Data Science",
      tags: ["ML", "Python", "Remote"]
    },
    {
      title: "Backend Developer",
      company: "ServerTech",
      location: "Chicago, IL",
      salary: "$100K - $130K",
      type: "Full-time",
      description: "Join our engineering team as a Backend Developer to build scalable and reliable APIs and services. You'll work with databases and cloud infrastructure to support our growing user base.",
      requirements: ["Node.js", "Express", "MongoDB", "REST APIs", "GraphQL"],
      featured: false,
      industry: "Software Development",
      tags: ["Backend", "Node.js", "API"]
    },
    {
      title: "Marketing Specialist",
      company: "GrowthHackers",
      location: "Remote",
      salary: "$70K - $90K",
      type: "Full-time",
      description: "We're looking for a Marketing Specialist to help drive our digital marketing efforts. You'll create compelling content and analyze campaign performance to increase brand awareness.",
      requirements: ["Digital Marketing", "SEO", "Content Creation", "Analytics", "Social Media"],
      featured: false,
      industry: "Marketing",
      tags: ["Marketing", "Digital", "Remote"]
    },
    {
      title: "Mobile Developer",
      company: "AppWorks",
      location: "Seattle, WA",
      salary: "$110K - $140K",
      type: "Full-time",
      description: "Join our mobile team to build native iOS and Android applications. You'll work with product managers and designers to create intuitive and performant mobile experiences.",
      requirements: ["React Native", "iOS", "Android", "Mobile UI", "API Integration"],
      featured: true,
      industry: "Mobile Development",
      tags: ["Mobile", "React Native", "iOS/Android"]
    },
    {
      title: "Technical Writer",
      company: "DocuTech",
      location: "Remote",
      salary: "$75K - $95K",
      type: "Full-time",
      description: "We're seeking a Technical Writer to create clear and comprehensive documentation for our software products. You'll work with engineers to understand complex technical concepts and make them accessible.",
      requirements: ["Technical writing", "Documentation tools", "API documentation", "Markdown", "Technical aptitude"],
      featured: false,
      industry: "Technical Documentation",
      tags: ["Documentation", "Writing", "Remote"]
    }
  ];
  
  // Insert jobs in batches to avoid request size limitations
  const batchSize = 5;
  for (let i = 0; i < mockJobs.length; i += batchSize) {
    const batch = mockJobs.slice(i, i + batchSize);
    const { error } = await supabase.from('jobs').insert(batch);
    
    if (error) {
      console.error('Error seeding jobs batch:', error);
      return;
    }
  }
  
  console.log(`Successfully seeded ${mockJobs.length} jobs.`);
};
