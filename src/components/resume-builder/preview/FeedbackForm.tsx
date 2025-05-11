import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface FeedbackFormProps {
    onFeedback: (positive: boolean) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onFeedback }) => {
    const [showFeedbackInput, setShowFeedbackInput] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');

    const submitFeedback = () => {
        alert(`Feedback submitted: ${feedbackText}`);
        setShowFeedbackInput(false);
        setFeedbackText('');
    };

    return (
        <div className="bg-card text-card-foreground rounded-lg border p-4">
            <h3 className="text-lg font-bold mb-3">How's Your Resume?</h3>
            {showFeedbackInput ? (
                <div className="space-y-3">
                    <Textarea
                        placeholder="Tell us what you expected or how we can improve..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        rows={3}
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowFeedbackInput(false)}>
                            Cancel
                        </Button>
                        <Button size="sm" onClick={submitFeedback} disabled={!feedbackText.trim()}>
                            Submit
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex gap-2">
                    <Button
                        className="flex-1"
                        onClick={() => onFeedback(true)}
                        variant="outline"
                    >
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Looks Great!
                    </Button>
                    <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => {
                            setShowFeedbackInput(true);
                            onFeedback(false);
                        }}
                    >
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        Not What I Expected
                    </Button>
                </div>
            )}
        </div>
    );
};

export default FeedbackForm;