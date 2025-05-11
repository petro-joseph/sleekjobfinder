
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, X } from 'lucide-react';
import { JobAlert } from '@/types/progress';
import { formatDate } from '@/utils/progressHelpers';

interface AlertListProps {
  alerts: JobAlert[];
  isLoading: boolean;
  onUpdateAlert: (alertId: string, frequency: string) => void;
  onDeleteAlert: (alertId: string) => void;
  isUpdatingAlert: boolean;
  isDeletingAlert: boolean;
}

const AlertList: React.FC<AlertListProps> = React.memo(({
  alerts,
  isLoading,
  onUpdateAlert,
  onDeleteAlert,
  isUpdatingAlert,
  isDeletingAlert
}) => {

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Loading job alerts...</div>;
  }

  if (alerts.length === 0) {
    return (
      <Card className="bg-transparent border">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <X className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">
            No alerts created yet. Create one to stay updated.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Card key={alert.id} className="bg-transparent border transition-all hover:bg-muted/5 rounded-xl">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-grow min-w-0">
                <h4 className="font-medium mb-1 truncate" title={alert.query}>
                  {alert.query}
                </h4>
                {alert.location && (
                  <p className="text-sm text-muted-foreground mb-2 truncate" title={alert.location}>
                    {alert.location}
                  </p>
                )}
                <div className="flex items-center text-xs text-muted-foreground flex-wrap">
                  <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span>{alert.frequency}</span>
                  <span className="mx-2">•</span>
                  <span>Created on {formatDate(alert.created_at)}</span>
                </div>
              </div>

              <div className="flex gap-2 items-center flex-shrink-0">
                <Select
                  value={alert.frequency}
                  onValueChange={(frequency) => onUpdateAlert(alert.id, frequency)}
                  disabled={isUpdatingAlert || isDeletingAlert}
                >
                  <SelectTrigger className="w-[120px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteAlert(alert.id)}
                  disabled={isUpdatingAlert || isDeletingAlert}
                  className="h-8 w-8 p-0"
                  title="Delete Alert"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

export default AlertList;
