
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const EmptyState: React.FC = () => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-lg font-semibold mb-2">No feedbacks yet</h3>
        <p className="text-gray-600">Submit your first feedback to see it here.</p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
