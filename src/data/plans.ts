
export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  billing: 'monthly' | 'annually';
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    billing: 'monthly',
    description: 'Basic job search tools to get started.',
    features: [
      'Access to job listings',
      'Basic resume builder',
      'Limited job applications (10/month)',
      'Email support',
    ],
    cta: 'Get Started',
  },
  {
    id: 'pro',
    name: 'Job Seeker',
    price: '$29',
    billing: 'monthly',
    description: 'Advanced tools for serious job seekers.',
    features: [
      'Everything in Free',
      'AI resume tailoring',
      'Unlimited job applications',
      'Application tracking',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Career Accelerator',
    price: '$79',
    billing: 'monthly',
    description: 'Complete suite for career advancement.',
    features: [
      'Everything in Job Seeker',
      'Auto-apply to matched jobs',
      'AI cover letter generation',
      'Interview preparation tools',
      'Career coaching session (1/month)',
      'Premium job listings access',
    ],
    cta: 'Contact Sales',
  },
];
