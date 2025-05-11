import React from 'react';

interface TemplateOptionsProps {
    template: string;
    setTemplate: React.Dispatch<React.SetStateAction<string>>;
}

const TemplateOptions: React.FC<TemplateOptionsProps> = ({ template, setTemplate }) => (
    <div className="bg-card text-card-foreground rounded-lg border p-4">
        <h3 className="text-lg font-bold mb-3">Template Options</h3>
        <div className="space-y-2">
            <div className="flex items-center space-x-2">
                <input
                    type="radio"
                    id="standard-template"
                    checked={template === 'standard'}
                    onChange={() => setTemplate('standard')}
                    className="h-4 w-4 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary dark:focus:ring-offset-gray-800"
                />
                <label htmlFor="standard-template" className="text-sm">
                    Standard (full layout, normal spacing)
                </label>
            </div>
            <div className="flex items-center space-x-2">
                <input
                    type="radio"
                    id="compact-template"
                    checked={template === 'compact'}
                    onChange={() => setTemplate('compact')}
                    className="h-4 w-4 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary dark:focus:ring-offset-gray-800"
                />
                <label htmlFor="compact-template" className="text-sm">
                    Compact (tighter spacing, smaller margins)
                </label>
            </div>
        </div>
    </div>
);

export default TemplateOptions;