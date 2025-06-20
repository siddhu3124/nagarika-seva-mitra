
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
    village: '',
    phone_number: ''
  });

  // Employee form state (updated to match requirements)
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    department: '',
    employee_id: ''
  });

  const [userType, setUserType] = useState<'citizen' | 'official'>('citizen');

  // Cascading dropdown logic
  const allDistricts = getOptions('districts');
  const allMandals = getOptions('mandals');
  const allVillages = getOptions('villages');

  // Filter mandals based on selected district
  const filteredMandals = citizenForm.district 
    ? allMandals.filter(mandal => mandal.value.startsWith(citizenForm.district))
    : allMandals;

  // Filter villages based on selected mandal
  const filteredVillages = citizenForm.mandal 
    ? allVillages.filter(village => village.value.startsWith(citizenForm.mandal))
    : allVillages;

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

  const validateEmployeeCredentials = async (name: string, department: string, employeeId: string) => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('name', name)
      .eq('department', department)
      .eq('employee_id', employeeId)
      .single();

    if (error || !data) {
      return null;
    }
    return data;
  };

  const handleCitizenLogin = async () => {
    // Validate required fields
    if (!citizenForm.name.trim()) {
      toast({
        title: "Error",
        description: t('name') + " is required",
        variant: "destructive"
      });
      return;
    }

    if (!citizenForm.age || parseInt(citizenForm.age) < 1 || parseInt(citizenForm.age) > 120) {
      toast({
        title: "Error",
        description: "Please enter a valid age",
        variant: "destructive"
      });
      return;
    }

    if (!citizenForm.district) {
      toast({
        title: "Error",
        description: t('district') + " is required",
        variant: "destructive"
      });
      return;
    }

    if (!citizenForm.mandal) {
      toast({
        title: "Error",
        description: t('mandal') + " is required",
        variant: "destructive"
      });
      return;
    }

    if (!citizenForm.village) {
      toast({
        title: "Error",
        description: t('village') + " is required",
        variant: "destructive"
      });
      return;
    }

    try {
      // Prepare user data for Supabase users table
      const userData = {
        name: citizenForm.name.trim(),
        age: parseInt(citizenForm.age),
        gender: citizenForm.gender || null,
        locality: citizenForm.locality.trim() || null,
        district: citizenForm.district,
        mandal: citizenForm.mandal,
        village: citizenForm.village,
        phone_number: phoneNumber,
        role: 'citizen',
        auth_user_id: null, // Will be set if authenticated
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // If user is authenticated via phone, get their auth ID
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        userData.auth_user_id = session.user.id;
      }

      console.log('Submitting citizen data to users table:', userData);

      // Insert into users table
      const { data: insertedUser, error: insertError } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting user:', insertError);
        toast({
          title: "Error",
          description: insertError.message || "Failed to create profile",
          variant: "destructive"
        });
        return;
      }

      // Create user object for auth context
      const authUserData = {
        id: insertedUser.id,
        name: insertedUser.name,
        age: insertedUser.age,
        gender: insertedUser.gender,
        locality: insertedUser.locality,
        district: insertedUser.district,
        mandal: insertedUser.mandal,
        village: insertedUser.village,
        phone_number: insertedUser.phone_number,
        role: 'citizen' as const
      };

      // Login user in auth context
      await login(authUserData);

      toast({
        title: "Success",
        description: "Profile completed successfully",
      });

      // Navigate to citizen dashboard
      navigate('/citizen/feedback');
    } catch (error) {
      console.error('Error in citizen profile submission:', error);
      toast({
        title: "Error",
        description: "Failed to complete profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEmployeeLogin = async () => {
    if (!employeeForm.name || !employeeForm.department || !employeeForm.employee_id) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Validate employee credentials against employees table
    const employeeData = await validateEmployeeCredentials(
      employeeForm.name, 
      employeeForm.department, 
      employeeForm.employee_id
    );
    
    if (!employeeData) {
      toast({
        title: "Error",
        description: "Invalid employee credentials",
        variant: "destructive"
      });
      return;
    }

    // Store employee info in localStorage for session management
    localStorage.setItem('employeeInfo', JSON.stringify(employeeData));

    const userData = {
      id: 'official_' + Date.now(),
      name: employeeData.name,
      department: employeeData.department,
      employee_id: employeeData.employee_id,
      phone_number: employeeData.phone_number || phoneNumber,
      district: employeeData.district,
      mandal: employeeData.mandal,
      village: employeeData.village,
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
  };

  const handleCompleteProfile = async () => {
    if (userType === 'citizen') {
      await handleCitizenLogin();
    } else {
      await handleEmployeeLogin();
    }
  };

  // Handle district change and reset dependent fields
  const handleDistrictChange = (value: string) => {
    setCitizenForm({
      ...citizenForm,
      district: value,
      mandal: '', // Reset mandal when district changes
      village: '' // Reset village when district changes
    });
  };

  // Handle mandal change and reset village
  const handleMandalChange = (value: string) => {
    setCitizenForm({
      ...citizenForm,
      mandal: value,
      village: '' // Reset village when mandal changes
    });
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
                    placeholder={t('enter_phone_placeholder')}
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
                    <TabsTrigger value="official">Employee Login</TabsTrigger>
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
                            min="1"
                            max="120"
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
                          <Label htmlFor="district">{t('district')} *</Label>
                          <Select value={citizenForm.district} onValueChange={handleDistrictChange}>
                            <SelectTrigger>
                              <SelectValue placeholder={t('select_district_placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              {allDistricts.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="mandal">{t('mandal')} *</Label>
                          <Select 
                            value={citizenForm.mandal} 
                            onValueChange={handleMandalChange}
                            disabled={!citizenForm.district}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t('select_mandal_placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredMandals.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="village">{t('village')} *</Label>
                          <Select 
                            value={citizenForm.village} 
                            onValueChange={(value) => setCitizenForm({...citizenForm, village: value})}
                            disabled={!citizenForm.mandal}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t('select_village_placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredVillages.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="official" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="employee-name">Name *</Label>
                        <Input
                          id="employee-name"
                          value={employeeForm.name}
                          onChange={(e) => setEmployeeForm({...employeeForm, name: e.target.value})}
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="department">Department *</Label>
                        <Input
                          id="department"
                          value={employeeForm.department}
                          onChange={(e) => setEmployeeForm({...employeeForm, department: e.target.value})}
                          placeholder="Enter your department"
                        />
                      </div>

                      <div>
                        <Label htmlFor="employee-id">Employee ID *</Label>
                        <Input
                          id="employee-id"
                          value={employeeForm.employee_id}
                          onChange={(e) => setEmployeeForm({...employeeForm, employee_id: e.target.value})}
                          placeholder="Enter your employee ID"
                        />
                      </div>

                      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                        <p className="font-medium mb-1">Test Credentials:</p>
                        <p>Name: Rajesh Kumar | Dept: Revenue | ID: REV001</p>
                        <p>Name: Priya Sharma | Dept: Health | ID: HLT001</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button 
                  onClick={handleCompleteProfile}
                  disabled={authLoading}
                  className="w-full bg-government-blue hover:bg-government-blue/90"
                >
                  {authLoading ? 'Processing...' : 'Complete Profile'}
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
