
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CitizenNavigation from '@/components/CitizenNavigation';

const NearbyFeedback = () => {
  // Mock data for nearby feedbacks
  const nearbyFeedbacks = [
    {
      id: 1,
      service_type: 'roads',
      feedback_text: 'మెయిన్ రోడ్‌లో ట్రాఫిక్ లైట్లు పనిచేయట్లేదు.',
      rating: 2,
      status: 'Open',
      created_at: '2024-01-16',
      village: 'గ్రామం 1',
      author: 'రాము'
    },
    {
      id: 2,
      service_type: 'water',
      feedback_text: 'పబ్లిక్ ట్యాప్‌లో నీరు రావట్లేదు.',
      rating: 1,
      status: 'Open',
      created_at: '2024-01-15',
      village: 'గ్రామం 2',
      author: 'లక్ష్మి'
    },
    {
      id: 3,
      service_type: 'phc',
      feedback_text: 'ఆరోగ్య కేంద్రంలో మందులు లేవు.',
      rating: 2,
      status: 'Resolved',
      created_at: '2024-01-14',
      village: 'గ్రామం 1',
      author: 'శ్రీనివాస్'
    },
    {
      id: 4,
      service_type: 'electricity',
      feedback_text: 'రోజూ 4 గంటలు కరెంటు లేకపోవడం.',
      rating: 2,
      status: 'Open',
      created_at: '2024-01-13',
      village: 'గ్రామం 3',
      author: 'రాధిక'
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
          Nearby Feedback 🗺️
        </h1>
        
        <div className="max-w-4xl mx-auto space-y-4">
          {nearbyFeedbacks.map((feedback) => (
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
                      📍 {feedback.village}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">By: {feedback.author}</span>
                    <span className="text-gray-400">
                      {new Date(feedback.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NearbyFeedback;
