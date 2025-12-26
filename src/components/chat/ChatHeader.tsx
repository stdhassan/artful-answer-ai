import React from 'react';
import { Sparkles, Trash2, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChatHeaderProps {
  onClear: () => void;
  hasMessages: boolean;
  onToggleHistory: () => void;
}

export function ChatHeader({ onClear, hasMessages, onToggleHistory }: ChatHeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleHistory}
          className="text-muted-foreground hover:text-foreground md:hidden"
        >
          <History className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleHistory}
          className="text-muted-foreground hover:text-foreground hidden md:flex"
        >
          <History className="h-4 w-4 me-2" />
          {t('history')}
        </Button>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-lg gradient-text">{t('appName')}</h1>
          <p className="text-xs text-muted-foreground">{t('poweredBy')}</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <LanguageToggle />
        <ThemeToggle />
        {hasMessages && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 me-2" />
            <span className="hidden sm:inline">{t('clear')}</span>
          </Button>
        )}
      </div>
    </header>
  );
}