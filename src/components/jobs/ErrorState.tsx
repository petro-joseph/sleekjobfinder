
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-destructive/10 p-4 mb-6">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">Something went wrong</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {error?.message || "We encountered an error while loading jobs. Please try again."}
      </p>
      <Button onClick={onRetry} className="px-8">
        Try again
      </Button>
    </div>
  );
};
