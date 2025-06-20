
import React from 'react';
import FeedbackCard from './FeedbackCard';
import EmptyState from './EmptyState';

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

interface FeedbackListProps {
  feedbacks: Feedback[];
}

const FeedbackList: React.FC<FeedbackListProps> = ({ feedbacks }) => {
  if (feedbacks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((feedback) => (
        <FeedbackCard key={feedback.id} feedback={feedback} />
      ))}
    </div>
  );
};

export default FeedbackList;
