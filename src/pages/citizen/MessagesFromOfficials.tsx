
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CitizenNavigation from '@/components/CitizenNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  title: string;
  content: string;
  created_at: string;
  district: string;
  mandal: string;
  village: string;
  target_roles: string[];
  sender_id: string;
}

const MessagesFromOfficials = () => {
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user && user.district && user.mandal && user.village) {
      fetchMessages();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('messages-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
          },
          () => {
            fetchMessages(); // Refetch when new messages are added
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

  const fetchMessages = async () => {
    if (!user || !user.district || !user.mandal || !user.village) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('district', user.district)
        .eq('mandal', user.mandal)
        .eq('village', user.village)
        .contains('target_roles', ['citizen'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      } else {
        setMessages(data || []);
      }
    } catch (error) {
      console.error('Error in fetchMessages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('te-IN', {
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
          <div className="text-center">Loading messages...</div>
        </div>
      </div>
    );
  }

  if (!user || !user.district || !user.mandal || !user.village) {
    return (
      <div className="min-h-screen bg-light-blue-bg">
        <CitizenNavigation />
        <div className="container mx-auto px-4 py-8">
          <Alert className="max-w-2xl mx-auto">
            <AlertDescription>
              Please complete your profile with district, mandal, and village information to view local messages.
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
            Messages from Officials 📨
          </h1>
          <p className="text-sm text-gray-600">
            📍 Showing messages for: {user.district} → {user.mandal} → {user.village}
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className="animate-fade-in hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    <span className="mr-2">📢</span>
                    {message.title}
                  </CardTitle>
                  <Badge variant="default">
                    Official
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-700 leading-relaxed">{message.content}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-500">
                      📍 {message.district} • {message.mandal} • {message.village}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    {formatDate(message.created_at)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {messages.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-4xl mb-4">📨</div>
                <h3 className="text-lg font-semibold mb-2">No local messages</h3>
                <p className="text-gray-600">
                  No official messages for your area yet. Check back later for updates from your local government.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Location: {user.district} → {user.mandal} → {user.village}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesFromOfficials;
