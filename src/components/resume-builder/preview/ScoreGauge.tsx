import React from 'react';
import { MatchData } from '@/types/resume';
import { getScoreLabel, getScoreColor, getGaugeStyle } from '@/utils/scoreUtils';

interface ScoreGaugeProps {
    matchData: MatchData;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ matchData }) => (
    <div className="bg-card text-card-foreground rounded-lg border p-6">
        <div className="flex flex-col items-center mb-4">
            <div className="relative w-24 h-24 mb-2">
                <div
                    className="w-full h-full rounded-full"
                    style={getGaugeStyle(matchData.finalScore)}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold">{matchData.finalScore}/10</span>
                    </div>
                </div>
            </div>
            <p className={`text-base font-medium ${getScoreColor(matchData.finalScore)}`}>
                {getScoreLabel(matchData.finalScore)}
            </p>
        </div>
        <p className="text-center mb-2">
            Great! Your score jumped from {matchData.initialScore} to {matchData.finalScore}, closer to landing that interview!
        </p>
    </div>
);

export default ScoreGauge;