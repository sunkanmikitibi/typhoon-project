import React from 'react';

interface RiskScoreProps {
  score: number;
  showLabel?: boolean;
}

export default function RiskScore({ score, showLabel = false }: RiskScoreProps) {
  const getColor = () => {
    if (score >= 75) return 'text-danger';
    if (score >= 50) return 'text-warning';
    if (score >= 25) return 'text-primary';
    return 'text-success';
  };

  const getBg = () => {
    if (score >= 75) return 'bg-danger/10 border-danger/20';
    if (score >= 50) return 'bg-warning/10 border-warning/20';
    if (score >= 25) return 'bg-primary/10 border-primary/20';
    return 'bg-success/10 border-success/20';
  };

  const getLabel = () => {
    if (score >= 75) return 'Critical';
    if (score >= 50) return 'High';
    if (score >= 25) return 'Medium';
    return 'Low';
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border font-mono text-[11px] font-600 tabular-nums ${getBg()} ${getColor()}`}
    >
      {score}
      {showLabel && <span className="font-sans font-500 text-[10px] opacity-75">{getLabel()}</span>}
    </span>
  );
}
