import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

const EditBaseResume: React.FC = () => (
    <div className="bg-card text-card-foreground rounded-lg border p-4">
        <Button
            variant="outline"
            className="w-full"
            size="sm"
        >
            <Edit className="mr-2 h-4 w-4" />
            Edit Base Resume
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
            Changes made here apply to your base resume and affect future resumes.
        </p>
    </div>
);

export default EditBaseResume;