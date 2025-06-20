
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
  citizen: {
    name: string;
  };
}

const NearbyFeedback = () => {
  const { user, loading: authLoading } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user && user.district && user.mandal) {
      fetchNearbyFeedbacks();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('nearby-feedbacks')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'feedbacks'
          },
          () => {
            fetchNearbyFeedbacks(); // Refetch when new feedbacks are added
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

  const fetchNearbyFeedbacks = async () => {
    if (!user || !user.district || !user.mandal) {
      setFeedbacks([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select(`
          *,
          citizen:users!feedbacks_citizen_id_fkey(name)
        `)
        .eq('district', user.district)
        .eq('mandal', user.mandal)
        .neq('citizen_id', user.id) // Exclude user's own feedbacks
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching nearby feedbacks:', error);
        setFeedbacks([]);
      } else {
        setFeedbacks(data || []);
      }
    } catch (error) {
      console.error('Error in fetchNearbyFeedbacks:', error);
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
      month: 'short',
      day: 'numeric'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-light-blue-bg">
        <CitizenNavigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading nearby feedbacks...</div>
        </div>
      </div>
    );
  }

  if (!user || !user.district || !user.mandal) {
    return (
      <div className="min-h-screen bg-light-blue-bg">
        <CitizenNavigation />
        <div className="container mx-auto px-4 py-8">
          <Alert className="max-w-2xl mx-auto">
            <AlertDescription>
              Please complete your profile with district and mandal information to view nearby feedback.
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
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-government-blue mb-2">
            Nearby Feedback 🗺️
          </h1>
          <p className="text-sm text-gray-600">
            📍 Showing feedback from: {user.district} → {user.mandal}
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-4">
          {feedbacks.map((feedback) => (
            <Card key={feedback.id} className="animate-fade-in hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    <span className="mr-2 text-2xl">{getServiceIcon(feedback.service_type)}</span>
                    {feedback.title}
                  </CardTitle>
                  <Badge variant={getStatusColor(feedback.status)}>
                    {feedback.status.replace('_', ' ').toUpperCase()}
                  </Badge>
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
                      📍 {feedback.village || 'Same area'}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      By: {feedback.citizen?.name || 'Anonymous'} • {feedback.service_type}
                    </span>
                    <span className="text-gray-400">
                      {formatDate(feedback.created_at)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {feedbacks.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="text-lg font-semibold mb-2">No nearby feedback</h3>
                <p className="text-gray-600">
                  No feedback from your area yet. Be the first to share feedback about local services!
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Area: {user.district} → {user.mandal}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbyFeedback;
