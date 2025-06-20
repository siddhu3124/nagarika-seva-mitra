
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdministrativeDivisionsProps {
  district: string;
  mandal: string;
  village: string;
  onDistrictChange: (value: string) => void;
  onMandalChange: (value: string) => void;
  onVillageChange: (value: string) => void;
}

const AdministrativeDivisions: React.FC<AdministrativeDivisionsProps> = ({
  district,
  mandal,
  village,
  onDistrictChange,
  onMandalChange,
  onVillageChange,
}) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="district">
          {t('district') || 'District'}
        </Label>
        <Input
          id="district"
          value={district}
          onChange={(e) => onDistrictChange(e.target.value)}
          placeholder={t('district') || 'District'}
        />
      </div>
      <div>
        <Label htmlFor="mandal">
          {t('mandal') || 'Mandal'}
        </Label>
        <Input
          id="mandal"
          value={mandal}
          onChange={(e) => onMandalChange(e.target.value)}
          placeholder={t('mandal') || 'Mandal'}
        />
      </div>
      <div>
        <Label htmlFor="village">
          {t('village') || 'Village'}
        </Label>
        <Input
          id="village"
          value={village}
          onChange={(e) => onVillageChange(e.target.value)}
          placeholder={t('village') || 'Village'}
        />
      </div>
    </div>
  );
};

export default AdministrativeDivisions;
