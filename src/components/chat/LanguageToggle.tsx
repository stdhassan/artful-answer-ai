import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Languages } from 'lucide-react';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="text-muted-foreground hover:text-foreground gap-2"
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-medium">{language === 'en' ? 'عربي' : 'EN'}</span>
    </Button>
  );
}
