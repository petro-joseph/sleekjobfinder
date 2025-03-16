
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Target, Users, Sparkles, ThumbsUp, BarChart } from 'lucide-react';

const About = () => {
  const team = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "Former recruiter with 15+ years of experience connecting talent with opportunities.",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Sarah Chen",
      role: "Chief Technology Officer",
      bio: "AI specialist with a passion for simplifying the job search process through technology.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Marcus Taylor",
      role: "Head of Product",
      bio: "Career development expert focused on creating tools that empower job seekers.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Natalie Patel",
      role: "Director of Employer Relations",
      bio: "Builds partnerships with companies to bring exclusive opportunities to our platform.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
  ];

  const values = [
    {
      title: "User-Centric Approach",
      description: "We put job seekers at the center of everything we build, designing features that truly address their needs.",
      icon: Users
    },
    {
      title: "Innovation",
      description: "We continually push the boundaries of what's possible in career technology through AI and data science.",
      icon: Sparkles
    },
    {
      title: "Transparency",
      description: "We provide honest insights about job prospects, market trends, and career opportunities.",
      icon: ThumbsUp
    },
    {
      title: "Results-Driven",
      description: "We measure our success by the successful placements and career advancements of our users.",
      icon: BarChart
    },
  ];

  return (
    <Layout>
      <div className="relative">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-primary/5 to-background py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient bg-gradient-to-r from-primary to-primary/70">
              About SleekJobs
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              We're on a mission to revolutionize how people find jobs and build careers in the digital age.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                At SleekJobs, we believe that finding the right job shouldn't be a full-time job itself. We're dedicated to simplifying the job search process by leveraging cutting-edge technology to match talented professionals with opportunities where they can thrive.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Founded in 2022, we've already helped thousands of job seekers land positions that align with their skills, values, and career aspirations. Our AI-powered platform continuously learns and improves to provide increasingly relevant job recommendations and career insights.
              </p>
              <Button className="group">
                Learn about our approach
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-video">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Team collaboration" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-secondary/30 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2 text-primary">50K+</div>
                <div className="text-muted-foreground">Job Seekers</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2 text-primary">2,500+</div>
                <div className="text-muted-foreground">Companies</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2 text-primary">15K+</div>
                <div className="text-muted-foreground">Successful Placements</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2 text-primary">98%</div>
                <div className="text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These core principles guide our product development, customer service, and company culture
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-card/50 hover:shadow-md transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind SleekJobs who are dedicated to transforming how the world works
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <div className="text-primary text-sm mb-2">{member.role}</div>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button variant="outline" className="mx-auto">
              View Full Team
            </Button>
          </div>
        </div>
        
        {/* Join Us CTA */}
        <div className="bg-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Join Us in Reshaping Careers</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Whether you're looking for your next role or want to be part of our team, SleekJobs is where ambition meets opportunity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Find Your Next Role
              </Button>
              <Button variant="outline" size="lg">
                Explore Careers at SleekJobs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
