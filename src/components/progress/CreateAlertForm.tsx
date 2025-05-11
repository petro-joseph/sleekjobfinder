
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell } from 'lucide-react';
import { toast } from "sonner";

interface CreateAlertFormProps {
  onCreateAlert: (query: string, location: string, frequency: string) => void;
  isCreatingAlert: boolean;
}

const CreateAlertForm: React.FC<CreateAlertFormProps> = React.memo(({ onCreateAlert, isCreatingAlert }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [frequency, setFrequency] = useState('daily');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter keywords for the alert');
      return;
    }
    onCreateAlert(query.trim(), location.trim(), frequency);
  }, [onCreateAlert, query, location, frequency]);

  return (
    <Card className="glass hover backdrop-blur-xl border-primary/20 shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle>Create Job Alert</CardTitle>
        <CardDescription>
          Get notified when new jobs matching your criteria are posted
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alert-keywords">Keywords</Label>
            <Input
              id="alert-keywords"
              placeholder="e.g. React, Frontend Developer"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="transition-all border-muted/30 focus:border-primary"
              required
              disabled={isCreatingAlert}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alert-location">Location (Optional)</Label>
            <Input
              id="alert-location"
              placeholder="e.g. Remote, New York"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="transition-all border-muted/30 focus:border-primary"
              disabled={isCreatingAlert}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alert-frequency">Alert Frequency</Label>
            <Select
              value={frequency}
              onValueChange={setFrequency}
              disabled={isCreatingAlert}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isCreatingAlert} className="w-full">
            {isCreatingAlert ? <div className="loader-sm mr-2" /> : <Bell className="h-4 w-4 mr-2" />}
            {isCreatingAlert ? 'Creating...' : 'Create Alert'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
});

export default CreateAlertForm;
