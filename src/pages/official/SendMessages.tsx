
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
import OfficialNavigation from '@/components/OfficialNavigation';

const SendMessages = () => {
  const { user } = useAuth();
  const { t, getOptions } = useLanguage();
  const { toast } = useToast();

  const [message, setMessage] = useState({
    title: '',
    message: '',
    district: '',
    mandal: '',
    village: '',
    urgency: '',
    image: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.title || !message.message || !message.district || !message.urgency) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Mock message sending - in real app, this would save to Supabase
    const messageData = {
      ...message,
      created_by: user?.id,
      created_at: new Date().toISOString()
    };

    console.log('Sending message:', messageData);

    toast({
      title: "Success",
      description: "Message sent successfully to citizens!",
    });

    // Reset form
    setMessage({
      title: '',
      message: '',
      district: '',
      mandal: '',
      village: '',
      urgency: '',
      image: null
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMessage({...message, image: file});
    }
  };

  return (
    <div className="min-h-screen bg-light-blue-bg">
      <OfficialNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-government-blue text-center">
              Send Message to Citizens 📢
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Message Title *</Label>
                <Input
                  id="title"
                  value={message.title}
                  onChange={(e) => setMessage({...message, title: e.target.value})}
                  placeholder={t('message_title_placeholder')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="district">{t('district')} *</Label>
                  <Select onValueChange={(value) => setMessage({...message, district: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_district_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      {getOptions('districts').map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mandal">{t('mandal')}</Label>
                  <Select onValueChange={(value) => setMessage({...message, mandal: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_mandal_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Mandals</SelectItem>
                      {getOptions('mandals').map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="village">{t('village')}</Label>
                  <Select onValueChange={(value) => setMessage({...message, village: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_village_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Villages</SelectItem>
                      {getOptions('villages').map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="urgency">Urgency Level *</Label>
                <Select onValueChange={(value) => setMessage({...message, urgency: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency level" />
                  </SelectTrigger>
                  <SelectContent>
                    {getOptions('urgency').map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message-text">Message Content *</Label>
                <Textarea
                  id="message-text"
                  value={message.message}
                  onChange={(e) => setMessage({...message, message: e.target.value})}
                  placeholder={t('message_body_placeholder')}
                  rows={5}
                />
              </div>

              <div>
                <Label htmlFor="image">Attach Image (Optional)</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
                {message.image && (
                  <p className="text-sm text-green-600 mt-2">
                    Image selected: {message.image.name}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-government-blue hover:bg-government-blue/90"
              >
                Send Message 📤
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SendMessages;
