import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

const translations: Translations = {
  appName: { en: 'Abbas', ar: 'عباس' },
  poweredBy: { en: 'Developed by Hassan Mahmoud Hassan', ar: 'طوّره حسن محمود حسن' },
  clear: { en: 'Clear', ar: 'مسح' },
  history: { en: 'History', ar: 'السجل' },
  howCanIHelp: { en: 'How can I help you today?', ar: 'كيف يمكنني مساعدتك اليوم؟' },
  capabilities: { en: 'I can generate code, create images, design infographics, and much more. Just ask!', ar: 'يمكنني توليد الأكواد، إنشاء الصور، تصميم الرسوم البيانية، والمزيد. فقط اسأل!' },
  codeGeneration: { en: 'Code Generation', ar: 'توليد الأكواد' },
  codeDesc: { en: 'Generate code in any language with syntax highlighting', ar: 'توليد أكواد بأي لغة برمجية مع تمييز الصياغة' },
  imageCreation: { en: 'Image Creation', ar: 'إنشاء الصور' },
  imageDesc: { en: 'Create stunning images from text descriptions', ar: 'إنشاء صور مذهلة من الأوصاف النصية' },
  infographics: { en: 'Infographics & Slides', ar: 'الرسوم البيانية والشرائح' },
  infographicsDesc: { en: 'Design visual presentations and data graphics', ar: 'تصميم العروض المرئية والرسوم البيانية' },
  smartSolutions: { en: 'Smart Solutions', ar: 'حلول ذكية' },
  smartDesc: { en: 'Get intelligent answers to complex problems', ar: 'احصل على إجابات ذكية لمشاكل معقدة' },
  typeMessage: { en: 'Type your message...', ar: 'اكتب رسالتك...' },
  thinking: { en: 'Abbas is thinking...', ar: 'عباس يفكر...' },
  generateCode: { en: 'Generate code', ar: 'توليد كود' },
  createImage: { en: 'Create image', ar: 'إنشاء صورة' },
  explainConcept: { en: 'Explain concept', ar: 'شرح مفهوم' },
  designIdea: { en: 'Design idea', ar: 'فكرة تصميم' },
  copy: { en: 'Copy', ar: 'نسخ' },
  copied: { en: 'Copied!', ar: 'تم النسخ!' },
  download: { en: 'Download', ar: 'تحميل' },
  newChat: { en: 'New Chat', ar: 'محادثة جديدة' },
  noHistory: { en: 'No chat history yet', ar: 'لا يوجد سجل محادثات بعد' },
  deleteChat: { en: 'Delete', ar: 'حذف' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('abbas-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('abbas-language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
