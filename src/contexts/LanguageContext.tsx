import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'te' | 'ur';

interface Translations {
  [key: string]: {
    en: string;
    te: string;
    ur: string;
  };
}

const translations: Translations = {
  // App branding
  app_name: {
    en: 'Nagarika Mitra',
    te: 'నాగరిక మిత్ర',
    ur: 'ناگریک مترا'
  },
  app_tagline: {
    en: 'Your Voice, Our Action',
    te: 'మీ మాట, మా చర్య',
    ur: 'آپ کی آواز، ہمارا عمل'
  },
  app_subtitle: {
    en: 'Government Citizen Service Platform',
    te: 'ప్రభుత్వ పౌర సేవా వేదిక',
    ur: 'حکومتی شہری خدمات کا پلیٹ فارم'
  },
  
  // Common UI
  loading: {
    en: 'Loading...',
    te: 'లోడ్ అవుతోంది...',
    ur: 'لوڈ ہو رہا ہے...'
  },
  submit: {
    en: 'Submit',
    te: 'సమర్పించు',
    ur: 'جمع کریں'
  },
  cancel: {
    en: 'Cancel',
    te: 'రద్దు చేయి',
    ur: 'منسوخ کریں'
  },
  save: {
    en: 'Save',
    te: 'సేవ్ చేయి',
    ur: 'محفوظ کریں'
  },
  
  // Authentication
  citizen_login: {
    en: 'Citizen Login',
    te: 'పౌర లాగిన్',
    ur: 'شہری لاگ ان'
  },
  employee_login: {
    en: 'Employee Login',
    te: 'ఉద్యోగి లాగిన్',
    ur: 'ملازم لاگ ان'
  },
  phone_verification: {
    en: 'Phone Verification',
    te: 'ఫోన్ ధృవీకరణ',
    ur: 'فون کی تصدیق'
  },
  complete_profile: {
    en: 'Complete Profile',
    te: 'ప్రొఫైల్ పూర్తి చేయండి',
    ur: 'پروفائل مکمل کریں'
  },
  
  // Profile fields
  name: {
    en: 'Name',
    te: 'పేరు',
    ur: 'نام'
  },
  age: {
    en: 'Age',
    te: 'వయస్సు',
    ur: 'عمر'
  },
  gender: {
    en: 'Gender',
    te: 'లింగం',
    ur: 'جنس'
  },
  phone_number: {
    en: 'Phone Number',
    te: 'ఫోన్ నంబర్',
    ur: 'فون نمبر'
  },
  employee_id: {
    en: 'Employee ID',
    te: 'ఉద్యోగి ID',
    ur: 'ملازم کی شناخت'
  },
  department: {
    en: 'Department',
    te: 'విభాగం',
    ur: 'شعبہ'
  },
  
  // Location fields
  district: {
    en: 'District',
    te: 'జిల్లా',
    ur: 'ضلع'
  },
  mandal: {
    en: 'Mandal',
    te: 'మండలం',
    ur: 'منڈل'
  },
  village: {
    en: 'Village',
    te: 'గ్రామం',
    ur: 'گاؤں'
  },
  select_district_placeholder: {
    en: 'Select District',
    te: 'జిల్లా ఎంచుకోండి',
    ur: 'ضلع منتخب کریں'
  },
  select_mandal_placeholder: {
    en: 'Select Mandal',
    te: 'మండలం ఎంచుకోండి',
    ur: 'منڈل منتخب کریں'
  },
  select_village_placeholder: {
    en: 'Select Village',
    te: 'గ్రామం ఎంచుకోండి',
    ur: 'گاؤں منتخب کریں'
  },
  
  // Feedback
  feedback_form: {
    en: 'Feedback Form',
    te: 'ఫీడ్‌బ్యాక్ ఫారం',
    ur: 'فیڈبیک فارم'
  },
  service_type: {
    en: 'Service Type',
    te: 'సేవా రకం',
    ur: 'خدمت کی قسم'
  },
  feedback_title: {
    en: 'Title',
    te: 'శీర్షిక',
    ur: 'عنوان'
  },
  feedback_text: {
    en: 'Feedback',
    te: 'ఫీడ్‌బ్యాక్',
    ur: 'فیڈبیک'
  },
  rating: {
    en: 'Rating',
    te: 'రేటింగ్',
    ur: 'درجہ بندی'
  },
  location_details: {
    en: 'Location Details',
    te: 'స్థాన వివరాలు',
    ur: 'مقام کی تفصیلات'
  },
  
  // Messages
  messages_from_officials: {
    en: 'Messages from Officials',
    te: 'అధికారుల సందేశాలు',
    ur: 'حکام کے پیغامات'
  },
  send_message: {
    en: 'Send Message',
    te: 'సందేశం పంపండి',
    ur: 'پیغام بھیجیں'
  },
  message_title: {
    en: 'Message Title',
    te: 'సందేశ శీర్షిక',
    ur: 'پیغام کا عنوان'
  },
  message_content: {
    en: 'Message Content',
    te: 'సందేశ కంటెంట్',
    ur: 'پیغام کا مواد'
  },
  urgency: {
    en: 'Urgency',
    te: 'అత్యవసరత',
    ur: 'فوری ضرورت'
  },
  
  // Service types
  healthcare: {
    en: 'Healthcare',
    te: 'ఆరోగ్య సంరక్షణ',
    ur: 'صحت کی دیکھ بھال'
  },
  education: {
    en: 'Education',
    te: 'విద్య',
    ur: 'تعلیم'
  },
  transportation: {
    en: 'Transportation',
    te: 'రవాణా',
    ur: 'نقل و حمل'
  },
  water_supply: {
    en: 'Water Supply',
    te: 'నీటి సరఫరా',
    ur: 'پانی کی فراہمی'
  },
  electricity: {
    en: 'Electricity',
    te: 'విద్యుత్',
    ur: 'بجلی'
  },
  sanitation: {
    en: 'Sanitation',
    te: 'పరిశుభ్రత',
    ur: 'صفائی'
  },
  public_safety: {
    en: 'Public Safety',
    te: 'ప్రజా భద్రత',
    ur: 'عوامی تحفظ'
  },
  infrastructure: {
    en: 'Infrastructure',
    te: 'మౌలిక వసతులు',
    ur: 'بنیادی ڈھانچہ'
  },
  government_services: {
    en: 'Government Services',
    te: 'ప్రభుత్వ సేవలు',
    ur: 'حکومتی خدمات'
  },
  other: {
    en: 'Other',
    te: 'ఇతర',
    ur: 'دیگر'
  },
  
  // Placeholders
  enter_name_placeholder: {
    en: 'Enter your name',
    te: 'మీ పేరు నమోదు చేయండి',
    ur: 'اپنا نام درج کریں'
  },
  enter_employee_id_placeholder: {
    en: 'Enter Employee ID',
    te: 'ఉద్యోగి ID నమోదు చేయండి',
    ur: 'ملازم کی شناخت درج کریں'
  },
  enter_phone_placeholder: {
    en: 'Enter phone number',
    te: 'ఫోన్ నంబర్ నమోదు చేయండి',
    ur: 'فون نمبر درج کریں'
  },
  enter_feedback_title_placeholder: {
    en: 'Enter feedback title',
    te: 'ఫీడ్‌బ్యాక్ శీర్షిక నమోదు చేయండి',
    ur: 'فیڈبیک کا عنوان درج کریں'
  },
  enter_feedback_placeholder: {
    en: 'Share your experience and suggestions...',
    te: 'మీ అనుభవం మరియు సూచనలను పంచుకోండి...',
    ur: 'اپنا تجربہ اور تجاویز شیئر کریں...'
  },
  enter_location_details_placeholder: {
    en: 'Provide specific location details...',
    te: 'నిర్దిష్ట స్థాన వివరాలను అందించండి...',
    ur: 'مخصوص مقام کی تفصیلات فراہم کریں...'
  },
  enter_message_title_placeholder: {
    en: 'Enter message title',
    te: 'సందేశ శీర్షిక నమోదు చేయండి',
    ur: 'پیغام کا عنوان درج کریں'
  },
  enter_message_content_placeholder: {
    en: 'Enter your message content here...',
    te: 'మీ సందేశ కంటెంట్‌ను ఇక్కడ నమోదు చేయండి...',
    ur: 'یہاں اپنے پیغام کا مواد درج کریں...'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  getOptions: (type: 'districts' | 'mandals' | 'villages' | 'serviceTypes' | 'departments' | 'gender') => Array<{ value: string; label: string }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const getOptions = (type: 'districts' | 'mandals' | 'villages' | 'serviceTypes' | 'departments' | 'gender') => {
    const options = {
      districts: [
        'Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon', 
        'Jayashankar Bhupalapally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 
        'Khammam', 'Komaram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar', 
        'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 
        'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 
        'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 
        'Vikarabad', 'Wanaparthy', 'Warangal Rural', 'Warangal Urban', 'Yadadri Bhuvanagiri'
      ],
      mandals: [], // Will be populated based on district selection
      villages: [], // Will be populated based on mandal selection
      serviceTypes: [
        'Healthcare', 'Education', 'Transportation', 'Water Supply', 'Electricity',
        'Sanitation', 'Public Safety', 'Infrastructure', 'Government Services', 'Other'
      ],
      departments: [
        'Revenue', 'Police', 'Health', 'Education', 'Agriculture', 'Roads & Buildings',
        'Water Supply', 'Electricity', 'Rural Development', 'Urban Development'
      ],
      gender: [
        'Male', 'Female', 'Other'
      ]
    };

    return options[type].map(option => ({
      value: option.toLowerCase().replace(' ', '_'),
      label: option
    }));
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
