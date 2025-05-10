
import { Resume } from '@/types/resume';

// Sample resume data that matches the Resume interface
export const sampleResume: Resume = {
  id: "1",
  name: "John Doe Resume",
  file_path: "/path/to/resume.pdf",
  isPrimary: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  uploadDate: new Date(),
  contactInfo: {
    phone: "555-123-4567",
    email: "john.doe@example.com",
    linkedin: "linkedin.com/in/johndoe"
  },
  jobTitle: "Software Engineer",
  yearsOfExperience: 5,
  industries: ["Technology", "Finance"],
  skills: ["JavaScript", "React", "Node.js", "TypeScript", "SQL", "Git", "AWS"],
  summary: "Experienced software engineer with a focus on frontend development using React and TypeScript.",
  workExperiences: [
    {
      company: "Tech Corp",
      title: "Senior Frontend Engineer",
      location: "San Francisco, CA",
      startDate: "2020-01-01",
      endDate: "2023-01-01",
      responsibilities: [
        "Led the development of a new customer-facing application using React and TypeScript",
        "Improved site performance by 40% through code optimization",
        "Mentored junior developers and conducted code reviews"
      ]
    },
    {
      company: "Startup Inc",
      title: "Software Developer",
      location: "Austin, TX",
      startDate: "2018-03-01",
      endDate: "2019-12-31",
      responsibilities: [
        "Developed and maintained features for a SaaS product",
        "Collaborated with UX designers to implement responsive designs",
        "Participated in agile development cycles"
      ]
    }
  ],
  education: [
    {
      institution: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      gpa: "3.8",
      startDate: "2014-09-01",
      endDate: "2018-05-31"
    }
  ],
  projects: [
    {
      title: "Personal Portfolio Website",
      date: "2022-06-01",
      description: "Designed and developed a responsive personal website using React, Next.js, and Tailwind CSS."
    },
    {
      title: "Task Management App",
      date: "2021-11-01",
      description: "Built a task management application with React and Firebase, featuring real-time updates and user authentication."
    }
  ],
  certifications: [
    {
      name: "AWS Certified Developer",
      dateRange: "2022-2025"
    },
    {
      name: "Microsoft Certified: Azure Developer Associate",
      dateRange: "2021-2024"
    }
  ],
  additionalSkills: [
    "Docker",
    "CI/CD",
    "Agile Methodology",
    "Technical Writing"
  ]
};

// Export sampleResume as defaultResume for ResumeTailoringFlow.tsx
export const defaultResume = sampleResume;
