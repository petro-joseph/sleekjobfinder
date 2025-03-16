
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Separator } from '@/components/ui/separator'; 
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = [
    { id: 'general', name: 'General' },
    { id: 'account', name: 'Account & Billing' },
    { id: 'jobs', name: 'Job Search' },
    { id: 'resumes', name: 'Resumes & Applications' },
    { id: 'premium', name: 'Premium Features' }
  ];
  
  const faqs = [
    {
      id: 1,
      category: 'general',
      question: 'What is SleekJobs?',
      answer: 'SleekJobs is an AI-powered job platform designed to connect talent with opportunities seamlessly. We use advanced algorithms to match job seekers with positions that align with their skills, experience, and career goals.'
    },
    {
      id: 2,
      category: 'general',
      question: 'How does SleekJobs work?',
      answer: 'Our platform analyzes your resume and preferences to find and recommend relevant job opportunities. We also provide tools to help you optimize your resume, prepare for interviews, and track your applications.'
    },
    {
      id: 3,
      category: 'account',
      question: 'Is it free to create an account?',
      answer: 'Yes, creating a basic account on SleekJobs is completely free. This gives you access to job listings, the ability to save jobs, and basic resume tools. We also offer premium plans with additional features.'
    },
    {
      id: 4,
      category: 'account',
      question: 'How do I delete my account?',
      answer: 'To delete your account, go to your Profile settings, scroll to the bottom, and click on "Delete Account". Please note that this action is permanent and will remove all your data from our system.'
    },
    {
      id: 5,
      category: 'jobs',
      question: 'How often are new jobs added?',
      answer: 'Our job database is updated in real-time. We continuously crawl various job boards, company websites, and other sources to bring you the most current opportunities available.'
    },
    {
      id: 6,
      category: 'jobs',
      question: 'Can I set up job alerts?',
      answer: "Yes, you can create custom job alerts based on your preferences. You'll receive notifications when new positions matching your criteria are posted. You can set the frequency of these alerts to daily, weekly, or as they come in."
    },
    {
      id: 7,
      category: 'resumes',
      question: 'Does SleekJobs offer resume templates?',
      answer: 'Yes, we provide a variety of professionally designed resume templates suitable for different industries and career levels. You can easily customize these templates to create a resume that stands out.'
    },
    {
      id: 8,
      category: 'resumes',
      question: 'Can SleekJobs help tailor my resume for specific jobs?',
      answer: 'Absolutely! Our AI-powered resume optimization tool can analyze job descriptions and suggest specific changes to your resume to increase your chances of getting noticed by recruiters and passing through Applicant Tracking Systems.'
    },
    {
      id: 9,
      category: 'premium',
      question: 'What additional features do premium plans offer?',
      answer: 'Premium plans include advanced features such as priority application submissions, enhanced resume visibility to employers, detailed application analytics, direct messaging with recruiters, and personalized career coaching.'
    },
    {
      id: 10,
      category: 'premium',
      question: 'Can I cancel my premium subscription at any time?',
      answer: 'Yes, you can cancel your premium subscription at any time. Your premium features will remain active until the end of your current billing period. No refunds are provided for partial months.'
    },
  ];
  
  const [activeCategory, setActiveCategory] = useState('general');
  
  const filteredFaqs = searchQuery
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient bg-gradient-to-r from-primary to-primary/70">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our platform and services
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for a question..."
              className="pl-10 py-6"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Category Tabs (Desktop) */}
        <div className="hidden md:flex justify-center mb-8">
          <div className="inline-flex rounded-lg p-1 bg-secondary/50">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "ghost"}
                className={`rounded-md ${activeCategory === category.id ? '' : 'hover:bg-secondary/80'}`}
                onClick={() => {
                  setActiveCategory(category.id);
                  setSearchQuery('');
                }}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Category Dropdown (Mobile) */}
        <div className="md:hidden mb-8">
          <select
            className="w-full p-3 bg-secondary/50 rounded-lg border border-input"
            value={activeCategory}
            onChange={(e) => {
              setActiveCategory(e.target.value);
              setSearchQuery('');
            }}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          {filteredFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                  <AccordionTrigger className="text-left font-medium py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">
                No questions found matching your search. Try different keywords or browse by category.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
        
        <Separator className="my-12" />
        
        {/* Contact Section */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">
            Our support team is ready to assist you with any other questions or concerns you might have.
          </p>
          <Button className="mx-auto">
            Contact Support
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
