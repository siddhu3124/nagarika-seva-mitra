
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
  description: string;
  rating: number;
  status: string;
  priority: string;
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
            table: 'feedbacks',
            filter: `citizen_id=eq.${user.id}`
          },
          () => {
            fetchFeedbacks(); // Refetch when feedbacks change
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
      setFeedbacks([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .eq('citizen_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching feedbacks:', error);
        setFeedbacks([]);
      } else {
        setFeedbacks(data || []);
      }
    } catch (error) {
      console.error('Error in fetchFeedbacks:', error);
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (serviceType: string) => {
    const icons: { [key: string]: string } = {
      'roads': '🛣️',
      'water': '💧',
      'ration': '🍚',
      'phc': '🏥',
      'education': '🎓',
      'electricity': '⚡',
      'grievances': '📢'
    };
    return icons[serviceType] || '📝';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'open': 'destructive',
      'in_progress': 'default',
      'resolved': 'default',
      'closed': 'secondary'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'secondary',
      'medium': 'default',
      'high': 'destructive',
      'urgent': 'destructive'
    };
    return colors[priority as keyof typeof colors] || 'default';
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
          <div className="text-center">Loading your feedbacks...</div>
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
                    {feedback.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={getStatusColor(feedback.status)}>
                      {feedback.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge variant={getPriorityColor(feedback.priority)}>
                      {feedback.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-700">{feedback.description}</p>
                  
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
                    <div className="text-sm text-gray-500">
                      {feedback.district} • {feedback.mandal} • {feedback.village}
                    </div>
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
