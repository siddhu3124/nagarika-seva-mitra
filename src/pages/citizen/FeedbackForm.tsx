
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import CitizenNavigation from '@/components/CitizenNavigation';

const FeedbackForm = () => {
  const { user } = useAuth();
  const { t, getOptions } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState({
    service_type: '',
    rating: '',
    feedback_text: '',
    location_details: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.service_type || !feedback.rating || !feedback.feedback_text) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Mock submission - in real app, this would submit to Supabase
    const feedbackData = {
      ...feedback,
      citizen_id: user?.id,
      district: user?.district,
      mandal: user?.mandal,
      village: user?.village,
      created_at: new Date().toISOString(),
      status: 'open'
    };

    console.log('Submitting feedback:', feedbackData);

    toast({
      title: "Success",
      description: "Feedback submitted successfully! Thank you for your input.",
    });

    // Reset form
    setFeedback({
      service_type: '',
      rating: '',
      feedback_text: '',
      location_details: ''
    });

    // Navigate to thank you page
    navigate('/thank-you');
  };

  const ratingOptions = [
    { value: '1', label: '1 - Very Poor' },
    { value: '2', label: '2 - Poor' },
    { value: '3', label: '3 - Average' },
    { value: '4', label: '4 - Good' },
    { value: '5', label: '5 - Excellent' }
  ];

  return (
    <div className="min-h-screen bg-light-blue-bg">
      <CitizenNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-government-blue text-center">
              {t('feedback_form')} 📝
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="service-type">{t('service_type')} *</Label>
                <Select onValueChange={(value) => setFeedback({...feedback, service_type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_service_placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {getOptions('services').map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="rating">{t('rating')} *</Label>
                <Select onValueChange={(value) => setFeedback({...feedback, rating: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating (1-5)" />
                  </SelectTrigger>
                  <SelectContent>
                    {ratingOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">{t('locality')} (Optional)</Label>
                <Input
                  id="location"
                  value={feedback.location_details}
                  onChange={(e) => setFeedback({...feedback, location_details: e.target.value})}
                  placeholder={t('enter_locality_placeholder')}
                />
              </div>

              <div>
                <Label htmlFor="feedback-text">{t('feedback_text')} *</Label>
                <Textarea
                  id="feedback-text"
                  value={feedback.feedback_text}
                  onChange={(e) => setFeedback({...feedback, feedback_text: e.target.value})}
                  placeholder={t('feedback_placeholder')}
                  rows={5}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-government-blue hover:bg-government-blue/90"
              >
                {t('submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackForm;
