
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DebugInfoProps {
  debugInfo: string;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ debugInfo }) => {
  if (!debugInfo) return null;

  return (
    <Alert>
      <AlertDescription>
        <strong>Debug Info:</strong> {debugInfo}
      </AlertDescription>
    </Alert>
  );
};

export default DebugInfo;
