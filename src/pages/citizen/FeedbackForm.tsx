
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
    description: '',
    rating: '',
    location_details: ''
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.service_type || !feedback.title || !feedback.description || !feedback.rating) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit feedback",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Insert feedback into database
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedbacks')
        .insert({
          citizen_id: user.id,
          service_type: feedback.service_type,
          title: feedback.title,
          description: feedback.description,
          rating: parseInt(feedback.rating),
          location_details: feedback.location_details,
          district: user.district,
          mandal: user.mandal,
          village: user.village
        })
        .select()
        .single();

      if (feedbackError) {
        throw feedbackError;
      }

      // Upload attachments if any
      if (attachments.length > 0) {
        for (const file of attachments) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${feedbackData.id}/${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('feedback-attachments')
            .upload(fileName, file);

          if (uploadError) {
            console.error('Error uploading file:', uploadError);
          } else {
            // Save file metadata
            await supabase
              .from('file_uploads')
              .insert({
                user_id: user.id,
                feedback_id: feedbackData.id,
                file_name: file.name,
                file_size: file.size,
                file_type: file.type,
                storage_path: fileName
              });
          }
        }
      }

      toast({
        title: "Success",
        description: "Feedback submitted successfully! Thank you for your input.",
      });

      // Reset form
      setFeedback({
        service_type: '',
        title: '',
        description: '',
        rating: '',
        location_details: ''
      });
      setAttachments([]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
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
                <Label htmlFor="location">Specific Location Details (Optional)</Label>
                <Input
                  id="location"
                  value={feedback.location_details}
                  onChange={(e) => setFeedback({...feedback, location_details: e.target.value})}
                  placeholder="Street address, landmark, etc."
                />
              </div>

              <div>
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  value={feedback.description}
                  onChange={(e) => setFeedback({...feedback, description: e.target.value})}
                  placeholder={t('feedback_placeholder')}
                  rows={5}
                />
              </div>

              <div>
                <Label htmlFor="attachments">Attach Photos/Documents (Optional)</Label>
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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
