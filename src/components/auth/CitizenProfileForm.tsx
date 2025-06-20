
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { usePhoneAuth } from '@/hooks/usePhoneAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const CitizenProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();
  const { t, getOptions } = useLanguage();
  const { toast } = useToast();
  const { phoneNumber } = usePhoneAuth();

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

  // Get all options from language context
  const allDistricts = getOptions('districts');
  const allMandals = getOptions('mandals');
  const allVillages = getOptions('villages');

  // Improved cascading dropdown logic with proper filtering
  const getFilteredMandals = () => {
    if (!citizenForm.district) return [];
    
    // Filter mandals based on selected district
    return allMandals.filter(mandal => {
      // The mandal values should contain the district as a prefix or be associated
      // This is a simplified version - in a real app you'd have proper relational data
      switch (citizenForm.district) {
        case 'hyderabad':
          return ['secunderabad', 'kukatpally', 'lbnagar'].includes(mandal.value);
        case 'warangal':
          return ['warangal_urban', 'warangal_rural'].includes(mandal.value);
        case 'nizamabad':
          return ['nizamabad_urban', 'nizamabad_rural'].includes(mandal.value);
        default:
          return false;
      }
    });
  };

  const getFilteredVillages = () => {
    if (!citizenForm.mandal) return [];
    
    // Filter villages based on selected mandal
    return allVillages.filter(village => {
      // The village values should be associated with the mandal
      switch (citizenForm.mandal) {
        case 'secunderabad':
          return ['village1', 'village2'].includes(village.value);
        case 'kukatpally':
          return ['village2', 'village3'].includes(village.value);
        case 'lbnagar':
          return ['village1', 'village3'].includes(village.value);
        case 'warangal_urban':
          return ['village1', 'village2'].includes(village.value);
        case 'warangal_rural':
          return ['village2', 'village3'].includes(village.value);
        case 'nizamabad_urban':
          return ['village1', 'village3'].includes(village.value);
        case 'nizamabad_rural':
          return ['village1', 'village2'].includes(village.value);
        default:
          return false;
      }
    });
  };

  const filteredMandals = getFilteredMandals();
  const filteredVillages = getFilteredVillages();

  const handleDistrictChange = (value: string) => {
    setCitizenForm({
      ...citizenForm,
      district: value,
      mandal: '', // Reset mandal when district changes
      village: '' // Reset village when district changes
    });
  };

  const handleMandalChange = (value: string) => {
    setCitizenForm({
      ...citizenForm,
      mandal: value,
      village: '' // Reset village when mandal changes
    });
  };

  const handleSubmit = async () => {
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
        description: t('mandal') + " is required. Please select district first.",
        variant: "destructive"
      });
      return;
    }

    if (!citizenForm.village) {
      toast({
        title: "Error",
        description: t('village') + " is required. Please select mandal first.",
        variant: "destructive"
      });
      return;
    }

    try {
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
        auth_user_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        userData.auth_user_id = session.user.id;
      }

      console.log('Submitting citizen data to users table:', userData);

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

      await login(authUserData);

      toast({
        title: "Success",
        description: "Profile completed successfully",
      });

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

  return (
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
            <SelectContent className="bg-white z-50">
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
              <SelectValue 
                placeholder={
                  !citizenForm.district 
                    ? "Please select district first" 
                    : t('select_mandal_placeholder')
                } 
              />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              {filteredMandals.length > 0 ? (
                filteredMandals.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-2 text-sm text-gray-500">
                  {!citizenForm.district ? "Select district first" : "No mandals available"}
                </div>
              )}
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
              <SelectValue 
                placeholder={
                  !citizenForm.mandal 
                    ? "Please select mandal first" 
                    : t('select_village_placeholder')
                } 
              />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              {filteredVillages.length > 0 ? (
                filteredVillages.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-2 text-sm text-gray-500">
                  {!citizenForm.mandal ? "Select mandal first" : "No villages available"}
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        onClick={handleSubmit}
        disabled={authLoading}
        className="w-full bg-government-blue hover:bg-government-blue/90"
      >
        {authLoading ? 'Processing...' : 'Complete Profile'}
      </Button>
    </div>
  );
};

export default CitizenProfileForm;
