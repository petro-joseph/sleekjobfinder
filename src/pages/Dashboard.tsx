
// Dashboard.tsx
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setApplications([]);
        } else {
          setApplications(data as any[]);
        }
        setLoading(false);
      });
  }, [user]);

  const total = applications.length;
  const applied = applications.filter(a => a.status === "applied").length;
  const interviews = applications.filter(a => a.status === "interview").length;
  const offers = applications.filter(a => a.status === "offer_received").length;
  const rejected = applications.filter(a => a.status === "rejected").length;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Welcome back! Here's a summary of your job application progress.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>All Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? "..." : total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Applied</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? "..." : applied}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? "..." : interviews}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Offers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? "..." : offers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? "..." : rejected}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
