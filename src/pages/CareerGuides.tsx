import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, BookOpen, Target, Award, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const CareerGuides = () => {
  const guides = [
    {
      id: 1,
      title: "Resume Building",
      description: "Learn how to craft a professional resume that highlights your skills and experience.",
      icon: FileText,
      color: "bg-blue-500/10 text-blue-500",
      categories: ["Entry Level", "Mid-Career", "Executive"],
      link: "/guides/resume"
    },
    {
      id: 2,
      title: "Interview Preparation",
      description: "Prepare for common interview questions and develop strategies to impress your potential employers.",
      icon: BookOpen,
      color: "bg-green-500/10 text-green-500",
      categories: ["Behavioral", "Technical", "Case Study"],
      link: "/guides/interview"
    },
    {
      id: 3,
      title: "Salary Negotiation",
      description: "Understand how to negotiate compensation packages that reflect your true value and potential.",
      icon: Target,
      color: "bg-purple-500/10 text-purple-500",
      categories: ["Research", "Technique", "Benefits"],
      link: "/guides/salary"
    },
    {
      id: 4,
      title: "Career Transitions",
      description: "Learn how to successfully pivot your career path and enter new industries or roles.",
      icon: TrendingUp,
      color: "bg-orange-500/10 text-orange-500",
      categories: ["Planning", "Skill Acquisition", "Positioning"]
    },
    {
      id: 5,
      title: "Leadership Development",
      description: "Develop essential leadership skills to advance your career and manage teams effectively.",
      icon: Award,
      color: "bg-red-500/10 text-red-500",
      categories: ["Communication", "Delegation", "Vision"]
    },
    {
      id: 6,
      title: "Networking Strategies",
      description: "Build and maintain professional relationships that can advance your career prospects.",
      icon: Users,
      color: "bg-teal-500/10 text-teal-500",
      categories: ["Online", "Events", "Follow-ups"]
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient bg-gradient-to-r from-primary to-primary/70">
            Career Guides
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive resources to help you navigate every stage of your professional journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <Card key={guide.id} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg ${guide.color} flex items-center justify-center mb-4`}>
                  <guide.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{guide.title}</h3>
                <p className="text-muted-foreground mb-4">{guide.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {guide.categories.map((category, idx) => (
                    <span key={idx} className="text-xs bg-secondary px-2 py-1 rounded-full">
                      {category}
                    </span>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  asChild
                >
                  <Link to={guide.link}>View Guide</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 bg-secondary/50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Personalized Career Advice?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our career experts can provide tailored guidance based on your unique background, goals, and challenges.
          </p>
          <Button size="lg">
            Schedule a Consultation
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CareerGuides;
