
import React from 'react';

interface SummaryCardProps {
  summary: string;
  className?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ summary, className = '' }) => {
  return (
    <div className={className}>
      <p className="text-sm">{summary}</p>
    </div>
  );
};

export default SummaryCard;
