
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import Layout from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout hideFooter>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="container max-w-md mx-auto px-4 py-8 text-center">
          <div className="space-y-6">
            {/* Error Code */}
            <div className="relative">
              <h1 className="text-[120px] md:text-[150px] font-bold text-primary opacity-10 select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="h-16 w-16 text-primary animate-pulse" />
              </div>
            </div>
            
            {/* Message */}
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold">Page not found</h2>
              <p className="text-muted-foreground">
                We couldn't find the page you're looking for. It might have been moved or deleted.
              </p>
            </div>
            
            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="default" className="gap-2">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
