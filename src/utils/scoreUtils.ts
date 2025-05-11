export const getScoreLabel = (score: number): string => {
    if (score < 5) return 'Poor';
    if (score < 7) return 'Fair';
    return 'Good';
};

export const getScoreColor = (score: number): string => {
    if (score < 5) return 'text-red-500';
    if (score < 7) return 'text-yellow-500';
    return 'text-green-500';
};

export const getGaugeStyle = (score: number): { background: string } => {
    const percentage = (score / 10) * 100;
    let color;
    if (score < 5) color = '#ef4444'; // Tailwind red-500
    else if (score < 7) color = '#f59e0b'; // Tailwind yellow-500
    else color = '#22c55e'; // Tailwind green-500
    return {
        background: `conic-gradient(${color} ${percentage}%, #e5e7eb ${percentage}% 100%)`,
    };
};