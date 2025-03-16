
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Your message has been sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };
  
  const contactChannels = [
    {
      title: "Email Us",
      description: "support@sleekjobs.com",
      icon: Mail,
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      title: "Call Us",
      description: "+1 (800) 123-4567",
      icon: Phone,
      color: "bg-green-500/10 text-green-500"
    },
    {
      title: "Visit Us",
      description: "123 Innovation Way, San Francisco, CA 94103",
      icon: MapPin,
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      title: "Office Hours",
      description: "Monday-Friday: 9am-6pm EST",
      icon: Clock,
      color: "bg-orange-500/10 text-orange-500"
    }
  ];

  const faqs = [
    {
      question: "How quickly will I get a response?",
      answer: "We aim to respond to all inquiries within 24 hours during business days."
    },
    {
      question: "Is there a phone support option?",
      answer: "Yes, our phone support is available Monday through Friday from 9am to 6pm EST."
    },
    {
      question: "Can I request a demo of premium features?",
      answer: "Absolutely! You can request a demo through this contact form or directly via email."
    },
    {
      question: "Do you offer support in languages other than English?",
      answer: "Currently, we offer support in English, Spanish, and French."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/5 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gradient bg-gradient-to-r from-primary to-primary/70">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or feedback? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Channels */}
      <div className="container mx-auto px-4 py-12 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactChannels.map((channel, index) => (
            <Card key={index} className="hover:shadow-md transition-all duration-300">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full ${channel.color} flex items-center justify-center mb-4`}>
                  <channel.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{channel.title}</h3>
                <p className="text-muted-foreground">{channel.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Form and FAQs */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-5 gap-12">
          {/* Contact Form */}
          <Card className="md:col-span-3 hover:shadow-md transition-all duration-300">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us how we can assist you..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loader mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQs */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-semibold">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-secondary/30 rounded-lg">
              <h3 className="font-semibold mb-2">Need Urgent Help?</h3>
              <p className="text-muted-foreground mb-4">
                For immediate assistance with urgent matters, please call our priority support line.
              </p>
              <Button variant="outline" className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                Call Priority Support
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="container mx-auto px-4 py-12">
        <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
          <div className="aspect-video w-full">
            {/* Replace with actual map component if needed */}
            <div className="h-full w-full bg-secondary/30 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-primary/60" />
                <p className="text-lg font-medium">
                  123 Innovation Way, San Francisco, CA 94103
                </p>
                <p className="text-muted-foreground mt-2">
                  Interactive map would be displayed here
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Contact;
