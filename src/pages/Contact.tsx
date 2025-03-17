
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  HelpCircle, 
  RefreshCw,
  Briefcase
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully', {
      description: 'We\'ll get back to you as soon as possible.'
    });
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const contactOptions = [
    {
      title: 'General Inquiries',
      description: 'Questions about our company or services',
      icon: MessageSquare,
      email: 'info@company.com'
    },
    {
      title: 'Support',
      description: 'Get help with your account or our platform',
      icon: HelpCircle,
      email: 'support@company.com'
    },
    {
      title: 'Job Assistance',
      description: 'Get help with your job search or applications',
      icon: Briefcase,
      email: 'careers@company.com'
    },
    {
      title: 'Partnerships',
      description: 'Explore business opportunities with us',
      icon: RefreshCw,
      email: 'partnerships@company.com'
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient bg-gradient-to-r from-primary to-primary/70">
            Get In Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you. Reach out with any questions, feedback, or inquiries
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-3 mt-1" />
                  <div>
                    <p className="font-medium">Main Office</p>
                    <p className="text-muted-foreground">123 Career Street, San Francisco, CA 94107</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-primary mr-3 mt-1" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">(123) 456-7890</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-primary mr-3 mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">contact@company.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Department Contacts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactOptions.map((option, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">
                          <option.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{option.title}</p>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                          <a href={`mailto:${option.email}`} className="text-sm text-primary hover:underline mt-1 block">
                            {option.email}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                    <Input 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe" 
                      required 
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com" 
                      required 
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                    <Input 
                      id="subject" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?" 
                      required 
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                    <Textarea 
                      id="message" 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message here..." 
                      required 
                      rows={5} 
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden h-96 mb-12">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.1332402797194!2d-122.39633292463437!3d37.78296241420496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808580627b69b7bb%3A0x6144db98a65df1c6!2sSan%20Francisco%2C%20CA%2094107!5e0!3m2!1sen!2sus!4v1687884113752!5m2!1sen!2sus" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location"
          ></iframe>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
