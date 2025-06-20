
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CitizenNavigation from '@/components/CitizenNavigation';

const MyFeedbacks = () => {
  // Mock data - in real app, this would come from Supabase
  const feedbacks = [
    {
      id: 1,
      service_type: 'roads',
      feedback_text: 'రోడ్‌లో పెద్ద గుంతలు ఉన్నాయి. దయచేసి మరమ్మత్తు చేయండి.',
      rating: 2,
      status: 'Open',
      created_at: '2024-01-15',
      district: 'హైదరాబాద్',
      mandal: 'కుకట్‌పల్లి'
    },
    {
      id: 2,
      service_type: 'water',
      feedback_text: 'నీటి సరఫరా సరిగా లేదు. రోజు 2 గంటలు మాత్రమే వస్తున్నది.',
      rating: 3,
      status: 'Resolved',
      created_at: '2024-01-10',
      district: 'హైదరాబాద్',
      mandal: 'కుకట్‌పల్లి'
    }
  ];

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
    return status === 'Open' ? 'destructive' : 'default';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-light-blue-bg">
      <CitizenNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-government-blue mb-6 text-center">
          My Feedbacks 📋
        </h1>
        
        <div className="max-w-4xl mx-auto space-y-4">
          {feedbacks.map((feedback) => (
            <Card key={feedback.id} className="animate-fade-in">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    <span className="mr-2 text-2xl">{getServiceIcon(feedback.service_type)}</span>
                    {feedback.service_type.charAt(0).toUpperCase() + feedback.service_type.slice(1)}
                  </CardTitle>
                  <Badge variant={getStatusColor(feedback.status)}>
                    {feedback.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-700">{feedback.feedback_text}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Rating:</span>
                      <div className="flex">{renderStars(feedback.rating)}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {feedback.district} • {feedback.mandal}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    Submitted on: {new Date(feedback.created_at).toLocaleDateString()}
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
