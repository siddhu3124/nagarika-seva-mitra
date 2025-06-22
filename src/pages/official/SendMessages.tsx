
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
import { useLocationData } from '@/hooks/useLocationData';
import { supabase } from '@/integrations/supabase/client';
import OfficialNavigation from '@/components/OfficialNavigation';

const SendMessages = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { districts, getMandalsByDistrict, getVillagesByMandal, loading: locationLoading } = useLocationData();

  const [message, setMessage] = useState({
    title: '',
    content: '',
    district: '',
    mandal: '',
    village: '',
    urgency: 'medium'
  });
  const [loading, setLoading] = useState(false);

  const availableMandals = message.district ? getMandalsByDistrict(message.district) : [];
  const availableVillages = message.district && message.mandal ? getVillagesByMandal(message.district, message.mandal) : [];

  const handleDistrictChange = (district: string) => {
    setMessage({
      ...message,
      district,
      mandal: '',
      village: ''
    });
  };

  const handleMandalChange = (mandal: string) => {
    setMessage({
      ...message,
      mandal,
      village: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.title || !message.content || !message.district) {
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
        description: "You must be logged in to send messages",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          title: message.title,
          content: message.content,
          urgency: message.urgency,
          target_roles: ['citizen'],
          district: message.district === 'all' ? null : message.district,
          mandal: message.mandal === 'all' || !message.mandal ? null : message.mandal,
          village: message.village === 'all' || !message.village ? null : message.village
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Message sent successfully to citizens!",
      });

      // Reset form
      setMessage({
        title: '',
        content: '',
        district: '',
        mandal: '',
        village: '',
        urgency: 'medium'
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-blue-bg">
      <OfficialNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-government-blue text-center">
              {t('send_message')} 📢
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">{t('message_title')} *</Label>
                <Input
                  id="title"
                  value={message.title}
                  onChange={(e) => setMessage({...message, title: e.target.value})}
                  placeholder={t('enter_message_title_placeholder')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="district">{t('district')} *</Label>
                  <Select value={message.district} onValueChange={handleDistrictChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_district_placeholder')} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto z-50">
                      <SelectItem value="all">All Districts</SelectItem>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mandal">{t('mandal')}</Label>
                  <Select value={message.mandal} onValueChange={handleMandalChange} disabled={!message.district || message.district === 'all'}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_mandal_placeholder')} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto z-50">
                      <SelectItem value="all">All Mandals</SelectItem>
                      {availableMandals.map((mandal) => (
                        <SelectItem key={mandal} value={mandal}>
                          {mandal}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="village">{t('village')}</Label>
                  <Select value={message.village} onValueChange={(value) => setMessage({...message, village: value})} disabled={!message.mandal || message.mandal === 'all'}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_village_placeholder')} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto z-50">
                      <SelectItem value="all">All Villages</SelectItem>
                      {availableVillages.map((village) => (
                        <SelectItem key={village} value={village}>
                          {village}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="urgency">{t('urgency')}</Label>
                <Select value={message.urgency} onValueChange={(value) => setMessage({...message, urgency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="content">{t('message_content')} *</Label>
                <Textarea
                  id="content"
                  value={message.content}
                  onChange={(e) => setMessage({...message, content: e.target.value})}
                  placeholder={t('enter_message_content_placeholder')}
                  rows={6}
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading || locationLoading}
                className="w-full bg-government-blue hover:bg-government-blue/90"
              >
                {loading ? t('loading') : `${t('send_message')} 📤`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SendMessages;
