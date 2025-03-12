
export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "SleekJobs completely transformed my job search. The AI resume tailoring helped me land interviews at top tech companies within days.",
    author: "Sarah Johnson",
    role: "Software Engineer",
    company: "Google",
  },
  {
    id: 2,
    quote: "The auto-apply feature saved me countless hours. I was able to apply to over 50 relevant positions while focusing on preparing for interviews.",
    author: "Michael Chen",
    role: "Product Manager",
    company: "Stripe",
  },
  {
    id: 3,
    quote: "After struggling for months to find remote work, SleekJobs helped me land my dream job in just two weeks. The personalized job matches were spot on.",
    author: "Emily Rodriguez",
    role: "UX Designer",
    company: "Figma",
  },
  {
    id: 4,
    quote: "As a career changer, I was worried about breaking into tech. SleekJobs not only found me relevant positions but helped optimize my resume to highlight transferable skills.",
    author: "David Kim",
    role: "Data Analyst",
    company: "Airbnb",
  },
];
