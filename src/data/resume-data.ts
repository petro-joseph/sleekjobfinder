
import { Resume, JobPosting } from '@/types/resume';

export const defaultResume: Resume = {
  id: "default-resume-1",
  name: "Alex Johnson",
  file_path: "", // Empty string for default resume
  isPrimary: true,
  contactInfo: {
    phone: "555-123-4567",
    email: "alex.johnson@example.com",
    linkedin: "linkedin.com/in/alexjohnson"
  },
  jobTitle: "Frontend Developer",
  yearsOfExperience: 4,
  industries: ["Technology", "E-commerce"],
  skills: [
    "JavaScript", 
    "React", 
    "TypeScript", 
    "HTML5", 
    "CSS3", 
    "Redux", 
    "GraphQL"
  ],
  summary: "Frontend Developer with 4 years of experience building responsive web applications. Proficient in React, TypeScript, and modern frontend technologies. Passionate about creating intuitive user interfaces and optimizing application performance.",
  workExperiences: [
    {
      company: "TechFusion Inc.",
      title: "Senior Frontend Developer",
      location: "San Francisco, CA",
      startDate: "Jan 2021",
      endDate: "Present",
      responsibilities: [
        "Developed and maintained multiple React applications serving over 50,000 daily users",
        "Implemented state management using Redux and Context API, reducing code complexity by 30%",
        "Collaborated with UX designers to implement responsive designs across all device types",
        "Led a team of 3 developers to deliver projects on time and within scope",
        "Optimized application performance, reducing load times by 40%"
      ]
    },
    {
      company: "Innovate Solutions",
      title: "Frontend Developer",
      location: "Seattle, WA",
      startDate: "Mar 2019",
      endDate: "Dec 2020",
      responsibilities: [
        "Built interactive UI components using React and TypeScript",
        "Integrated RESTful APIs and GraphQL to fetch and display data",
        "Implemented unit tests using Jest, achieving 80% code coverage",
        "Participated in Agile development processes, including daily standups and sprint planning"
      ]
    },
    {
      company: "Web Dynamics",
      title: "Junior Web Developer",
      location: "Portland, OR",
      startDate: "Jun 2017",
      endDate: "Feb 2019",
      responsibilities: [
        "Developed responsive websites using HTML5, CSS3, and JavaScript",
        "Built and maintained WordPress sites for small businesses",
        "Created interactive forms and validated user inputs using JavaScript",
        "Collaborated with designers to implement pixel-perfect layouts"
      ]
    }
  ],
  education: [
    {
      institution: "University of Washington",
      degree: "Bachelor of Science in Computer Science",
      gpa: "3.7",
      startDate: "Sep 2013",
      endDate: "Jun 2017"
    }
  ],
  projects: [
    {
      title: "E-commerce Dashboard",
      date: "2020",
      description: "Built a React-based dashboard for e-commerce analytics, featuring real-time data visualization and filtering capabilities"
    },
    {
      title: "Weather App",
      date: "2019",
      description: "Developed a mobile-first weather application using React and OpenWeather API, implementing geolocation and favorites"
    }
  ]
};

export const defaultJobPosting: JobPosting = {
  title: "Senior Frontend Engineer",
  company: "NextTech Solutions",
  location: "San Francisco, CA",
  salaryRange: "$120,000 - $150,000",
  employmentType: "Full-time",
  requiredYearsOfExperience: 5,
  industries: ["Technology", "SaaS", "Fintech"],
  requiredSkills: [
    "JavaScript",
    "React",
    "TypeScript",
    "Redux",
    "Next.js",
    "Responsive Design",
    "CSS-in-JS",
    "Jest",
    "Cypress",
    "Performance Optimization",
    "RESTful APIs",
    "Webpack",
    "Git",
    "Agile Methodologies",
    "AWS",
    "Node.js",
    "GraphQL",
    "UI/UX Principles"
  ],
  description: "NextTech Solutions is seeking a Senior Frontend Engineer to join our growing team. The ideal candidate will have strong experience with React, TypeScript, and modern frontend technologies. You will be responsible for developing and maintaining high-performance web applications, collaborating with designers and backend engineers, and mentoring junior developers."
};
