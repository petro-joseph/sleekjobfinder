
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowRight,
  Briefcase,
  BookmarkCheck,
  Bell,
  BarChart,
  Bot,
  Rocket,
  Sparkles,
} from 'lucide-react';

/**
 * Dashboard skeleton that mirrors the exact layout of the Dashboard page
 * This allows for a seamless transition when data loads
 */
export const DashboardSkeleton = () => {
  return (
    <div className="min-h-[calc(100vh-160px)] bg-white dark:bg-background">
      <div className="container mx-auto px-4 py-6 md:py-6">
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <Card className="backdrop-blur-xl border-2 border-primary/20 shadow-lg mb-6 overflow-hidden rounded-xl hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-80" />
                  </div>
                  <Skeleton className="h-10 w-32 sm:w-40" />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { icon: <Briefcase className="h-5 w-5 text-blue-500" />, label: "Applications" },
                { icon: <BookmarkCheck className="h-5 w-5 text-green-500" />, label: "Saved Jobs" },
                { icon: <Bell className="h-5 w-5 text-yellow-500" />, label: "Job Alerts" },
                { icon: <BarChart className="h-5 w-5 text-purple-500" />, label: "Resumes" },
              ].map((item, index) => (
                <Card key={index} className="backdrop-blur-xl border-primary/20 border-2 shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer group hover:border-primary/40 rounded-xl">
                  <CardContent className="p-4 flex items-center">
                    <div className="mr-3 p-2 rounded-full bg-background/50 transition-all group-hover:scale-110">
                      {item.icon}
                    </div>
                    <div>
                      <Skeleton className="h-6 w-8 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recommended for you</h2>
              <button className="text-primary text-sm flex items-center">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden hover:shadow-md transition-all duration-200">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-12 w-12 rounded-md flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex gap-2 mt-3">
                          <Skeleton className="h-5 w-16 rounded-full" />
                          <Skeleton className="h-5 w-20 rounded-full" />
                          <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <Skeleton className="h-4 w-24" />
                          <div className="flex gap-1">
                            <Skeleton className="h-8 w-20 rounded" />
                            <Skeleton className="h-8 w-8 rounded" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="md:col-span-4">
            <Card className="overflow-hidden border-primary/20 shadow-lg bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent mb-6 hover:border-primary/40 transition-all duration-300 rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Bot className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="font-bold">Career Assistant</h3>
                </div>
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-primary/20 shadow-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent mb-6 hover:border-primary/40 transition-all duration-300 rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Sparkles className="h-5 w-5 text-primary mr-2 animate-pulse" />
                  <h3 className="font-bold">Upgrade to Premium</h3>
                </div>
                <Skeleton className="h-4 w-full mb-4" />
                <div className="space-y-3 mb-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <Rocket className="h-4 w-4 text-primary mr-2" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl border-primary/20 shadow-lg mt-6 hover:border-primary/40 transition-all duration-300 rounded-xl">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start pb-4 border-b border-border/50 last:border-0 last:pb-0">
                    <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
                    <div className="ml-3">
                      <Skeleton className="h-4 w-40 mb-1" />
                      <Skeleton className="h-3 w-24 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <div className="ml-auto">
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
