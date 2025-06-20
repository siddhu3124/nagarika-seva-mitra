
import React from 'react';
import CitizenNavigation from '@/components/CitizenNavigation';
import FeedbackForm from '@/components/FeedbackForm';

const CitizenFeedbackForm = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <CitizenNavigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-government-blue mb-2">
              నాగరిక అభిప్రాయం | Citizen Feedback
            </h1>
            <p className="text-gray-600">
              Share your experience with government services
            </p>
          </div>
          
          <FeedbackForm />
        </div>
      </div>
    </div>
  );
};

export default CitizenFeedbackForm;
