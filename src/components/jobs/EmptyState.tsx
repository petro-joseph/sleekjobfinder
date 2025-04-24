
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-secondary/50 p-4 mb-6">
        <SearchX className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">No jobs found</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        We couldn't find any jobs matching your search criteria. Try adjusting your filters or searching for something else.
      </p>
      <Button variant="outline" className="px-8">
        Clear all filters
      </Button>
    </div>
  );
};
