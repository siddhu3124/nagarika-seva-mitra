
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFeedbackSubmission, FeedbackData } from '@/hooks/useFeedbackSubmission';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FeedbackForm: React.FC = () => {
  const { t } = useLanguage();
  const { isSubmitting, submitFeedback, validateFeedback } = useFeedbackSubmission();

  const [formData, setFormData] = useState<Partial<FeedbackData>>({
    service_type: '',
    rating: 0,
    feedback_text: '',
    title: '',
    location: '',
    location_details: '',
    village: '',
    mandal: '',
    district: ''
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const serviceTypes = [
    'Healthcare',
    'Education',
    'Transportation',
    'Water Supply',
    'Electricity',
    'Sanitation',
    'Public Safety',
    'Infrastructure',
    'Government Services',
    'Other'
  ];

  const handleInputChange = (field: keyof FeedbackData, value: string | number) => {
    console.log(`🔄 Form field changed: ${field} =`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleRatingClick = (rating: number) => {
    handleInputChange('rating', rating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 Form submission started with data:', formData);
    setDebugInfo('Starting form submission...');
    
    // Validate form data
    const errors = validateFeedback(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      setDebugInfo(`Validation failed with ${errors.length} errors`);
      return;
    }

    setDebugInfo('Form validated successfully, submitting...');

    // Submit feedback
    const success = await submitFeedback(formData as FeedbackData);
    
    if (success) {
      console.log('✅ Form submission completed successfully');
      setDebugInfo('Feedback submitted successfully!');
      // Reset form on success
      setFormData({
        service_type: '',
        rating: 0,
        feedback_text: '',
        title: '',
        location: '',
        location_details: '',
        village: '',
        mandal: '',
        district: ''
      });
    } else {
      setDebugInfo('Feedback submission failed - check console for details');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-government-blue">
          {t('submit_feedback') || 'Submit Feedback'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Debug Info */}
          {debugInfo && (
            <Alert>
              <AlertDescription>
                <strong>Debug Info:</strong> {debugInfo}
              </AlertDescription>
            </Alert>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <ul className="list-disc list-inside text-red-600 text-sm">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Service Type */}
          <div>
            <Label htmlFor="service_type">
              {t('service_category') || 'Service Category'} *
            </Label>
            <Select 
              value={formData.service_type} 
              onValueChange={(value) => handleInputChange('service_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('select_service') || 'Select a service'} />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">
              {t('feedback_title') || 'Feedback Title'}
            </Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder={t('enter_title') || 'Enter a brief title for your feedback'}
            />
          </div>

          {/* Rating */}
          <div>
            <Label>{t('rating') || 'Rating'} *</Label>
            <div className="flex space-x-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className={`p-1 ${star <= (formData.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Text */}
          <div>
            <Label htmlFor="feedback_text">
              {t('feedback_description') || 'Feedback Description'} *
            </Label>
            <Textarea
              id="feedback_text"
              value={formData.feedback_text || ''}
              onChange={(e) => handleInputChange('feedback_text', e.target.value)}
              placeholder={t('describe_feedback') || 'Please describe your feedback in detail'}
              rows={4}
            />
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">
              {t('location') || 'Location'}
            </Label>
            <Input
              id="location"
              value={formData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder={t('enter_location') || 'Enter location (optional)'}
            />
          </div>

          {/* Location Details */}
          <div>
            <Label htmlFor="location_details">
              {t('location_details') || 'Location Details'}
            </Label>
            <Textarea
              id="location_details"
              value={formData.location_details || ''}
              onChange={(e) => handleInputChange('location_details', e.target.value)}
              placeholder={t('additional_location_info') || 'Additional location information (optional)'}
              rows={2}
            />
          </div>

          {/* Administrative Divisions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="district">
                {t('district') || 'District'}
              </Label>
              <Input
                id="district"
                value={formData.district || ''}
                onChange={(e) => handleInputChange('district', e.target.value)}
                placeholder={t('district') || 'District'}
              />
            </div>
            <div>
              <Label htmlFor="mandal">
                {t('mandal') || 'Mandal'}
              </Label>
              <Input
                id="mandal"
                value={formData.mandal || ''}
                onChange={(e) => handleInputChange('mandal', e.target.value)}
                placeholder={t('mandal') || 'Mandal'}
              />
            </div>
            <div>
              <Label htmlFor="village">
                {t('village') || 'Village'}
              </Label>
              <Input
                id="village"
                value={formData.village || ''}
                onChange={(e) => handleInputChange('village', e.target.value)}
                placeholder={t('village') || 'Village'}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-government-blue hover:bg-government-blue/90"
          >
            {isSubmitting ? (t('submitting') || 'Submitting...') : (t('submit_feedback') || 'Submit Feedback')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
