
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DownloadButtonsProps {
    onDownload: (format: 'pdf' | 'docx') => Promise<void>;
}

const DownloadButtons: React.FC<DownloadButtonsProps> = ({ onDownload }) => {
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [isGeneratingDOCX, setIsGeneratingDOCX] = useState(false);
    const { toast } = useToast();

    const handleClick = async (format: 'pdf' | 'docx') => {
        if (format === 'pdf') {
            setIsGeneratingPDF(true);
            try {
                await onDownload(format);
            } catch (error) {
                console.error(`Error generating ${format.toUpperCase()}:`, error);
                toast({
                    title: 'Download Failed',
                    description: `There was an error generating the ${format.toUpperCase()} file. Please try again.`,
                    variant: 'destructive',
                });
            } finally {
                setIsGeneratingPDF(false);
            }
        } else {
            setIsGeneratingDOCX(true);
            try {
                await onDownload(format);
            } catch (error) {
                console.error(`Error generating ${format.toUpperCase()}:`, error);
                toast({
                    title: 'Download Failed',
                    description: `There was an error generating the ${format.toUpperCase()} file. Please try again.`,
                    variant: 'destructive',
                });
            } finally {
                setIsGeneratingDOCX(false);
            }
        }
    };

    return (
        <div className="bg-card text-card-foreground rounded-lg border p-4">
            <h2 className="text-lg font-bold mb-3">Download Resume</h2>
            <div className="space-y-3">
                <Button
                    variant="outline"
                    className="w-full"
                    size="sm"
                    onClick={() => handleClick('pdf')}
                    disabled={isGeneratingPDF || isGeneratingDOCX}
                >
                    <Download className="mr-2 h-4 w-4" />
                    {isGeneratingPDF ? 'Generating PDF...' : 'Download as PDF'}
                </Button>
                <Button
                    variant="outline"
                    className="w-full"
                    size="sm"
                    onClick={() => handleClick('docx')}
                    disabled={isGeneratingPDF || isGeneratingDOCX}
                >
                    <Download className="mr-2 h-4 w-4" />
                    {isGeneratingDOCX ? 'Generating DOCX...' : 'Download as Word (.docx)'}
                </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
                Files will download directly to your device. No data is saved on our servers.
            </p>
        </div>
    );
};

export default DownloadButtons;
