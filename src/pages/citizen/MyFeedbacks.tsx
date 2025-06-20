
import { Alert, AlertDescription } from '@/components/ui/alert';
import CitizenNavigation from '@/components/CitizenNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import LoadingState from '@/components/feedback/LoadingState';
import FeedbackList from '@/components/feedback/FeedbackList';
import ErrorState from '@/components/feedback/ErrorState';

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

const MyFeedbacks = () => {
  const { user, loading: authLoading } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      fetchFeedbacks();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('user-feedbacks')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'citizen_feedback',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            console.log('📡 Real-time update detected, refetching feedbacks...');
            fetchFeedbacks();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchFeedbacks = async () => {
    if (!user) {
      console.log('👤 No user found, skipping feedback fetch');
      setFeedbacks([]);
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 Fetching feedbacks for user:', user.id);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('citizen_feedback')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('❌ Error fetching feedbacks:', fetchError);
        console.error('Error details:', {
          code: fetchError.code,
          message: fetchError.message,
          details: fetchError.details,
          hint: fetchError.hint
        });
        setError(`Failed to load feedbacks: ${fetchError.message}`);
        setFeedbacks([]);
      } else {
        console.log('✅ Feedbacks fetched successfully:', data?.length || 0, 'items');
        setFeedbacks(data || []);
      }
    } catch (error: any) {
      console.error('💥 Error in fetchFeedbacks:', error);
      setError(`Unexpected error: ${error.message}`);
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-light-blue-bg">
        <CitizenNavigation />
        <div className="container mx-auto px-4 py-8">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-light-blue-bg">
        <CitizenNavigation />
        <div className="container mx-auto px-4 py-8">
          <Alert className="max-w-2xl mx-auto">
            <AlertDescription>
              Please log in to view your feedbacks.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-light-blue-bg">
        <CitizenNavigation />
        <div className="container mx-auto px-4 py-8">
          <ErrorState error={error} onRetry={fetchFeedbacks} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-blue-bg">
      <CitizenNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-government-blue mb-6 text-center">
          My Feedbacks 📋
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <FeedbackList feedbacks={feedbacks} />
        </div>
      </div>
    </div>
  );
};

export default MyFeedbacks;
