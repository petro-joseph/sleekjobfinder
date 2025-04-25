import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface NotificationSettingsProps {
    settings: {
        notifications: boolean;
        emailUpdates: boolean;
        darkMode: boolean;
    };
    onChange: (settings: { notifications: boolean; emailUpdates: boolean; darkMode: boolean }) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ settings, onChange }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="notifications" className="font-medium">
                        App Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                        Receive notifications about job matches and application updates
                    </p>
                </div>
                <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) => onChange({ ...settings, notifications: checked })}
                />
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="email-updates" className="font-medium">
                        Email Updates
                    </Label>
                    <p className="text-sm text-muted-foreground">
                        Receive emails about new job opportunities and career tips
                    </p>
                </div>
                <Switch
                    id="email-updates"
                    checked={settings.emailUpdates}
                    onCheckedChange={(checked) => onChange({ ...settings, emailUpdates: checked })}
                />
            </div>
        </div>
    );
};