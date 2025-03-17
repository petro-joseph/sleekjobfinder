
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
    },
    {
      name: "Emma Rodriguez",
      role: "Head of Product",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
    },
    {
      name: "David Parker",
      role: "Head of Customer Success",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient bg-gradient-to-r from-primary to-primary/70">
            Our Mission
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to make job searching easier, more effective, and more personal for everyone.
            Our platform connects talented professionals with the right opportunities to help them build fulfilling careers.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded in 2018, our platform emerged from a simple observation: job searching was needlessly complex, impersonal, and inefficient.
              </p>
              <p>
                Our founder, Sarah Johnson, experienced firsthand the frustration of navigating complex job boards, sending applications into the void, and receiving little guidance during her job search after graduate school.
              </p>
              <p>
                She envisioned a platform that would not only connect people with opportunities but provide tools, resources, and guidance throughout the entire career journey.
              </p>
              <p>
                Today, we've helped over 2 million professionals find meaningful work through our intelligent matching system, personalized guidance, and comprehensive career tools.
              </p>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Our team working together" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">User-Centered</h3>
              <p className="text-muted-foreground">
                We put job seekers first in everything we do, designing our platform around real needs and continuously adapting based on feedback.
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Inclusivity</h3>
              <p className="text-muted-foreground">
                We believe everyone deserves access to meaningful work and strive to make our platform accessible and useful for people of all backgrounds.
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously innovate to provide smarter tools and insights that make the job search process more effective and less stressful.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Leadership Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-36 h-36 rounded-full overflow-hidden mx-auto mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-secondary/50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Team</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our mission. Check out our open positions.
          </p>
          <Button asChild size="lg">
            <Link to="/careers">View Open Positions</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default About;
