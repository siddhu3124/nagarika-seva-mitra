
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CitizenNavigation from '@/components/CitizenNavigation';

const MessagesFromOfficials = () => {
  // Mock data for official messages
  const messages = [
    {
      id: 1,
      title: 'రోడ్ మరమ్మత్తు పనులు',
      message: 'కుకట్‌పల్లి మండలంలో రోడ్ మరమ్మత్తు పనులు వచ్చే వారం ప్రారంభమవుతాయి. అసౌకర్యానికి క్షమాపణలు.',
      urgency: 'Medium',
      created_at: '2024-01-16',
      created_by: 'రోడ్స్ & బిల్డింగ్స్ విభాగం',
      district: 'హైదరాబాద్',
      mandal: 'కుకట్‌పల్లి'
    },
    {
      id: 2,
      title: 'నీటి సరఫరా మెరుగుదల',
      message: 'నీటి సరఫరా సమస్యలను పరిష్కరించడానికి కొత్త పంపింగ్ స్టేషన్ స్థాపించబడింది. రేపు నుండి సరిగ్గా నీరు వస్తుంది.',
      urgency: 'High',
      created_at: '2024-01-15',
      created_by: 'వాటర్ సప్లై విభాగం',
      district: 'హైదరాబాద్',
      mandal: 'కుకట్‌పల్లి'
    },
    {
      id: 3,
      title: 'ఆరోగ్య శిబిరం',
      message: 'ఈ శుక్రవారం ప్రాథమిక ఆరోగ్య కేంద్రంలో ఉచిత వైద్య శిబిరం నిర్వహించబడుతుంది. అందరూ వచ్చి లాభం పొందండి.',
      urgency: 'Low',
      created_at: '2024-01-14',
      created_by: 'ఆరోగ్య విభాగం',
      district: 'హైదరాబాద్',
      mandal: 'కుకట్‌పల్లి'
    }
  ];

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

  return (
    <div className="min-h-screen bg-light-blue-bg">
      <CitizenNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-government-blue mb-6 text-center">
          Messages from Officials 📨
        </h1>
        
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className="animate-fade-in">
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
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-government-blue font-medium">
                        {message.created_by}
                      </span>
                    </div>
                    <div className="text-gray-500">
                      📍 {message.district} • {message.mandal}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    {new Date(message.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {messages.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-4xl mb-4">📨</div>
                <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                <p className="text-gray-600">You'll see official updates and announcements here.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesFromOfficials;
