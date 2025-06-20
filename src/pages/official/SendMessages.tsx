
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import OfficialNavigation from '@/components/OfficialNavigation';
import { useState } from 'react';

const SendMessages = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [messageForm, setMessageForm] = useState({
    title: '',
    message: '',
    district: '',
    mandal: '',
    village: '',
    urgency: 'Medium',
    image: null as File | null
  });

  const handleSubmit = async () => {
    if (!messageForm.title || !messageForm.message || !messageForm.district) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Mock API call to save message
    const messageData = {
      ...messageForm,
      created_by: user?.id,
      created_at: new Date().toISOString()
    };

    console.log('Sending message:', messageData);

    toast({
      title: "Success",
      description: "Message sent successfully to citizens!",
    });

    // Reset form
    setMessageForm({
      title: '',
      message: '',
      district: '',
      mandal: '',
      village: '',
      urgency: 'Medium',
      image: null
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMessageForm({...messageForm, image: file});
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-light-blue-bg">
      <OfficialNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-government-blue mb-8 text-center">
          Send Messages to Citizens 📢
        </h1>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-government-blue">
              Compose New Message
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title">Message Title *</Label>
              <Input
                id="title"
                value={messageForm.title}
                onChange={(e) => setMessageForm({...messageForm, title: e.target.value})}
                placeholder={t('message_title_placeholder')}
              />
            </div>

            <div>
              <Label htmlFor="message">Message Body *</Label>
              <Textarea
                id="message"
                value={messageForm.message}
                onChange={(e) => setMessageForm({...messageForm, message: e.target.value})}
                placeholder={t('message_body_placeholder')}
                rows={6}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="district">District *</Label>
                <Select onValueChange={(value) => setMessageForm({...messageForm, district: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_district_placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hyderabad">హైదరాబాద్</SelectItem>
                    <SelectItem value="warangal">వరంగల్</SelectItem>
                    <SelectItem value="nizamabad">నిజామాబాద్</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="mandal">Mandal</Label>
                <Select onValueChange={(value) => setMessageForm({...messageForm, mandal: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_mandal_placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="secunderabad">సికింద్రాబాద్</SelectItem>
                    <SelectItem value="kukatpally">కుకట్‌పల్లి</SelectItem>
                    <SelectItem value="lbnagar">LB నగర్</SelectItem>
                    <SelectItem value="all">All Mandals</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="village">Village</Label>
                <Select onValueChange={(value) => setMessageForm({...messageForm, village: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_village_placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="village1">గ్రామం 1</SelectItem>
                    <SelectItem value="village2">గ్రామం 2</SelectItem>
                    <SelectItem value="village3">గ్రామం 3</SelectItem>
                    <SelectItem value="all">All Villages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select value={messageForm.urgency} onValueChange={(value) => setMessageForm({...messageForm, urgency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">🟢 Low</SelectItem>
                  <SelectItem value="Medium">🟡 Medium</SelectItem>
                  <SelectItem value="High">🔴 High</SelectItem>
                </SelectContent>
              </Select>
              <div className={`mt-2 p-2 rounded-md text-sm ${getUrgencyColor(messageForm.urgency)}`}>
                Current urgency: {messageForm.urgency}
              </div>
            </div>

            <div>
              <Label htmlFor="image">Attach Image (Optional)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1"
              />
              {messageForm.image && (
                <p className="text-sm text-green-600 mt-1">
                  Image attached: {messageForm.image.name}
                </p>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-government-blue mb-2">Preview</h3>
              <div className="space-y-2">
                <h4 className="font-medium">{messageForm.title || 'Message Title'}</h4>
                <p className="text-gray-700 text-sm">
                  {messageForm.message || 'Message body will appear here...'}
                </p>
                <div className="text-xs text-gray-500">
                  Target: {messageForm.district ? `${messageForm.district}` : 'No location selected'}
                  {messageForm.mandal && ` → ${messageForm.mandal}`}
                  {messageForm.village && ` → ${messageForm.village}`}
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full bg-government-blue hover:bg-government-blue/90 text-lg py-6"
            >
              Send Message to Citizens 📤
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SendMessages;
