
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFeedbackSubmission, FeedbackData } from '@/hooks/useFeedbackSubmission';
import ValidationErrors from '@/components/feedback/ValidationErrors';
import DebugInfo from '@/components/feedback/DebugInfo';
import RatingInput from '@/components/feedback/RatingInput';
import ServiceTypeSelector from '@/components/feedback/ServiceTypeSelector';
import AdministrativeDivisions from '@/components/feedback/AdministrativeDivisions';

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

  const validateForm = (data: Partial<FeedbackData>): string[] => {
    const errors: string[] = [];
    
    // Call the existing validation function
    const baseErrors = validateFeedback(data);
    errors.push(...baseErrors);
    
    // Add location validation
    if (!data.district?.trim()) {
      errors.push('District is required');
    }
    
    if (!data.mandal?.trim()) {
      errors.push('Mandal is required');
    }
    
    if (!data.village?.trim()) {
      errors.push('Village is required');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 Form submission started with data:', formData);
    setDebugInfo('Starting form submission...');
    
    // Validate form data (including location)
    const errors = validateForm(formData);
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <DebugInfo debugInfo={debugInfo} />
          <ValidationErrors errors={validationErrors} />

          <ServiceTypeSelector
            value={formData.service_type || ''}
            onChange={(value) => handleInputChange('service_type', value)}
          />

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

          <RatingInput
            rating={formData.rating || 0}
            onRatingChange={(rating) => handleInputChange('rating', rating)}
          />

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

          {/* Administrative Divisions - Now Required */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Location Information *
            </Label>
            <AdministrativeDivisions
              district={formData.district || ''}
              mandal={formData.mandal || ''}
              village={formData.village || ''}
              onDistrictChange={(value) => handleInputChange('district', value)}
              onMandalChange={(value) => handleInputChange('mandal', value)}
              onVillageChange={(value) => handleInputChange('village', value)}
            />
          </div>

          {/* Location Details */}
          <div>
            <Label htmlFor="location_details">
              {t('location_details') || 'Specific Location Details'}
            </Label>
            <Textarea
              id="location_details"
              value={formData.location_details || ''}
              onChange={(e) => handleInputChange('location_details', e.target.value)}
              placeholder={t('additional_location_info') || 'Additional location information (e.g., near school, bus stop, etc.)'}
              rows={2}
            />
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
