import React from 'react';
import { PhoneCall, ShieldCheck, MapPin, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import type { SiteSettings } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface HeroProps {
  settings: SiteSettings;
  onNavigateSection?: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onNavigateSection,
}) => {
  const { t } = useLanguage();

  const handleWhatsAppDirect = () => {
    const cleanNum = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(t.hero.whatsappMessage);
    window.open(`https://wa.me/${cleanNum}?text=${text}`, '_blank');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-16 pb-20 lg:pt-20 lg:pb-28">
      {/* Background ambient elements */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-sm shadow-inner">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>{t.hero.badge}</span>
          </div>
        </div>

        {/* Hero Heading */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {t.hero.titlePart1} <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">{t.hero.titlePart2}</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigateSection?.('about')}
              className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-900/40 hover:scale-102"
            >
              <span>{t.hero.aboutBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleWhatsAppDirect}
              className="px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/40 hover:scale-102"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.hero.whatsappBtn}</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-400/20 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold text-white">{t.hero.stat1Title}</div>
                <div className="text-xs text-slate-400">{t.hero.stat1Sub}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold text-white">{t.hero.stat2Title}</div>
                <div className="text-xs text-slate-400">{t.hero.stat2Sub}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold text-white">{t.hero.stat3Title}</div>
                <div className="text-xs text-slate-400">{t.hero.stat3Sub}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold text-white">{t.hero.stat4Title}</div>
                <div className="text-xs text-slate-400">{t.hero.stat4Sub}</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
