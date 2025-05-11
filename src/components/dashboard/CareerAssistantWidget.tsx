
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

interface CareerAssistantWidgetProps {
  onNavigate: (path: string) => void;
}

const CareerAssistantWidget = ({ onNavigate }: CareerAssistantWidgetProps) => {
  return (
    <Card className="overflow-hidden border-primary/20 shadow-lg bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent mb-6 hover:border-primary/40 transition-all duration-300 rounded-xl">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Bot className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="font-bold">Career Assistant</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Get personalized career advice, interview preparation, and salary negotiation tips from our AI assistant.
        </p>
        <Button
          onClick={() => onNavigate('/career-assistant')}
          variant="outline"
          className="w-full touch-button"
        >
          Chat with Career Assistant
        </Button>
      </CardContent>
    </Card>
  );
};

export default CareerAssistantWidget;
