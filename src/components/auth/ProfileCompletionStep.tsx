
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import CitizenProfileForm from './CitizenProfileForm';
import EmployeeProfileForm from './EmployeeProfileForm';

const ProfileCompletionStep: React.FC = () => {
  const { t } = useLanguage();
  const [userType, setUserType] = useState<'citizen' | 'official'>('citizen');

  return (
    <div className="space-y-4">
      <Tabs value={userType} onValueChange={(value) => setUserType(value as 'citizen' | 'official')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="citizen">{t('citizen_login')}</TabsTrigger>
          <TabsTrigger value="official">{t('employee_login')}</TabsTrigger>
        </TabsList>

        <TabsContent value="citizen" className="space-y-4">
          <CitizenProfileForm />
        </TabsContent>

        <TabsContent value="official" className="space-y-4">
          <EmployeeProfileForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileCompletionStep;
