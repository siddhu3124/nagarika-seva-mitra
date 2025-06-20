
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export interface FeedbackData {
  service_type: string;
  rating: number;
  feedback_text: string;
  title?: string;
  location?: string;
  location_details?: string;
  village?: string;
  mandal?: string;
  district?: string;
}

export const useFeedbackSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const submitFeedback = async (feedbackData: FeedbackData) => {
    setIsSubmitting(true);

    try {
      console.log('Attempting to submit feedback:', feedbackData);

      // Get current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication error');
      }

      // Get user ID from the users table
      let userId = null;
      if (session?.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('auth_user_id', session.user.id)
          .single();

        if (userError) {
          console.error('User lookup error:', userError);
          // Continue without user_id for anonymous feedback
        } else {
          userId = userData?.id;
          console.log('Found user ID:', userId);
        }
      }

      // Prepare feedback data for insertion
      const feedbackRecord = {
        service_type: feedbackData.service_type,
        rating: feedbackData.rating,
        feedback_text: feedbackData.feedback_text,
        title: feedbackData.title || null,
        location: feedbackData.location || null,
        location_details: feedbackData.location_details || null,
        village: feedbackData.village || null,
        mandal: feedbackData.mandal || null,
        district: feedbackData.district || null,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Inserting feedback record:', feedbackRecord);

      // Insert feedback into database
      const { data, error } = await supabase
        .from('citizen_feedback')
        .insert(feedbackRecord)
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        toast({
          title: "Submission Failed",
          description: error.message || "Failed to submit feedback. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      console.log('Feedback submitted successfully:', data);

      toast({
        title: "Feedback Submitted",
        description: "Your feedback has been submitted successfully. Thank you!",
      });

      // Navigate to thank you page or my feedbacks
      navigate('/thank-you');
      return true;

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateFeedback = (feedbackData: Partial<FeedbackData>): string[] => {
    const errors: string[] = [];

    if (!feedbackData.service_type) {
      errors.push('Service category is required');
    }

    if (!feedbackData.rating || feedbackData.rating < 1 || feedbackData.rating > 5) {
      errors.push('Rating must be between 1 and 5');
    }

    if (!feedbackData.feedback_text || feedbackData.feedback_text.trim().length === 0) {
      errors.push('Feedback text is required');
    }

    if (feedbackData.feedback_text && feedbackData.feedback_text.trim().length < 10) {
      errors.push('Feedback must be at least 10 characters long');
    }

    return errors;
  };

  return {
    isSubmitting,
    submitFeedback,
    validateFeedback
  };
};
