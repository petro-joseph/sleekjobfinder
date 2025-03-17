
import Layout from '@/components/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const FAQ = () => {
  const faqs = [
    {
      question: "How do I create an account?",
      answer: "You can create an account by clicking the 'Sign Up' button in the top right corner of the homepage. Fill in your details, accept the terms and conditions, and you'll be ready to go."
    },
    {
      question: "Is this service free to use?",
      answer: "We offer both free and premium plans. The basic job search functionality is free, while advanced features like resume builder, personalized job alerts, and career coaching require a subscription. Check our Pricing page for more details."
    },
    {
      question: "How do I apply for a job?",
      answer: "Once you've found a job you're interested in, click the 'Apply Now' button on the job details page. You'll be guided through our application process, which typically involves submitting your resume and answering any job-specific questions."
    },
    {
      question: "Can I save jobs for later?",
      answer: "Yes, you can save jobs to review later. Simply click the bookmark icon on any job listing or job details page. You can access your saved jobs from your dashboard or the 'Saved Jobs' section."
    },
    {
      question: "How do I create a resume?",
      answer: "Navigate to the Resume Builder in your dashboard. Our tool will guide you through creating a professional resume step-by-step. You can choose from different templates, add your experience, education, and skills, and export your resume in multiple formats."
    },
    {
      question: "How can I get notified about new job postings?",
      answer: "Set up job alerts by specifying your job preferences, location, and keywords. You'll receive notifications when new jobs matching your criteria are posted. You can manage your alerts from your dashboard."
    },
    {
      question: "What should I do if I forget my password?",
      answer: "If you forget your password, click the 'Forgot Password' link on the login page. Enter your email address, and we'll send you instructions to reset your password."
    },
    {
      question: "Can employers see my profile?",
      answer: "Your public profile is only visible to employers when you apply for their jobs. You can control your privacy settings in your account to determine what information is shared with employers."
    },
    {
      question: "How can I contact support?",
      answer: "You can reach our support team through the 'Contact' page or by emailing support@jobfinder.com. We typically respond within 24 hours during business days."
    },
    {
      question: "Can I delete my account?",
      answer: "Yes, you can delete your account at any time from your account settings. Please note that this action is permanent and will remove all your data from our system."
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient bg-gradient-to-r from-primary to-primary/70">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our platform, job applications, and account management
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="bg-secondary/50 rounded-xl p-8 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">
            Our support team is here to help. Contact us anytime and we'll get back to you as soon as possible.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="default">
              <a href="/contact">Contact Support</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/support">Visit Help Center</a>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
