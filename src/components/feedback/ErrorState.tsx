
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <Alert className="max-w-2xl mx-auto" variant="destructive">
      <AlertDescription>
        {error}
        <br />
        <button 
          onClick={onRetry}
          className="mt-2 text-sm underline hover:no-underline"
        >
          Try again
        </button>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorState;
