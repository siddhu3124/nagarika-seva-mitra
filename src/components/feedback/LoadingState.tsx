
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-government-blue mx-auto"></div>
      <p className="mt-2">Loading your feedbacks...</p>
    </div>
  );
};

export default LoadingState;
