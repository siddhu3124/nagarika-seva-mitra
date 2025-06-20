
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CitizenNavigation from '@/components/CitizenNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

interface Message {
  id: string;
  title: string;
  message: string;
  urgency: 'High' | 'Medium' | 'Low';
  created_at: string;
  created_by: string;
  district: string;
  mandal: string;
  village: string;
  target_roles: string[];
  attachment_url?: string;
  read_by?: string[];
}

const MessagesFromOfficials = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data that simulates filtered messages based on user location
  const mockMessages: Message[] = [
    {
      id: '1',
      title: 'రోడ్ మరమ్మత్తు పనులు',
      message: 'కుకట్‌పల్లి మండలంలో రోడ్ మరమ్మత్తు పనులు వచ్చే వారం ప్రారంభమవుతాయి. అసౌకర్యానికి క్షమాపణలు.',
      urgency: 'Medium',
      created_at: '2024-01-16T10:00:00Z',
      created_by: 'రోడ్స్ & బిల్డింగ్స్ విభాగం',
      district: 'హైదరాబాద్',
      mandal: 'కుకట్‌పల్లి',
      village: 'గ్రామం 1',
      target_roles: ['citizen']
    },
    {
      id: '2',
      title: 'నీటి సరఫరా మెరుగుదల',
      message: 'నీటి సరఫరా సమస్యలను పరిష్కరించడానికి కొత్త పంపింగ్ స్టేషన్ స్థాపించబడింది. రేపు నుండి సరిగ్గా నీరు వస్తుంది.',
      urgency: 'High',
      created_at: '2024-01-15T14:30:00Z',
      created_by: 'వాటర్ సప్లై విభాగం',
      district: 'హైదరాబాద్',
      mandal: 'కుకట్‌పల్లి',
      village: 'గ్రామం 1',
      target_roles: ['citizen']
    },
    {
      id: '3',
      title: 'ఆరోగ్య శిబిరం',
      message: 'ఈ శుక్రవారం ప్రాథమిక ఆరోగ్య కేంద్రంలో ఉచిత వైద్య శిబిరం నిర్వహించబడుతుంది. అందరూ వచ్చి లాభం పొందండి.',
      urgency: 'Low',
      created_at: '2024-01-14T09:15:00Z',
      created_by: 'ఆరోగ్య విభాగం',
      district: 'హైదరాబాద్',
      mandal: 'కుకట్‌పల్లి',
      village: 'గ్రామం 1',
      target_roles: ['citizen']
    },
    {
      id: '4',
      title: 'Different Village Message',
      message: 'This message is for a different village and should not appear.',
      urgency: 'Medium',
      created_at: '2024-01-13T11:00:00Z',
      created_by: 'Test Department',
      district: 'హైదరాబాద్',
      mandal: 'కుకట్‌పల్లి',
      village: 'గ్రామం 2',
      target_roles: ['citizen']
    }
  ];

  useEffect(() => {
    const fetchMessages = () => {
      if (!user || !user.district || !user.mandal || !user.village) {
        setMessages([]);
        setLoading(false);
        return;
      }

      // Filter messages based on user's location
      const filteredMessages = mockMessages.filter(message => 
        message.district === user.district &&
        message.mandal === user.mandal &&
        message.village === user.village &&
        message.target_roles.includes('citizen')
      );

      // Sort by creation date (newest first)
      filteredMessages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setMessages(filteredMessages);
      setLoading(false);
    };

    fetchMessages();

    // Simulate real-time updates - in real app, this would be a websocket or polling
    const interval = setInterval(() => {
      fetchMessages();
    }, 30000); // Check for new messages every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'default';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'High': return '🚨';
      case 'Medium': return '⚠️';
      case 'Low': return 'ℹ️';
      default: return '📢';
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

  if (loading) {
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
                    <span className="mr-2">{getUrgencyIcon(message.urgency)}</span>
                    {message.title}
                  </CardTitle>
                  <Badge variant={getUrgencyColor(message.urgency)}>
                    {message.urgency}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-700 leading-relaxed">{message.message}</p>
                  
                  {message.attachment_url && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <a 
                        href={message.attachment_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-government-blue hover:underline flex items-center"
                      >
                        📎 View Attachment
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-government-blue font-medium">
                        {message.created_by}
                      </span>
                    </div>
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
