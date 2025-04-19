
import { Button } from "@/components/ui/button";
import { Mail, Phone, Linkedin, Edit } from "lucide-react";
import { Resume } from "@/types/resume";

interface ResumeHeaderProps {
  resume: Resume;
  onEdit: () => void;
}

export const ResumeHeader = ({ resume, onEdit }: ResumeHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">{resume.name}</h1>
        <Button
          onClick={onEdit}
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          {resume.contactInfo.email}
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          {resume.contactInfo.phone}
        </div>
        <div className="flex items-center gap-2">
          <Linkedin className="h-4 w-4" />
          {resume.contactInfo.linkedin}
        </div>
      </div>
    </div>
  );
};
