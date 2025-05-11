
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Rocket } from 'lucide-react';

interface PremiumWidgetProps {
  onNavigate: (path: string) => void;
}

const PremiumWidget = ({ onNavigate }: PremiumWidgetProps) => {
  return (
    <Card className="overflow-hidden border-primary/20 shadow-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent mb-6 hover:border-primary/40 transition-all duration-300 rounded-xl">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Sparkles className="h-5 w-5 text-primary mr-2 animate-pulse" />
          <h3 className="font-bold">Upgrade to Premium</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Get 5x more job matches, priority application status, and direct contact with recruiters.
        </p>
        <div className="space-y-3 mb-4">
          <div className="flex items-center">
            <Rocket className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm">Priority application status</span>
          </div>
          <div className="flex items-center">
            <Rocket className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm">AI-powered resume optimization</span>
          </div>
          <div className="flex items-center">
            <Rocket className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm">Direct message recruiters</span>
          </div>
        </div>
        <Button
          onClick={() => onNavigate('/pricing')}
          variant="gradient"
          className="w-full touch-button bg-primary text-primary-foreground"
        >
          View Plans
        </Button>
      </CardContent>
    </Card>
  );
};

export default PremiumWidget;
