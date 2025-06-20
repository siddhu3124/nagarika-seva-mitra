
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import CitizenNavigation from '@/components/CitizenNavigation';

const ThankYouPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-light-blue-bg">
      <CitizenNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-center animate-fade-in">
          <CardHeader>
            <div className="text-6xl mb-4">✅</div>
            <CardTitle className="text-government-blue">
              ధన్యవాదాలు!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              మీ ఫీడ్‌బ్యాక్ విజయవంతంగా సమర్పించబడింది. 
              మా అధికారులు త్వరలో మీ సమస్యను పరిశీలిస్తారు.
            </p>
            <p className="text-sm text-government-blue">
              Your feedback has been submitted successfully.
              Our officials will review your issue soon.
            </p>
            
            <div className="space-y-2 pt-4">
              <Button 
                onClick={() => navigate('/citizen/my-feedbacks')}
                className="w-full bg-government-blue hover:bg-government-blue/90"
              >
                View My Feedbacks 📋
              </Button>
              <Button 
                onClick={() => navigate('/citizen/feedback')}
                variant="outline"
                className="w-full"
              >
                Submit Another Feedback 📝
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThankYouPage;
