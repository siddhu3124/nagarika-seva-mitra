
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CitizenNavigation from '@/components/CitizenNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-light-blue-bg">
        <CitizenNavigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-government-blue mx-auto"></div>
            <p className="mt-2">Loading your feedbacks...</p>
          </div>
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
          <Alert className="max-w-2xl mx-auto" variant="destructive">
            <AlertDescription>
              {error}
              <br />
              <button 
                onClick={fetchFeedbacks}
                className="mt-2 text-sm underline hover:no-underline"
              >
                Try again
              </button>
            </AlertDescription>
          </Alert>
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
        
        <div className="max-w-4xl mx-auto space-y-4">
          {feedbacks.map((feedback) => (
            <Card key={feedback.id} className="animate-fade-in hover:shadow-md transition-shadow">
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
          ))}
          
          {feedbacks.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-semibold mb-2">No feedbacks yet</h3>
                <p className="text-gray-600">Submit your first feedback to see it here.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyFeedbacks;
