
import { Shell } from '@/components/Shell';
import { SectionHeading } from '@/components/ui/section-heading';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp, BarChart } from 'lucide-react';
import Layout from '@/components/Layout';

const SalaryGuide = () => {
  const topics = [
    {
      title: "Research Strategies",
      icon: Target,
      content: "Learn how to research industry-standard compensation",
      points: [
        "Using salary databases effectively",
        "Understanding total compensation packages",
        "Industry-specific salary trends",
        "Geographic pay differences"
      ]
    },
    {
      title: "Negotiation Techniques",
      icon: TrendingUp,
      content: "Master the art of salary negotiation",
      points: [
        "Timing your negotiation",
        "Making counteroffers",
        "Handling difficult conversations",
        "Negotiating beyond salary"
      ]
    },
    {
      title: "Benefits Discussion",
      icon: BarChart,
      content: "Navigate benefits and perks negotiations",
      points: [
        "Stock options and equity",
        "Healthcare and insurance",
        "Retirement benefits",
        "Work-life balance perks"
      ]
    }
  ];

  return (
    <Layout>
      <Shell>
        <div className="space-y-8">
          <SectionHeading 
            title="Salary Negotiation Guide"
            subtitle="Learn to negotiate compensation packages that reflect your true value"
          />

          <div className="grid gap-6 md:grid-cols-3">
            {topics.map((topic, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <topic.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{topic.title}</h3>
                  <p className="text-muted-foreground">{topic.content}</p>
                  <ul className="space-y-2">
                    {topic.points.map((point, idx) => (
                      <li key={idx} className="text-sm">{point}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-secondary/50">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Ready to Negotiate Your Next Offer?</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Get personalized advice from our career experts to help you negotiate the best possible compensation package
                </p>
                <Button size="lg">Schedule a Consultation</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Shell>
    </Layout>
  );
};

export default SalaryGuide;
