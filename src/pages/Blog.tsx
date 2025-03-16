
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';

const Blog = () => {
  // Sample blog posts
  const blogPosts = [
    {
      id: 1,
      title: "How to Stand Out in Technical Interviews",
      excerpt: "Learn effective strategies to make a lasting impression during your technical interviews and land your dream job.",
      date: "June 15, 2023",
      author: "Sarah Johnson",
      category: "Interviews",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      title: "The Future of Remote Work in Tech",
      excerpt: "Discover how remote work is reshaping the tech industry and what skills you need to thrive in this new landscape.",
      date: "May 28, 2023",
      author: "Michael Chen",
      category: "Industry Trends",
      image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      title: "Building a Resume That Gets Noticed",
      excerpt: "Expert tips on crafting a compelling resume that will catch recruiters' attention and help you get more interviews.",
      date: "April 12, 2023",
      author: "Emma Rodriguez",
      category: "Resume Building",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      title: "Networking Strategies for Job Seekers",
      excerpt: "Learn how to build meaningful professional connections that can open doors to new opportunities.",
      date: "March 5, 2023",
      author: "David Walker",
      category: "Networking",
      image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 5,
      title: "Salary Negotiation: Getting What You're Worth",
      excerpt: "Practical advice on how to confidently negotiate your salary and benefits package for your next job.",
      date: "February 20, 2023",
      author: "Lisa Thompson",
      category: "Career Advice",
      image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 6,
      title: "Transitioning Careers: From Traditional to Tech",
      excerpt: "A comprehensive guide for professionals looking to pivot their careers toward the technology sector.",
      date: "January 8, 2023",
      author: "Robert Jones",
      category: "Career Transitions",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient bg-gradient-to-r from-primary to-primary/70">
            Career Insights & Advice
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay up-to-date with the latest job market trends, interview tips, and career development strategies.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <Card className="overflow-hidden glass hover backdrop-blur-xl">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-video md:aspect-auto">
                <img 
                  src={blogPosts[0].image} 
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover" 
                />
              </div>
              <CardContent className="flex flex-col justify-center p-8">
                <div className="mb-2 text-sm text-primary font-medium">
                  {blogPosts[0].category} • {blogPosts[0].date}
                </div>
                <h2 className="text-2xl font-bold mb-4">{blogPosts[0].title}</h2>
                <p className="text-muted-foreground mb-6">{blogPosts[0].excerpt}</p>
                <div className="mt-auto">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 mr-3"></div>
                    <div>
                      <div className="font-medium">{blogPosts[0].author}</div>
                      <div className="text-sm text-muted-foreground">Content Writer</div>
                    </div>
                  </div>
                  <button className="text-primary font-medium hover:underline">
                    Read More →
                  </button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <Card key={post.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="aspect-video">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover" 
                />
              </div>
              <CardContent className="p-6 flex-grow flex flex-col">
                <div className="mb-2 text-xs text-primary font-medium">
                  {post.category} • {post.date}
                </div>
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 flex-grow">{post.excerpt}</p>
                <div className="mt-auto">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 mr-2"></div>
                    <div className="text-sm">{post.author}</div>
                  </div>
                  <button className="text-primary text-sm font-medium hover:underline">
                    Read More →
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
