import React from 'react';
import { Sparkles, Code, Image, Lightbulb, FileSliders } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function EmptyState() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Code,
      titleKey: 'codeGeneration',
      descKey: 'codeDesc',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Image,
      titleKey: 'imageCreation',
      descKey: 'imageDesc',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: FileSliders,
      titleKey: 'infographics',
      descKey: 'infographicsDesc',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Lightbulb,
      titleKey: 'smartSolutions',
      descKey: 'smartDesc',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
      {/* Logo */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-3xl opacity-20 animate-pulse-slow" />
        <div className="relative flex items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">{t('appName')}</h1>
            <p className="text-muted-foreground">{t('poweredBy')}</p>
          </div>
        </div>
      </div>

      {/* Welcome text */}
      <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2 text-center">
        {t('howCanIHelp')}
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-10">
        {t('capabilities')}
      </p>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
        {features.map((feature) => (
          <div
            key={feature.titleKey}
            className="group p-5 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-10`}>
                <feature.icon className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{t(feature.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(feature.descKey)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}