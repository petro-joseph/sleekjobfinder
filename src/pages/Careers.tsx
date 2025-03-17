
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase } from 'lucide-react';

const Careers = () => {
  const openPositions = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      description: "We're looking for an experienced Frontend Developer to join our engineering team and help build the next generation of our platform."
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Join our design team to create intuitive, engaging experiences for job seekers and employers using our platform."
    },
    {
      title: "Content Marketing Manager",
      department: "Marketing",
      location: "New York, NY",
      type: "Full-time",
      description: "Drive our content strategy to establish our brand as a thought leader in the career development space."
    },
    {
      title: "Customer Success Specialist",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      description: "Help our users get the most out of our platform by providing exceptional support and guidance."
    },
    {
      title: "Data Scientist",
      department: "Data",
      location: "Boston, MA",
      type: "Full-time",
      description: "Use your expertise in machine learning and data analysis to improve our job matching algorithms and user experience."
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "San Francisco, CA",
      type: "Full-time",
      description: "Lead the development of new features and improvements to our platform, working closely with engineering, design, and other teams."
    }
  ];

  const benefits = [
    {
      title: "Comprehensive Health Benefits",
      description: "Medical, dental, and vision coverage for you and your dependents"
    },
    {
      title: "Flexible Work Arrangements",
      description: "Remote-friendly culture with flexible hours"
    },
    {
      title: "Professional Development",
      description: "Learning stipend and dedicated time for growth"
    },
    {
      title: "Generous PTO",
      description: "Unlimited vacation policy and paid company holidays"
    },
    {
      title: "Equity Compensation",
      description: "Share in the company's success with equity grants"
    },
    {
      title: "Wellness Programs",
      description: "Gym memberships, mental health resources, and more"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient bg-gradient-to-r from-primary to-primary/70">
            Join Our Team
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to transform how people find and build their careers. 
            Join us and help create the future of work.
          </p>
        </div>

        {/* Culture Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="rounded-xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Team collaborating in office" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Culture</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We believe that great products come from teams that care deeply about the problems they're solving.
              </p>
              <p>
                Our culture is built on collaboration, continuous learning, and a deep commitment to helping people find meaningful work.
              </p>
              <p>
                We celebrate diversity of thought and background, knowing that different perspectives lead to better solutions.
              </p>
              <p>
                While we work hard, we also value work-life balance and create an environment where everyone can thrive both professionally and personally.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">Benefits & Perks</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-card p-6 rounded-xl border">
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">Open Positions</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {openPositions.map((position, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <Badge className="mb-2">{position.department}</Badge>
                  <h3 className="text-xl font-bold mb-2">{position.title}</h3>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {position.location}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {position.type}
                    </div>
                  </div>
                  
                  <p className="mb-6 text-muted-foreground">{position.description}</p>
                  
                  <Button variant="outline">
                    View Position
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary/5 rounded-xl p-8 text-center border border-primary/20">
          <h2 className="text-2xl font-bold mb-4">Don't see the right position?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're always on the lookout for talented individuals who are passionate about our mission. 
            Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <Button size="lg">
            Submit Your Resume
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Careers;
