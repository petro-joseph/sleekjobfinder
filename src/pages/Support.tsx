
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, FileQuestion, FileText, Settings, Book, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const Support = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Support request submitted', {
      description: 'We\'ll get back to you as soon as possible.'
    });
    setEmail('');
    setSubject('');
    setMessage('');
  };

  const supportCategories = [
    {
      title: 'General Questions',
      description: 'Get help with basic account, billing, and platform questions',
      icon: MessageSquare
    },
    {
      title: 'Job Applications',
      description: 'Assistance with applying for jobs and application status',
      icon: FileQuestion
    },
    {
      title: 'Resume Builder',
      description: 'Help with creating and optimizing your resume',
      icon: FileText
    },
    {
      title: 'Account Settings',
      description: 'Update your profile, password, or notification preferences',
      icon: Settings
    },
    {
      title: 'Career Resources',
      description: 'Access guides, tutorials, and educational materials',
      icon: Book
    },
    {
      title: 'Employer Support',
      description: 'Help with posting jobs and managing applications',
      icon: Users
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient bg-gradient-to-r from-primary to-primary/70">
            Support Center
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help you with any questions or issues you have with our platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {supportCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="mb-4">
                  <category.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                <Button variant="outline" size="sm">
                  Get Help
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold mb-6 text-center">Contact Support</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com" 
                  required 
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                <Input 
                  id="subject" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What's your issue about?" 
                  required 
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                <Textarea 
                  id="message" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your issue in detail" 
                  required 
                  rows={5} 
                />
              </div>

              <Button type="submit" className="w-full">
                Submit Request
              </Button>
            </form>
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              For urgent matters, please call us at <span className="font-medium">1-800-JOB-HELP</span> (Monday-Friday, 9am-5pm PST)
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Support;
