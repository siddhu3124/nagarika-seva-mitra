
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocationData } from '@/hooks/useLocationData';

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
  const { 
    districts, 
    getMandalsByDistrict, 
    getVillagesByMandal, 
    loading, 
    error 
  } = useLocationData();

  // Reset mandal and village when district changes
  useEffect(() => {
    if (district) {
      const availableMandals = getMandalsByDistrict(district);
      if (mandal && !availableMandals.includes(mandal)) {
        onMandalChange('');
        onVillageChange('');
      }
    }
  }, [district, mandal, getMandalsByDistrict, onMandalChange, onVillageChange]);

  // Reset village when mandal changes
  useEffect(() => {
    if (district && mandal) {
      const availableVillages = getVillagesByMandal(district, mandal);
      if (village && !availableVillages.includes(village)) {
        onVillageChange('');
      }
    }
  }, [district, mandal, village, getVillagesByMandal, onVillageChange]);

  const availableMandals = district ? getMandalsByDistrict(district) : [];
  const availableVillages = district && mandal ? getVillagesByMandal(district, mandal) : [];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="animate-pulse">
          <Label>Loading districts...</Label>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <Label>Loading mandals...</Label>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <Label>Loading villages...</Label>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-3 text-red-600">
          Error loading location data: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="district">
          {t('district') || 'District'} *
        </Label>
        <Select value={district} onValueChange={onDistrictChange}>
          <SelectTrigger>
            <SelectValue placeholder={t('select_district') || 'Select District'} />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto z-50">
            {districts.map((dist) => (
              <SelectItem key={dist} value={dist}>
                {dist}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="mandal">
          {t('mandal') || 'Mandal'} *
        </Label>
        <Select 
          value={mandal} 
          onValueChange={onMandalChange}
          disabled={!district}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              !district 
                ? 'Select district first' 
                : (t('select_mandal') || 'Select Mandal')
            } />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto z-50">
            {availableMandals.map((mand) => (
              <SelectItem key={mand} value={mand}>
                {mand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="village">
          {t('village') || 'Village'} *
        </Label>
        <Select 
          value={village} 
          onValueChange={onVillageChange}
          disabled={!district || !mandal}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              !district || !mandal 
                ? 'Select mandal first' 
                : (t('select_village') || 'Select Village')
            } />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto z-50">
            {availableVillages.map((vill) => (
              <SelectItem key={vill} value={vill}>
                {vill}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AdministrativeDivisions;
