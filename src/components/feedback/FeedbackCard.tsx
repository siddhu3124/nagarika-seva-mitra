
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Feedback {
  id: string;
  service_type: string;
  title: string;
  feedback_text: string;
  rating: number;
  location_details: string | null;
  district: string | null;
  mandal: string | null;
  village: string | null;
  created_at: string;
  updated_at: string;
}

interface FeedbackCardProps {
  feedback: Feedback;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => {
  const getServiceIcon = (serviceType: string) => {
    const icons: { [key: string]: string } = {
      'Healthcare': '🏥',
      'Education': '🎓',
      'Transportation': '🚌',
      'Water Supply': '💧',
      'Electricity': '⚡',
      'Sanitation': '🧹',
      'Public Safety': '🚔',
      'Infrastructure': '🏗️',
      'Government Services': '🏛️',
      'Other': '📝'
    };
    return icons[serviceType] || '📝';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="animate-fade-in hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <span className="mr-2 text-2xl">{getServiceIcon(feedback.service_type)}</span>
            {feedback.title || 'Feedback'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-gray-700">{feedback.feedback_text}</p>
          
          {feedback.location_details && (
            <div className="text-sm text-gray-600">
              📍 {feedback.location_details}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Rating:</span>
              <div className="flex">{renderStars(feedback.rating)}</div>
            </div>
            {(feedback.district || feedback.mandal || feedback.village) && (
              <div className="text-sm text-gray-500">
                {[feedback.district, feedback.mandal, feedback.village].filter(Boolean).join(' • ')}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Service: {feedback.service_type}</span>
            <span className="text-gray-400">
              Submitted: {formatDate(feedback.created_at)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
