
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
import { supabase } from '@/integrations/supabase/client';
import OfficialNavigation from '@/components/OfficialNavigation';

const SendMessages = () => {
  const { user } = useAuth();
  const { t, getOptions } = useLanguage();
  const { toast } = useToast();

  const [message, setMessage] = useState({
    title: '',
    content: '',
    district: '',
    mandal: '',
    village: ''
  });
  const [loading, setLoading] = useState(false);

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
          target_roles: ['citizen'],
          district: message.district === 'all' ? null : message.district,
          mandal: message.mandal === 'all' ? null : message.mandal,
          village: message.village === 'all' ? null : message.village
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
        village: ''
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
                  placeholder="Enter message title"
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
                <Label htmlFor="content">Message Content *</Label>
                <Textarea
                  id="content"
                  value={message.content}
                  onChange={(e) => setMessage({...message, content: e.target.value})}
                  placeholder="Enter your message content here..."
                  rows={6}
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-government-blue hover:bg-government-blue/90"
              >
                {loading ? 'Sending...' : 'Send Message 📤'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SendMessages;
