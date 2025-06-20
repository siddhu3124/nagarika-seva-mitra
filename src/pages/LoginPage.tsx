import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { usePhoneAuth } from '@/hooks/usePhoneAuth';
import { supabase } from '@/integrations/supabase/client';
import LanguageToggle from '@/components/LanguageToggle';
import OTPInput from '@/components/OTPInput';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();
  const { t, getOptions } = useLanguage();
  const { toast } = useToast();
  const { loading: phoneLoading, otpSent, phoneNumber, sendOTP, verifyOTP, resetOTP } = usePhoneAuth();

  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState('');

  // Citizen form state
  const [citizenForm, setCitizenForm] = useState({
    name: '',
    age: '',
    gender: '',
    locality: '',
    district: '',
    mandal: '',
    village: ''
  });

  // Official form state
  const [officialForm, setOfficialForm] = useState({
    name: '',
    department: '',
    employee_id: ''
  });

  const [userType, setUserType] = useState<'citizen' | 'official'>('citizen');

  const handleSendOTP = async () => {
    if (!currentPhoneNumber || currentPhoneNumber.length < 10) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }

    const formattedPhone = currentPhoneNumber.startsWith('+91') 
      ? currentPhoneNumber 
      : `+91${currentPhoneNumber}`;

    const success = await sendOTP(formattedPhone);
    if (success) {
      setStep('otp');
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    const success = await verifyOTP(otp);
    if (success) {
      setStep('profile');
    }
    return success;
  };

  const handleResendOTP = () => {
    resetOTP();
    setStep('phone');
  };

  const validateOfficialCredentials = async (employeeId: string, name: string) => {
    const { data, error } = await supabase
      .from('officials')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('name', name)
      .single();

    if (error || !data) {
      return null;
    }
    return data;
  };

  const handleCompleteProfile = async () => {
    if (userType === 'citizen') {
      if (!citizenForm.name || !citizenForm.age) {
        toast({
          title: "Error",
          description: "Please fill all required fields",
          variant: "destructive"
        });
        return;
      }

      const userData = {
        id: 'citizen_' + Date.now(),
        ...citizenForm,
        age: parseInt(citizenForm.age),
        phone_number: phoneNumber,
        role: 'citizen' as const
      };

      try {
        await login(userData);
        toast({
          title: "Success",
          description: "Profile created successfully",
        });
        navigate('/citizen/feedback');
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create profile",
          variant: "destructive"
        });
      }
    } else {
      if (!officialForm.name || !officialForm.employee_id || !officialForm.department) {
        toast({
          title: "Error",
          description: "Please fill all required fields",
          variant: "destructive"
        });
        return;
      }

      // Validate official credentials
      const officialData = await validateOfficialCredentials(officialForm.employee_id, officialForm.name);
      if (!officialData) {
        toast({
          title: "Error",
          description: "Invalid official credentials. Please contact your administrator.",
          variant: "destructive"
        });
        return;
      }

      const userData = {
        id: 'official_' + Date.now(),
        ...officialForm,
        phone_number: phoneNumber,
        district: officialData.district,
        mandal: officialData.mandal,
        village: officialData.village,
        role: 'official' as const
      };

      try {
        await login(userData);
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        navigate('/official/dashboard');
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to complete login",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-blue-bg to-government-blue flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">నాగరిక మిత్ర</h1>
          <h2 className="text-xl text-white/90">Nagarika Mitra</h2>
          <p className="text-white/80 mt-2">Government Citizen Service Platform</p>
        </div>

        <Card className="glass-effect animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex justify-between items-center">
              <CardTitle className="text-government-blue">
                {step === 'phone' && 'Phone Verification'}
                {step === 'otp' && 'Enter OTP'}
                {step === 'profile' && 'Complete Profile'}
              </CardTitle>
              <LanguageToggle />
            </div>
          </CardHeader>
          <CardContent>
            {step === 'phone' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">{t('phone_number')} *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={currentPhoneNumber}
                    onChange={(e) => setCurrentPhoneNumber(e.target.value)}
                    placeholder="+91 9876543210"
                  />
                </div>
                <Button 
                  onClick={handleSendOTP}
                  disabled={phoneLoading}
                  className="w-full bg-government-blue hover:bg-government-blue/90"
                >
                  {phoneLoading ? 'Sending...' : 'Send OTP'}
                </Button>
              </div>
            )}

            {step === 'otp' && (
              <OTPInput
                onVerify={handleVerifyOTP}
                onResend={handleResendOTP}
                loading={phoneLoading}
                phoneNumber={phoneNumber}
              />
            )}

            {step === 'profile' && (
              <div className="space-y-4">
                <Tabs value={userType} onValueChange={(value) => setUserType(value as 'citizen' | 'official')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="citizen">{t('citizen_login')}</TabsTrigger>
                    <TabsTrigger value="official">{t('official_login')}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="citizen" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="citizen-name">{t('name')} *</Label>
                        <Input
                          id="citizen-name"
                          value={citizenForm.name}
                          onChange={(e) => setCitizenForm({...citizenForm, name: e.target.value})}
                          placeholder={t('enter_name_placeholder')}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="age">{t('age')} *</Label>
                          <Input
                            id="age"
                            type="number"
                            value={citizenForm.age}
                            onChange={(e) => setCitizenForm({...citizenForm, age: e.target.value})}
                            placeholder={t('enter_age_placeholder')}
                          />
                        </div>
                        <div>
                          <Label htmlFor="gender">{t('gender')}</Label>
                          <Select onValueChange={(value) => setCitizenForm({...citizenForm, gender: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder={t('select_gender_placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              {getOptions('gender').map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="locality">{t('locality')}</Label>
                        <Input
                          id="locality"
                          value={citizenForm.locality}
                          onChange={(e) => setCitizenForm({...citizenForm, locality: e.target.value})}
                          placeholder={t('enter_locality_placeholder')}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label htmlFor="district">{t('district')}</Label>
                          <Select onValueChange={(value) => setCitizenForm({...citizenForm, district: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder={t('select_district_placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
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
                          <Select onValueChange={(value) => setCitizenForm({...citizenForm, mandal: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder={t('select_mandal_placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
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
                          <Select onValueChange={(value) => setCitizenForm({...citizenForm, village: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder={t('select_village_placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
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
                        <Label htmlFor="phone">{t('phone_number')} *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={citizenForm.phone_number}
                          onChange={(e) => setCitizenForm({...citizenForm, phone_number: e.target.value})}
                          placeholder={t('enter_phone_placeholder')}
                        />
                      </div>

                      <Button 
                        onClick={handleCitizenLogin}
                        className="w-full bg-government-blue hover:bg-government-blue/90"
                      >
                        {t('login')}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="official" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="official-name">{t('name')} *</Label>
                        <Input
                          id="official-name"
                          value={officialForm.name}
                          onChange={(e) => setOfficialForm({...officialForm, name: e.target.value})}
                          placeholder={t('official_name_placeholder')}
                        />
                      </div>

                      <div>
                        <Label htmlFor="department">{t('department')} *</Label>
                        <Select onValueChange={(value) => setOfficialForm({...officialForm, department: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('select_department_placeholder')} />
                          </SelectTrigger>
                          <SelectContent>
                            {getOptions('departments').map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="employee-id">{t('employee_id')} *</Label>
                        <Input
                          id="employee-id"
                          value={officialForm.employee_id}
                          onChange={(e) => setOfficialForm({...officialForm, employee_id: e.target.value})}
                          placeholder={t('employee_id_placeholder')}
                        />
                      </div>

                      <div>
                        <Label htmlFor="official-phone">{t('phone_number')} *</Label>
                        <Input
                          id="official-phone"
                          type="tel"
                          value={officialForm.phone_number}
                          onChange={(e) => setOfficialForm({...officialForm, phone_number: e.target.value})}
                          placeholder={t('enter_phone_placeholder')}
                        />
                      </div>

                      <Button 
                        onClick={handleOfficialLogin}
                        className="w-full bg-government-blue hover:bg-government-blue/90"
                      >
                        {t('login')}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button 
                  onClick={handleCompleteProfile}
                  disabled={authLoading}
                  className="w-full bg-government-blue hover:bg-government-blue/90"
                >
                  {authLoading ? 'Creating Profile...' : 'Complete Profile'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
