
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServiceTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const serviceTypes = [
  'Healthcare',
  'Education',
  'Transportation',
  'Water Supply',
  'Electricity',
  'Sanitation',
  'Public Safety',
  'Infrastructure',
  'Government Services',
  'Other'
];

const ServiceTypeSelector: React.FC<ServiceTypeSelectorProps> = ({ value, onChange }) => {
  const { t } = useLanguage();

  return (
    <div>
      <Label htmlFor="service_type">
        {t('service_category') || 'Service Category'} *
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={t('select_service') || 'Select a service'} />
        </SelectTrigger>
        <SelectContent>
          {serviceTypes.map((service) => (
            <SelectItem key={service} value={service}>
              {service}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ServiceTypeSelector;
