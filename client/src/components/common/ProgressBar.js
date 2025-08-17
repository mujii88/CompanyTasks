import React from 'react';

const ProgressBar = ({ progress, className = "" }) => {
  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
      <div
        className={`h-2.5 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
        style={{ width: `${Math.min(progress, 100)}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
