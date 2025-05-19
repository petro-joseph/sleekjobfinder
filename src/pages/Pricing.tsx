
import { useState } from 'react';
import Layout from '@/components/Layout';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { pricingPlans } from '@/data/plans';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from '@/components/ui/card';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
            <SectionHeading
              title="Simple, Transparent Pricing"
              subtitle="Choose the plan that's right for your job search needs. All plans include access to our core job search platform."
              centered
            />

            <div className="inline-flex items-center p-1 mt-8 border rounded-full bg-secondary/50 backdrop-blur-sm">
              <Button
                variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
                className={`rounded-full ${billingCycle === 'monthly' ? '' : 'text-muted-foreground'}`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </Button>
              <Button
                variant={billingCycle === 'annually' ? 'default' : 'ghost'}
                className={`rounded-full ${billingCycle === 'annually' ? '' : 'text-muted-foreground'}`}
                onClick={() => setBillingCycle('annually')}
              >
                Annually
                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={plan.id}
                className={`p-6 border transition-all duration-500 ${plan.popular
                    ? 'shadow-lg ring-2 ring-primary/20 relative z-10 scale-105 md:scale-100 md:transform md:hover:scale-105'
                    : 'shadow-sm hover:shadow'
                  } ${plan.popular ? 'glass' : ''} hover`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full shadow-md">
                    Most Popular
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {billingCycle === 'annually'
                        ? `$${parseInt(plan.price.substring(1)) * 0.8}`
                        : plan.price}
                    </span>
                    <span className="text-muted-foreground">
                      /{billingCycle === 'annually' ? 'year' : 'month'}
                    </span>
                  </div>

                  <Button
                    className={`w-full mb-6 ${plan.popular ? 'gradient' : 'bg-secondary text-primary hover:bg-secondary/80'}`}
                    variant={plan.popular ? 'gradient' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </div>

                <div className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-3" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions about our plans and features."
            centered
            className="max-w-3xl mx-auto"
          />

          <div className="max-w-3xl mx-auto mt-8 glassmorphism p-8 rounded-xl">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Can I switch plans later?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, you'll receive credit towards your next billing cycle.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How does the auto-apply feature work?</AccordionTrigger>
                <AccordionContent>
                  The auto-apply feature uses AI to identify jobs that match your skills and preferences, then automatically submits applications on your behalf. You can set criteria for the types of jobs you want to apply to, and our system handles the rest.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
                <AccordionContent>
                  We offer a 7-day money-back guarantee on all paid plans. If you're not satisfied with our service within the first week, contact our support team for a full refund.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>How many job applications can I make?</AccordionTrigger>
                <AccordionContent>
                  With the Free plan, you can make up to 10 applications per month. The Job Seeker plan includes unlimited applications, and the Career Accelerator plan includes both unlimited applications and our auto-apply feature.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Can I cancel my subscription anytime?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can cancel your subscription at any time. Your plan will remain active until the end of the current billing cycle, and you won't be charged again.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="heading-lg mb-6 text-gradient bg-gradient-to-r from-primary to-primary/70">Ready to accelerate your job search?</h2>
          <p className="paragraph mb-8">
            Join thousands of professionals who have found their dream jobs faster with KaziHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full">
              Get Started for Free
            </Button>
            <Button size="lg" variant="outline" className="rounded-full glass">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
