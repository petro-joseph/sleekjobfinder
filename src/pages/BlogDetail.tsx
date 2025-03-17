
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar, User, Tag, Share2, Facebook, Twitter, Linkedin, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Shell from '@/components/Shell';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
  authorTitle?: string;
  relatedPosts?: {
    id: number;
    title: string;
    image: string;
  }[];
}

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sample blog posts for the demo
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "How to Stand Out in Technical Interviews",
      excerpt: "Learn effective strategies to make a lasting impression during your technical interviews and land your dream job.",
      content: `
        <p>Technical interviews can be intimidating, but with the right preparation, you can stand out from the competition and impress your potential employers.</p>
        
        <h2>Research the Company</h2>
        <p>Before your interview, take time to thoroughly research the company. Understand their products, services, culture, and recent news. This knowledge demonstrates your genuine interest and helps you tailor your responses to align with the company's goals and values.</p>
        
        <h2>Practice Problem-Solving Aloud</h2>
        <p>Technical interviews often include coding challenges or problem-solving exercises. Practice talking through your thought process as you solve problems. This helps interviewers understand your approach and reasoning, even if you don't immediately arrive at the optimal solution.</p>
        
        <h2>Prepare Concrete Examples</h2>
        <p>Have specific examples ready to showcase your technical skills and achievements. Use the STAR method (Situation, Task, Action, Result) to structure your responses, making them clear and impactful.</p>
        
        <h2>Ask Thoughtful Questions</h2>
        <p>Prepare insightful questions about the role, team, and company. This demonstrates your critical thinking skills and genuine interest in the position. Questions about technical challenges, development processes, or future projects can lead to meaningful discussions.</p>
        
        <h2>Follow Up Effectively</h2>
        <p>After the interview, send a personalized thank-you email within 24 hours. Reference specific topics discussed during the interview to show your attentiveness and continued interest in the role.</p>
        
        <p>By implementing these strategies, you'll not only demonstrate your technical abilities but also leave a lasting positive impression on your interviewers, increasing your chances of landing your dream job.</p>
      `,
      date: "June 15, 2023",
      author: "Sarah Johnson",
      category: "Interviews",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      authorTitle: "Senior Technical Recruiter",
      relatedPosts: [
        {
          id: 2,
          title: "The Future of Remote Work in Tech",
          image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
          id: 3,
          title: "Building a Resume That Gets Noticed",
          image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
          id: 5,
          title: "Salary Negotiation: Getting What You're Worth",
          image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        }
      ]
    },
    {
      id: 2,
      title: "The Future of Remote Work in Tech",
      excerpt: "Discover how remote work is reshaping the tech industry and what skills you need to thrive in this new landscape.",
      content: `
        <p>The COVID-19 pandemic accelerated the adoption of remote work in the tech industry, and this trend is likely to continue shaping the future of work for years to come.</p>
        
        <h2>Rise of Hybrid Models</h2>
        <p>Many companies are adopting hybrid models that combine remote and in-office work. This approach offers flexibility while maintaining opportunities for in-person collaboration and team building.</p>
        
        <h2>Global Talent Pools</h2>
        <p>Remote work has opened access to global talent pools, allowing companies to hire the best candidates regardless of location. This shift is creating more diverse teams and new opportunities for professionals worldwide.</p>
        
        <h2>Essential Remote Work Skills</h2>
        <p>To thrive in remote work environments, tech professionals need to develop strong communication skills, self-discipline, and proficiency with collaboration tools. The ability to work asynchronously and manage time effectively is increasingly valuable.</p>
        
        <h2>Technology Enablers</h2>
        <p>Advancements in virtual collaboration tools, project management software, and cloud-based development environments have made remote work more efficient and productive than ever before.</p>
        
        <h2>Work-Life Integration</h2>
        <p>Remote work is blurring the boundaries between professional and personal life. Finding healthy work-life integration, rather than strict separation, is becoming an important skill for sustained success and wellbeing.</p>
        
        <p>As remote work continues to evolve, both employers and employees must adapt to new ways of working, communicating, and measuring productivity. Those who embrace these changes and develop the necessary skills will be well-positioned to succeed in the future of tech work.</p>
      `,
      date: "May 28, 2023",
      author: "Michael Chen",
      category: "Industry Trends",
      image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      authorTitle: "Remote Work Strategist",
      relatedPosts: [
        {
          id: 1,
          title: "How to Stand Out in Technical Interviews",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
          id: 4,
          title: "Networking Strategies for Job Seekers",
          image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
          id: 6,
          title: "Transitioning Careers: From Traditional to Tech",
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulate API fetch with a timeout
    const timer = setTimeout(() => {
      const foundPost = blogPosts.find(p => p.id === Number(id));
      setPost(foundPost || null);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleShare = (platform: string) => {
    if (!post) return;
    
    const url = window.location.href;
    const title = post.title;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
      default:
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        break;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <Shell>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="loader mb-4" />
            <p className="text-muted-foreground">Loading article...</p>
          </div>
        </Shell>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <Shell>
          <div className="bg-secondary/50 rounded-lg p-6 md:p-8 text-center mt-8">
            <h2 className="text-2xl font-semibold mb-4">Article Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        </Shell>
      </Layout>
    );
  }

  return (
    <Layout>
      <Shell>
        <div className="mb-4 md:mb-6">
          <Button asChild variant="ghost" className="group" size="sm">
            <Link to="/blog">
              <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Blog
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="w-full aspect-[16/9] rounded-xl overflow-hidden mb-6">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="flex flex-wrap gap-2 items-center mb-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {post.category}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {post.date}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 mr-3"></div>
                <div>
                  <div className="font-medium">{post.author}</div>
                  <div className="text-sm text-muted-foreground">{post.authorTitle}</div>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => handleShare('linkedin')}>
                      <Linkedin className="mr-2 h-4 w-4" />
                      <span>LinkedIn</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('twitter')}>
                      <Twitter className="mr-2 h-4 w-4" />
                      <span>Twitter</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('facebook')}>
                      <Facebook className="mr-2 h-4 w-4" />
                      <span>Facebook</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('copy')}>
                      <Link2 className="mr-2 h-4 w-4" />
                      <span>Copy Link</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Content */}
          <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert mb-10 blog-content">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          
          {/* Related Posts */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {post.relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`} className="group">
                    <div className="rounded-lg overflow-hidden">
                      <div className="aspect-[16/10] overflow-hidden">
                        <img 
                          src={relatedPost.image} 
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                        />
                      </div>
                      <h3 className="mt-3 font-medium text-foreground group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </Shell>
    </Layout>
  );
};

export default BlogDetail;
