
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
import { supabase } from '@/integrations/supabase/client';
import CitizenNavigation from '@/components/CitizenNavigation';

const FeedbackForm = () => {
  const { user } = useAuth();
  const { t, getOptions } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState({
    service_type: '',
    title: '',
    feedback_text: '',
    rating: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.service_type || !feedback.title || !feedback.feedback_text || !feedback.rating) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare the data for citizen_feedback table
      const feedbackData = {
        service_type: feedback.service_type,
        title: feedback.title,
        feedback_text: feedback.feedback_text,
        rating: parseInt(feedback.rating),
        location: feedback.location || null,
        district: user?.district || null,
        mandal: user?.mandal || null,
        village: user?.village || null,
        user_id: user?.id || null // Allow anonymous submissions
      };

      console.log('Submitting feedback data:', feedbackData);

      // Insert feedback into citizen_feedback table
      const { error } = await supabase
        .from('citizen_feedback')
        .insert(feedbackData);

      if (error) {
        console.error('Error submitting feedback:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Feedback submitted successfully! Thank you for your input.",
      });

      // Reset form
      setFeedback({
        service_type: '',
        title: '',
        feedback_text: '',
        rating: '',
        location: ''
      });

      navigate('/thank-you');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
                <Label htmlFor="title">Feedback Title *</Label>
                <Input
                  id="title"
                  value={feedback.title}
                  onChange={(e) => setFeedback({...feedback, title: e.target.value})}
                  placeholder="Brief description of the issue"
                />
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
                <Label htmlFor="location">Location Details (Optional)</Label>
                <Input
                  id="location"
                  value={feedback.location}
                  onChange={(e) => setFeedback({...feedback, location: e.target.value})}
                  placeholder="Street address, landmark, etc."
                />
              </div>

              <div>
                <Label htmlFor="feedback_text">Detailed Description *</Label>
                <Textarea
                  id="feedback_text"
                  value={feedback.feedback_text}
                  onChange={(e) => setFeedback({...feedback, feedback_text: e.target.value})}
                  placeholder={t('feedback_placeholder')}
                  rows={5}
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-government-blue hover:bg-government-blue/90"
              >
                {loading ? 'Submitting...' : t('submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackForm;
