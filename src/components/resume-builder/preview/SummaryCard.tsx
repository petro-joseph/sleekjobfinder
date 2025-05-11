
import React from 'react';
import { Card } from '../../ui/card';

interface SummaryCardProps {
  summary: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  return (
    <Card className="p-4">
      <p className="text-sm">{summary}</p>
    </Card>
  );
};
