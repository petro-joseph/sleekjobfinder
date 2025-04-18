
import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  User, 
  SendHorizontal, 
  Mic, 
  MicOff, 
  Sparkles,
  BookOpen,
  GraduationCap,
  BriefcaseIcon,
  DollarSignIcon,
  RefreshCcw,
  XCircle,
  MessageSquare
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Assistant replies dataset based on common career questions
const sampleResponses = {
  greeting: "Hi there! I'm your AI Career Assistant. I can help with job searching, interview preparation, salary negotiation, and more. What can I help you with today?",
  jobSearch: "When job searching, focus on quality over quantity. Tailor your resume and cover letter for each position, and leverage your network. Make sure your LinkedIn profile is complete and up-to-date.",
  interview: "For interview preparation, research the company thoroughly, prepare stories using the STAR method (Situation, Task, Action, Result), and practice common questions. Don't forget to prepare questions to ask them too!",
  salary: "For salary negotiation, research industry standards for your position and location. Consider the total compensation package, not just the base salary. Be confident but polite, and focus on the value you bring.",
  resume: "Your resume should be concise (1-2 pages), highlight achievements rather than duties, and be tailored for each job application. Use action verbs and quantify results when possible.",
  noAnswer: "I don't have specific information on that topic yet, but I'm always learning. Could you try asking in a different way, or would you like guidance on job search, interviews, or salary negotiation instead?"
};

// Sample suggested questions
const suggestedQuestions = [
  "How can I improve my resume?",
  "What are common interview mistakes to avoid?",
  "How do I negotiate a higher salary?",
  "What should I include in my LinkedIn profile?",
  "How do I explain a gap in my employment history?",
  "What are good questions to ask at the end of an interview?"
];

// Conversation topic categories
const topics = [
  { 
    id: 'job-search', 
    name: 'Job Search', 
    icon: <BriefcaseIcon className="w-4 h-4" />,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
  },
  { 
    id: 'interview', 
    name: 'Interviews', 
    icon: <MessageSquare className="w-4 h-4" />,
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  },
  { 
    id: 'salary', 
    name: 'Salary', 
    icon: <DollarSignIcon className="w-4 h-4" />,
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
  },
  { 
    id: 'skills', 
    name: 'Skills', 
    icon: <GraduationCap className="w-4 h-4" />,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
  }
];

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  topic?: string;
}

const CareerAssistant = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Effect to redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to access the Career Assistant", {
        description: "You've been redirected to the login page"
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Effect to add initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          content: sampleResponses.greeting,
          sender: 'assistant',
          timestamp: new Date(),
        }
      ]);
    }
  }, [messages.length]);

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Function to determine which canned response to use based on the message content
  const getCannedResponse = (message: string) => {
    const lowerMsg = message.toLowerCase();
    
    // Determine topic based on keywords
    let topic = null;
    if (lowerMsg.includes('job') || lowerMsg.includes('search') || lowerMsg.includes('find') || lowerMsg.includes('application')) {
      topic = 'job-search';
      return { response: sampleResponses.jobSearch, topic };
    } else if (lowerMsg.includes('interview') || lowerMsg.includes('question') || lowerMsg.includes('answer')) {
      topic = 'interview';
      return { response: sampleResponses.interview, topic };
    } else if (lowerMsg.includes('salary') || lowerMsg.includes('negotiat') || lowerMsg.includes('offer') || lowerMsg.includes('compensation')) {
      topic = 'salary';
      return { response: sampleResponses.salary, topic };
    } else if (lowerMsg.includes('resume') || lowerMsg.includes('cv')) {
      topic = 'job-search';
      return { response: sampleResponses.resume, topic };
    }
    
    return { response: sampleResponses.noAnswer, topic };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const { response, topic } = getCannedResponse(inputMessage);
      
      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'assistant',
        timestamp: new Date(),
        topic
      };
      
      setCurrentTopic(topic);
      setMessages(prev => [...prev, assistantMessage]);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuestionClick = (question: string) => {
    setInputMessage(question);
    // Optional: auto-send when a suggested question is clicked
    // setTimeout(() => handleSendMessage(), 100);
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording logic would go here
      setIsRecording(false);
      toast.info("Voice recording stopped");
    } else {
      // Start recording logic would go here
      setIsRecording(true);
      toast.info("Voice recording started. Speak clearly into your microphone.");
      
      // Simulate receiving voice input after 3 seconds
      setTimeout(() => {
        setInputMessage("How should I prepare for behavioral interviews?");
        setIsRecording(false);
      }, 3000);
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        id: Date.now().toString(),
        content: sampleResponses.greeting,
        sender: 'assistant',
        timestamp: new Date(),
      }
    ]);
    setCurrentTopic(null);
  };

  // Get personalized recommendations based on user's progress
  const getPersonalizedRecommendations = () => {
    if (!user) return [];
    
    const recommendations = [];
    
    // If user has upcoming interviews
    if (user.applications && user.applications.some(app => app.status === 'interview')) {
      recommendations.push("Practice these common behavioral questions for your upcoming interviews");
    }
    
    // If user has few applications
    if (!user.applications || user.applications.length < 3) {
      recommendations.push("Increase your application success rate with tailored resume tips");
    }
    
    // If user hasn't completed their profile
    if (!user.isOnboardingComplete) {
      recommendations.push("Complete your profile to get better job recommendations");
    }
    
    return recommendations;
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-160px)] bg-gradient-mesh">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
            {/* Main chat section */}
            <div className="lg:col-span-8 flex flex-col">
              <Card className="backdrop-blur-xl border border-primary/20 shadow-lg overflow-hidden rounded-xl">
                <Tabs defaultValue="chat" className="w-full">
                  <div className="flex justify-between items-center px-4 py-2 border-b">
                    <div className="flex items-center">
                      <Bot className="h-5 w-5 text-primary mr-2" />
                      <h2 className="text-xl font-semibold">Career Assistant</h2>
                    </div>
                    <TabsList>
                      <TabsTrigger value="chat" className="text-sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </TabsTrigger>
                      <TabsTrigger value="history" className="text-sm">
                        <BookOpen className="h-4 w-4 mr-2" />
                        History
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="chat" className="flex flex-col h-[600px] m-0">
                    {/* Chat messages */}
                    <div 
                      className="flex-1 overflow-y-auto p-4 space-y-4"
                      ref={chatContainerRef}
                    >
                      <AnimatePresence>
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`flex max-w-[80%] ${
                                message.sender === 'user' 
                                  ? 'bg-primary text-primary-foreground ml-auto rounded-2xl rounded-tr-sm' 
                                  : 'bg-secondary rounded-2xl rounded-tl-sm'
                              } p-3 shadow`}
                            >
                              <div className="flex-shrink-0 mr-2">
                                {message.sender === 'user' ? (
                                  <User className="h-5 w-5" />
                                ) : (
                                  <Bot className="h-5 w-5" />
                                )}
                              </div>
                              <div className="flex-1 relative">
                                <div className="whitespace-pre-wrap text-sm">
                                  {message.content}
                                </div>
                                <div className="text-xs mt-1 opacity-70">
                                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                {message.topic && (
                                  <div className="mt-2">
                                    {topics.find(t => t.id === message.topic)?.icon}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        {isSubmitting && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                          >
                            <div className="bg-secondary rounded-2xl rounded-tl-sm p-3 shadow-sm max-w-[80%]">
                              <div className="flex items-center space-x-2">
                                <Bot className="h-5 w-5" />
                                <div className="flex space-x-1">
                                  <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                  <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                  <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                      </AnimatePresence>
                    </div>
                    
                    {/* Suggested questions */}
                    <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-border/40">
                      {suggestedQuestions.map((q, i) => (
                        <Badge 
                          key={i} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-secondary/50 transition-colors py-1"
                          onClick={() => handleQuestionClick(q)}
                        >
                          {q}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Input area */}
                    <div className="p-4 border-t border-border/40">
                      <div className="flex items-end gap-2">
                        <Textarea
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Ask me anything about your career..."
                          className="min-h-[60px] resize-none rounded-lg"
                          disabled={isRecording}
                        />
                        <div className="flex flex-col gap-2">
                          <Button
                            size="icon"
                            variant={isRecording ? "destructive" : "outline"}
                            onClick={toggleRecording}
                            className="rounded-full h-10 w-10 flex-shrink-0"
                            type="button"
                          >
                            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                          </Button>
                          <Button
                            size="icon"
                            onClick={handleSendMessage}
                            className="rounded-full h-10 w-10 flex-shrink-0 bg-primary"
                            disabled={!inputMessage.trim() || isSubmitting}
                            type="button"
                          >
                            <SendHorizontal className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearConversation}
                          className="text-xs"
                        >
                          <RefreshCcw className="h-3 w-3 mr-1" />
                          Clear conversation
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history" className="m-0 p-0 h-[600px] overflow-y-auto">
                    <div className="p-6 text-center">
                      <div className="my-8">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                        <h3 className="text-lg font-medium">Conversation History</h3>
                        <p className="text-muted-foreground mt-2">
                          Your past conversations will appear here.
                        </p>
                        <Button className="mt-4" variant="outline">
                          Start a new conversation
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
            
            {/* Right sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Personalized tips */}
              <Card className="overflow-hidden border-primary/20 shadow-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent hover:border-primary/40 transition-all duration-300 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Sparkles className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-bold">Personalized Tips</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {getPersonalizedRecommendations().length > 0 ? (
                      getPersonalizedRecommendations().map((tip, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          className="flex items-start"
                        >
                          <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
                          <p className="text-sm ml-3">{tip}</p>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Complete your profile to get personalized career tips.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Popular topics */}
              <Card className="backdrop-blur-xl border-primary/20 shadow-lg hover:border-primary/40 transition-all duration-300 rounded-xl">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4">Popular Topics</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {topics.map((topic) => (
                      <Button
                        key={topic.id}
                        variant="outline"
                        className="h-auto py-3 px-3 justify-start border border-border"
                        onClick={() => {
                          setInputMessage(`Tell me about ${topic.name.toLowerCase()}`);
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${topic.color}`}>
                          {topic.icon}
                        </div>
                        <span>{topic.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Pro features - shown conditionally */}
              <Card className="backdrop-blur-xl border-primary/20 shadow-lg hover:border-primary/40 transition-all duration-300 rounded-xl">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Premium Features</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upgrade to access advanced career coaching features:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-2 text-primary">✓</span>
                      Resume review with detailed feedback
                    </li>
                    <li className="flex items-center">
                      <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-2 text-primary">✓</span>
                      Mock interview practice with industry experts
                    </li>
                    <li className="flex items-center">
                      <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-2 text-primary">✓</span>
                      Salary negotiation scripts for your industry
                    </li>
                  </ul>
                  <Button 
                    onClick={() => navigate('/pricing')} 
                    variant="gradient" 
                    className="w-full mt-4 touch-button bg-primary text-primary-foreground"
                  >
                    Upgrade to Premium
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CareerAssistant;
