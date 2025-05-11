import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle, ChevronDown } from 'lucide-react';

interface WhatsChangedProps {
    selectedSkills: string[];
}

const WhatsChanged: React.FC<WhatsChangedProps> = ({ selectedSkills }) => (
    <div className="bg-card text-card-foreground rounded-lg border">
        <h3 className="text-lg font-bold p-4 border-b">What's Changed</h3>
        <Collapsible defaultOpen className="border-b">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50">
                <div className="flex items-center text-left">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Summary Enhanced</span>
                </div>
                <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 text-sm text-muted-foreground">
                We've rewritten the summary to align with the job, emphasizing key skills and responsibilities.
            </CollapsibleContent>
        </Collapsible>
        <Collapsible defaultOpen className="border-b">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50">
                <div className="flex items-center text-left">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Missing Skills Added</span>
                </div>
                <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 text-sm text-muted-foreground">
                <p>Added {selectedSkills.length} missing skills that are relevant to the job:</p>
                <ul className="list-disc pl-5 mt-1">
                    {selectedSkills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                    ))}
                </ul>
            </CollapsibleContent>
        </Collapsible>
        <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50">
                <div className="flex items-center text-left">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Work Experience Enhanced</span>
                </div>
                <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 text-sm text-muted-foreground">
                Updated descriptions to highlight relevant achievements and incorporate job-specific keywords.
            </CollapsibleContent>
        </Collapsible>
    </div>
);

export default WhatsChanged;