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
import LanguageToggle from '@/components/LanguageToggle';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, getOptions } = useLanguage();
  const { toast } = useToast();

  // Citizen form state
  const [citizenForm, setCitizenForm] = useState({
    name: '',
    age: '',
    gender: '',
    locality: '',
    phone_number: '',
    district: '',
    mandal: '',
    village: ''
  });

  // Official form state
  const [officialForm, setOfficialForm] = useState({
    name: '',
    department: '',
    phone_number: '',
    employee_id: ''
  });

  const handleCitizenLogin = async () => {
    if (!citizenForm.name || !citizenForm.phone_number || !citizenForm.age) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Mock OTP verification - In real app, this would integrate with Supabase Auth
    const userData = {
      id: 'citizen_' + Date.now(),
      ...citizenForm,
      age: parseInt(citizenForm.age),
      role: 'citizen' as const
    };

    login(userData);
    toast({
      title: "Success",
      description: "Logged in successfully",
    });
    navigate('/citizen/feedback');
  };

  const handleOfficialLogin = async () => {
    if (!officialForm.name || !officialForm.employee_id || !officialForm.department) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Mock validation against officials table
    const userData = {
      id: 'official_' + Date.now(),
      ...officialForm,
      role: 'official' as const
    };

    login(userData);
    toast({
      title: "Success",
      description: "Logged in successfully",
    });
    navigate('/official/dashboard');
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
              <CardTitle className="text-government-blue">Welcome</CardTitle>
              <LanguageToggle />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="citizen" className="w-full">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
