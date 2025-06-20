
import React, { createContext, useContext, useState } from 'react';

type Language = 'telugu' | 'english' | 'urdu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
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
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('telugu');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
