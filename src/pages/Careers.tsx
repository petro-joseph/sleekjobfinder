
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, MapPin, Briefcase } from 'lucide-react';

const Careers = () => {
  const departments = [
    { id: "engineering", name: "Engineering" },
    { id: "product", name: "Product" },
    { id: "design", name: "Design" },
    { id: "marketing", name: "Marketing" },
    { id: "sales", name: "Sales" },
    { id: "operations", name: "Operations" }
  ];
  
  const openings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "engineering",
      location: "Remote (US)",
      type: "Full-time",
      postedDate: "2 weeks ago"
    },
    {
      id: 2,
      title: "Backend Engineer",
      department: "engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      postedDate: "3 days ago"
    },
    {
      id: 3,
      title: "Product Manager",
      department: "product",
      location: "New York, NY",
      type: "Full-time",
      postedDate: "1 week ago"
    },
    {
      id: 4,
      title: "UX/UI Designer",
      department: "design",
      location: "Remote (Global)",
      type: "Full-time",
      postedDate: "4 days ago"
    },
    {
      id: 5,
      title: "Growth Marketing Manager",
      department: "marketing",
      location: "Austin, TX",
      type: "Full-time",
      postedDate: "5 days ago"
    },
    {
      id: 6,
      title: "Account Executive",
      department: "sales",
      location: "Chicago, IL",
      type: "Full-time",
      postedDate: "Just now"
    },
    {
      id: 7,
      title: "Technical Recruiter",
      department: "operations",
      location: "Remote (US)",
      type: "Full-time",
      postedDate: "3 weeks ago"
    },
    {
      id: 8,
      title: "Data Scientist",
      department: "engineering",
      location: "Boston, MA",
      type: "Full-time",
      postedDate: "2 days ago"
    }
  ];
  
  const benefits = [
    {
      title: "Flexible Work",
      description: "Work from anywhere with flexible hours that fit your life"
    },
    {
      title: "Competitive Compensation",
      description: "Salary packages that recognize your skills and experience"
    },
    {
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs"
    },
    {
      title: "Professional Growth",
      description: "Learning stipends and career development opportunities"
    },
    {
      title: "Company Equity",
      description: "Share in our success with employee stock options"
    },
    {
      title: "Generous Time Off",
      description: "Unlimited PTO policy that encourages work-life balance"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary/5 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient bg-gradient-to-r from-primary to-primary/70">
            Join Our Team
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Help us build the future of career development and job searching
          </p>
          <Button size="lg" className="group">
            View Open Positions <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Culture Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-6">Our Culture</h2>
            <p className="text-lg text-muted-foreground mb-6">
              At SleekJobs, we've built a culture that celebrates innovation, diversity, and impact. We believe in giving our team the autonomy to do their best work while collaborating toward a shared mission of transforming how people find and advance in their careers.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              Whether you're working remotely or from one of our global offices, you'll be part of a supportive community that values your unique perspective and encourages you to grow both personally and professionally.
            </p>
          </div>
          <div className="order-1 md:order-2 relative rounded-xl overflow-hidden aspect-video">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Team collaboration" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Work With Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We offer benefits that support your well-being, growth, and success
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-card/50 hover:shadow-md transition-all duration-300">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find your place on our team and help shape the future of careers
          </p>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            {departments.map(dept => (
              <TabsTrigger key={dept.id} value={dept.id}>{dept.name}</TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <div className="space-y-4">
              {openings.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </TabsContent>
          
          {departments.map(dept => (
            <TabsContent key={dept.id} value={dept.id} className="mt-4">
              <div className="space-y-4">
                {openings
                  .filter(job => job.department === dept.id)
                  .map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-12 text-center bg-secondary/50 p-8 rounded-xl">
          <h3 className="text-2xl font-bold mb-4">Don't see a role that fits?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <Button>
            Submit Your Resume
          </Button>
        </div>
      </div>
    </Layout>
  );
};

// Job Card Component
const JobCard = ({ job }: { job: any }) => {
  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <Badge variant="outline" className="ml-2">{job.type}</Badge>
              {job.postedDate === "Just now" && (
                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">New</Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Briefcase className="mr-1 h-4 w-4" />
                {job.department.charAt(0).toUpperCase() + job.department.slice(1)}
              </div>
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                {job.location}
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                Posted {job.postedDate}
              </div>
            </div>
          </div>
          <Button variant="outline" className="md:self-auto self-start">
            View Role
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Careers;
