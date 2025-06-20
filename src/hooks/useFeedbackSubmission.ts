
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
      console.log('🚀 Starting feedback submission...');
      console.log('📝 Feedback data:', feedbackData);

      // Get current user session
      console.log('🔐 Checking authentication...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Session error:', sessionError);
        throw new Error(`Authentication error: ${sessionError.message}`);
      }

      console.log('👤 Session status:', session ? 'Authenticated' : 'Anonymous');

      // Get user ID from the users table if authenticated
      let userId = null;
      if (session?.user) {
        console.log('🔍 Looking up user in database...');
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('auth_user_id', session.user.id)
          .single();

        if (userError) {
          console.warn('⚠️ User lookup error (continuing as anonymous):', userError);
        } else if (userData) {
          userId = userData.id;
          console.log('✅ Found user ID:', userId);
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

      console.log('📋 Inserting feedback record:', feedbackRecord);

      // Insert feedback into database
      const { data, error } = await supabase
        .from('citizen_feedback')
        .insert(feedbackRecord)
        .select()
        .single();

      if (error) {
        console.error('❌ Database insert error:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        toast({
          title: "Submission Failed",
          description: `Database error: ${error.message}. ${error.hint ? `Hint: ${error.hint}` : ''}`,
          variant: "destructive"
        });
        return false;
      }

      console.log('✅ Feedback submitted successfully:', data);

      toast({
        title: "Feedback Submitted",
        description: "Your feedback has been submitted successfully. Thank you!",
      });

      // Navigate to thank you page
      navigate('/thank-you');
      return true;

    } catch (error: any) {
      console.error('💥 Submission error:', error);
      console.error('Error stack:', error.stack);
      
      toast({
        title: "Submission Failed",
        description: `Failed to submit feedback: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateFeedback = (feedbackData: Partial<FeedbackData>): string[] => {
    const errors: string[] = [];
    console.log('🔍 Validating feedback data:', feedbackData);

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

    console.log('📊 Validation result:', errors.length > 0 ? `${errors.length} errors found` : 'Valid');
    return errors;
  };

  return {
    isSubmitting,
    submitFeedback,
    validateFeedback
  };
};
