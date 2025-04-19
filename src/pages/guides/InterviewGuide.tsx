
import { Shell } from '@/components/Shell';
import { SectionHeading } from '@/components/ui/section-heading';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Play, MessageSquare } from 'lucide-react';
import Layout from '@/components/Layout';

const InterviewGuide = () => {
  const categories = [
    {
      title: "Behavioral Interviews",
      description: "Master the STAR method and common behavioral questions",
      topics: [
        "Situation-Task-Action-Result framework",
        "Leadership experience examples",
        "Conflict resolution scenarios",
        "Team collaboration stories"
      ]
    },
    {
      title: "Technical Interviews",
      description: "Prepare for technical assessments and coding challenges",
      topics: [
        "Algorithm problem-solving",
        "System design principles",
        "Code review best practices",
        "Technical documentation"
      ]
    },
    {
      title: "Case Study Interviews",
      description: "Learn how to analyze and present business cases",
      topics: [
        "Problem structuring",
        "Data analysis",
        "Solution development",
        "Presentation skills"
      ]
    }
  ];

  return (
    <Layout>
      <Shell>
        <div className="space-y-8">
          <SectionHeading 
            title="Interview Preparation Guide"
            subtitle="Comprehensive strategies to help you succeed in any interview format"
          />

          <div className="grid gap-6 md:grid-cols-3">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold">{category.title}</h3>
                  <p className="text-muted-foreground">{category.description}</p>
                  <ul className="space-y-2">
                    {category.topics.map((topic, idx) => (
                      <li key={idx} className="flex gap-2 items-center">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full mt-4">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-primary/5">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Practice Interviews</h3>
                  <p className="text-sm text-muted-foreground">
                    Schedule a mock interview with our career experts
                  </p>
                </div>
                <Button className="ml-auto">Schedule</Button>
              </CardContent>
            </Card>

            <Card className="bg-primary/5">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Get Expert Feedback</h3>
                  <p className="text-sm text-muted-foreground">
                    Review your interview performance with professionals
                  </p>
                </div>
                <Button className="ml-auto">Connect</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Shell>
    </Layout>
  );
};

export default InterviewGuide;
