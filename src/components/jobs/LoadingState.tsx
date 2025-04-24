
import { Loader2 } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-lg font-medium text-muted-foreground">
        Loading jobs...
      </p>
    </div>
  );
};

export const LoadingSpinner = () => {
  return <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />;
};
