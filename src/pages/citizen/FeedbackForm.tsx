
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import CitizenNavigation from '@/components/CitizenNavigation';

const FeedbackForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    district: user?.district || '',
    mandal: user?.mandal || '',
    village: user?.village || '',
    service_type: '',
    rating: '',
    feedback_text: '',
    photo: null as File | null
  });

  const [rating, setRating] = useState(0);

  const serviceTypes = [
    { value: 'ration', label: 'రేషన్ కార్డ్', icon: '🍚' },
    { value: 'roads', label: 'రోడ్లు', icon: '🛣️' },
    { value: 'water', label: 'నీటి సరఫరా', icon: '💧' },
    { value: 'phc', label: 'ఆరోగ్య కేంద్రం', icon: '🏥' },
    { value: 'education', label: 'విద్య', icon: '🎓' },
    { value: 'electricity', label: 'విద్యుత్', icon: '⚡' },
    { value: 'grievances', label: 'ఫిర్యాదులు', icon: '📢' }
  ];

  const handleSubmit = async () => {
    if (!formData.service_type || !formData.feedback_text || rating === 0) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Mock API call to save feedback
    const feedbackData = {
      ...formData,
      rating,
      user_id: user?.id,
      created_at: new Date().toISOString(),
      status: 'Open'
    };

    console.log('Submitting feedback:', feedbackData);

    toast({
      title: "Success",
      description: "Feedback submitted successfully!",
    });

    navigate('/thank-you');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({...formData, photo: file});
    }
  };

  const StarRating = ({ rating, setRating }: { rating: number; setRating: (rating: number) => void }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
          >
            ⭐
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-light-blue-bg">
      <CitizenNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto animate-fade-in">
          <CardHeader>
            <CardTitle className="text-government-blue text-center">
              {t('feedback_form')} 📝
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="district">{t('district')} *</Label>
                <Select value={formData.district} onValueChange={(value) => setFormData({...formData, district: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your District" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hyderabad">హైదరాబాద్</SelectItem>
                    <SelectItem value="warangal">వరంగల్</SelectItem>
                    <SelectItem value="nizamabad">నిజామాబాద్</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="mandal">{t('mandal')} *</Label>
                <Select value={formData.mandal} onValueChange={(value) => setFormData({...formData, mandal: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="మండలం ఎంచుకోండి" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="secunderabad">సికింద్రాబాద్</SelectItem>
                    <SelectItem value="kukatpally">కుకట్‌పల్లి</SelectItem>
                    <SelectItem value="lbnagar">LB నగర్</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="village">{t('village')} *</Label>
                <Select value={formData.village} onValueChange={(value) => setFormData({...formData, village: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="గ్రామం ఎంచుకోండి" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="village1">గ్రామం 1</SelectItem>
                    <SelectItem value="village2">గ్రామం 2</SelectItem>
                    <SelectItem value="village3">గ్రామం 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="service">{t('service_type')} *</Label>
              <Select onValueChange={(value) => setFormData({...formData, service_type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="సేవా రకం ఎంచుకోండి" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      <span className="flex items-center">
                        <span className="mr-2">{service.icon}</span>
                        {service.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t('rating')} * (మీ సంతృప్తి స్థాయి)</Label>
              <div className="mt-2">
                <StarRating rating={rating} setRating={setRating} />
                <p className="text-sm text-gray-600 mt-1">
                  {rating === 1 && "చాలా అసంతృప్తి"}
                  {rating === 2 && "అసంతృప్తి"}
                  {rating === 3 && "సాధారణం"}
                  {rating === 4 && "సంతృప్తి"}
                  {rating === 5 && "చాలా సంతృప్తి"}
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="feedback">{t('feedback_text')} *</Label>
              <Textarea
                id="feedback"
                value={formData.feedback_text}
                onChange={(e) => setFormData({...formData, feedback_text: e.target.value})}
                placeholder="మీ అభిప్రాయం వివరంగా రాయండి..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="photo">Photo Upload (optional)</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="mt-1"
              />
              {formData.photo && (
                <p className="text-sm text-green-600 mt-1">
                  File selected: {formData.photo.name}
                </p>
              )}
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full bg-government-blue hover:bg-government-blue/90 text-lg py-6"
            >
              {t('submit')} ✉️
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackForm;
