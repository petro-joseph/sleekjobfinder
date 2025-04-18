
import { Shell } from '@/components/Shell';
import { SectionHeading } from '@/components/ui/section-heading';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '@/components/Layout';

const ResumeGuide = () => {
  const sections = [
    {
      title: "Entry Level Resume Tips",
      content: "Learn how to showcase your potential when you have limited experience",
      points: [
        "Highlight relevant coursework and projects",
        "Emphasize transferable skills from internships",
        "Structure your education section effectively",
        "Include relevant volunteer work and extracurriculars"
      ]
    },
    {
      title: "Mid-Career Resume Strategies",
      content: "Position yourself for career advancement with a powerful resume",
      points: [
        "Quantify your achievements with metrics",
        "Showcase leadership and management skills",
        "Highlight industry-specific certifications",
        "Focus on career progression"
      ]
    },
    {
      title: "Executive Resume Writing",
      content: "Create an executive resume that demonstrates strategic leadership",
      points: [
        "Emphasize business impact and ROI",
        "Showcase board and stakeholder management",
        "Highlight strategic initiatives and vision",
        "Include speaking engagements and thought leadership"
      ]
    }
  ];

  return (
    <Layout>
      <Shell>
        <div className="space-y-8">
          <SectionHeading 
            title="Resume Building Guide"
            subtitle="Master the art of crafting compelling resumes for every career stage"
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                  <p className="text-muted-foreground">{section.content}</p>
                  <ul className="space-y-2">
                    {section.points.map((point, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-secondary/50 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Download Our Resume Templates</h3>
                <p className="text-muted-foreground">
                  Get started with our professionally designed resume templates
                </p>
              </div>
              <Button className="flex gap-2">
                <Download className="h-4 w-4" />
                Download Templates
              </Button>
            </div>
          </Card>
        </div>
      </Shell>
    </Layout>
  );
};

export default ResumeGuide;
