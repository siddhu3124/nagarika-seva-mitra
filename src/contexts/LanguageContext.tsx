import React, { createContext, useContext, useState } from 'react';

type Language = 'telugu' | 'english' | 'urdu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getOptions: (category: string) => Array<{value: string, label: string}>;
}

interface Translations {
  [key: string]: {
    telugu: string;
    english: string;
    urdu: string;
  };
}

const translations: Translations = {
  'citizen_login': {
    telugu: 'పౌరుడు లాగిన్',
    english: 'Citizen Login',
    urdu: 'شہری لاگ ان'
  },
  'official_login': {
    telugu: 'అధికారి లాగిన్',
    english: 'Official Login',
    urdu: 'سرکاری لاگ ان'
  },
  'name': {
    telugu: 'పేరు',
    english: 'Name',
    urdu: 'نام'
  },
  'age': {
    telugu: 'వయస్సు',
    english: 'Age',
    urdu: 'عمر'
  },
  'gender': {
    telugu: 'లింగం',
    english: 'Gender',
    urdu: 'جنس'
  },
  'phone_number': {
    telugu: 'ఫోన్ నంబర్',
    english: 'Phone Number',
    urdu: 'فون نمبر'
  },
  'locality': {
    telugu: 'ప్రాంతం',
    english: 'Locality',
    urdu: 'علاقہ'
  },
  'department': {
    telugu: 'విభాగం',
    english: 'Department',
    urdu: 'شعبہ'
  },
  'employee_id': {
    telugu: 'ఉద్యోగి ID',
    english: 'Employee ID',
    urdu: 'ملازم آئی ڈی'
  },
  'district': {
    telugu: 'జిల్లా',
    english: 'District',
    urdu: 'ضلع'
  },
  'mandal': {
    telugu: 'మండలం',
    english: 'Mandal',
    urdu: 'منڈل'
  },
  'village': {
    telugu: 'గ్రామం',
    english: 'Village',
    urdu: 'گاؤں'
  },
  'feedback_form': {
    telugu: 'ఫీడ్‌బ్యాక్ ఫారం',
    english: 'Feedback Form',
    urdu: 'رائے فارم'
  },
  'service_type': {
    telugu: 'సేవా రకం',
    english: 'Service Type',
    urdu: 'سروس کی قسم'
  },
  'rating': {
    telugu: 'రేటింగ్',
    english: 'Rating',
    urdu: 'درجہ بندی'
  },
  'feedback_text': {
    telugu: 'ఫీడ్‌బ్యాక్ టెక్స్ట్',
    english: 'Feedback Text',
    urdu: 'رائے کا متن'
  },
  'submit': {
    telugu: 'సమర్పించు',
    english: 'Submit',
    urdu: 'جمع کریں'
  },
  'login': {
    telugu: 'లాగిన్',
    english: 'Login',
    urdu: 'لاگ ان'
  },
  'logout': {
    telugu: 'లాగ్ అవుట్',
    english: 'Logout',
    urdu: 'لاگ آؤٹ'
  },
  'male': {
    telugu: 'పురుషుడు',
    english: 'Male',
    urdu: 'مرد'
  },
  'female': {
    telugu: 'స్త్రీ',
    english: 'Female',
    urdu: 'عورت'
  },
  'other': {
    telugu: 'ఇతర',
    english: 'Other',
    urdu: 'دیگر'
  },
  'enter_name_placeholder': {
    telugu: 'మీ పేరు నమోదు చేయండి',
    english: 'Enter your name',
    urdu: 'اپنا نام درج کریں'
  },
  'enter_age_placeholder': {
    telugu: 'వయస్సు',
    english: 'Age',
    urdu: 'عمر'
  },
  'select_gender_placeholder': {
    telugu: 'లింగం',
    english: 'Gender',
    urdu: 'جنس'
  },
  'enter_locality_placeholder': {
    telugu: 'మీ ప్రాంతం',
    english: 'Your locality',
    urdu: 'اپنا علاقہ'
  },
  'select_district_placeholder': {
    telugu: 'జిల్లా',
    english: 'District',
    urdu: 'ضلع'
  },
  'select_mandal_placeholder': {
    telugu: 'మండలం',
    english: 'Mandal',
    urdu: 'منڈل'
  },
  'select_village_placeholder': {
    telugu: 'గ్రామం',
    english: 'Village',
    urdu: 'گاؤں'
  },
  'enter_phone_placeholder': {
    telugu: '+91 9876543210',
    english: '+91 9876543210',
    urdu: '+91 9876543210'
  },
  'official_name_placeholder': {
    telugu: 'అధికారి పేరు',
    english: 'Official name',
    urdu: 'سرکاری نام'
  },
  'select_department_placeholder': {
    telugu: 'విభాగం ఎంచుకోండి',
    english: 'Select department',
    urdu: 'شعبہ منتخب کریں'
  },
  'employee_id_placeholder': {
    telugu: 'EMP001',
    english: 'EMP001',
    urdu: 'EMP001'
  },
  'select_service_placeholder': {
    telugu: 'సేవా రకం ఎంచుకోండి',
    english: 'Select service type',
    urdu: 'سروس کی قسم منتخب کریں'
  },
  'feedback_placeholder': {
    telugu: 'మీ అభిప్రాయం వివరంగా రాయండి...',
    english: 'Write your feedback in detail...',
    urdu: 'اپنی رائے تفصیل سے لکھیں...'
  },
  'message_title_placeholder': {
    telugu: 'సందేశ శీర్షిక నమోదు చేయండి...',
    english: 'Enter message title...',
    urdu: 'پیغام کا عنوان درج کریں...'
  },
  'message_body_placeholder': {
    telugu: 'మీ సందేశాన్ని ఇక్కడ టైప్ చేయండి...',
    english: 'Type your message here...',
    urdu: 'اپنا پیغام یہاں ٹائپ کریں...'
  }
};

// Dropdown options translations
const dropdownOptions = {
  gender: [
    { value: 'male', labelKey: 'male' },
    { value: 'female', labelKey: 'female' },
    { value: 'other', labelKey: 'other' }
  ],
  departments: [
    { 
      value: 'health', 
      labels: { telugu: 'ఆరోగ్య శాఖ', english: 'Health Department', urdu: 'صحت کا شعبہ' }
    },
    { 
      value: 'roads', 
      labels: { telugu: 'రోడ్స్ & బిల్డింగ్స్', english: 'Roads & Buildings', urdu: 'سڑکیں اور عمارات' }
    },
    { 
      value: 'water', 
      labels: { telugu: 'వాటర్ సప్లై', english: 'Water Supply', urdu: 'پانی کی فراہمی' }
    },
    { 
      value: 'education', 
      labels: { telugu: 'విద్యా శాఖ', english: 'Education Department', urdu: 'تعلیمی شعبہ' }
    },
    { 
      value: 'agriculture', 
      labels: { telugu: 'వ్యవసాయ శాఖ', english: 'Agriculture Department', urdu: 'زراعت کا شعبہ' }
    }
  ],
  services: [
    { 
      value: 'water', 
      labels: { telugu: 'నీటి సరఫరా', english: 'Water Supply', urdu: 'پانی کی فراہمی' }
    },
    { 
      value: 'electricity', 
      labels: { telugu: 'విద్యుత్', english: 'Electricity', urdu: 'بجلی' }
    },
    { 
      value: 'roads', 
      labels: { telugu: 'రోడ్లు', english: 'Roads', urdu: 'سڑکیں' }
    },
    { 
      value: 'healthcare', 
      labels: { telugu: 'ఆరోగ్య సేవలు', english: 'Healthcare', urdu: 'صحت کی دیکھ بھال' }
    },
    { 
      value: 'sanitation', 
      labels: { telugu: 'పరిశుభ్రత', english: 'Sanitation', urdu: 'صفائی' }
    },
    { 
      value: 'education', 
      labels: { telugu: 'విద్య', english: 'Education', urdu: 'تعلیم' }
    }
  ],
  districts: [
    { 
      value: 'hyderabad', 
      labels: { telugu: 'హైదరాబాద్', english: 'Hyderabad', urdu: 'حیدرآباد' }
    },
    { 
      value: 'warangal', 
      labels: { telugu: 'వరంగల్', english: 'Warangal', urdu: 'ورنگل' }
    },
    { 
      value: 'nizamabad', 
      labels: { telugu: 'నిజామాబాద్', english: 'Nizamabad', urdu: 'نظام آباد' }
    }
  ],
  mandals: [
    { 
      value: 'secunderabad', 
      labels: { telugu: 'సికింద్రాబాద్', english: 'Secunderabad', urdu: 'سکندرآباد' }
    },
    { 
      value: 'kukatpally', 
      labels: { telugu: 'కుకట్‌పల్లి', english: 'Kukatpally', urdu: 'کوکت پلی' }
    },
    { 
      value: 'lbnagar', 
      labels: { telugu: 'LB నగర్', english: 'LB Nagar', urdu: 'ایل بی نگر' }
    }
  ],
  villages: [
    { 
      value: 'village1', 
      labels: { telugu: 'గ్రామం 1', english: 'Village 1', urdu: 'گاؤں 1' }
    },
    { 
      value: 'village2', 
      labels: { telugu: 'గ్రామం 2', english: 'Village 2', urdu: 'گاؤں 2' }
    },
    { 
      value: 'village3', 
      labels: { telugu: 'గ్రామం 3', english: 'Village 3', urdu: 'گاؤں 3' }
    }
  ],
  urgency: [
    { 
      value: 'low', 
      labels: { telugu: 'తక్కువ', english: 'Low', urdu: 'کم' }
    },
    { 
      value: 'medium', 
      labels: { telugu: 'మధ్యమ', english: 'Medium', urdu: 'درمیانہ' }
    },
    { 
      value: 'high', 
      labels: { telugu: 'అధిక', english: 'High', urdu: 'زیادہ' }
    }
  ]
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('telugu');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const getOptions = (category: string): Array<{value: string, label: string}> => {
    const options = dropdownOptions[category as keyof typeof dropdownOptions];
    if (!options) return [];

    return options.map(option => {
      if ('labelKey' in option) {
        // For simple options with labelKey
        return {
          value: option.value,
          label: t(option.labelKey)
        };
      } else {
        // For complex options with direct labels
        return {
          value: option.value,
          label: option.labels[language]
        };
      }
    });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getOptions }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
