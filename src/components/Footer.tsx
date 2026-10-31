import React from 'react';
import { PhoneCall, Mail, MapPin, Clock, MessageSquare, Shield, CheckCircle } from 'lucide-react';
import type { SiteSettings } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  settings: SiteSettings;
  onNavigateSection?: (sectionId: string) => void;
  onOpenPortal?: (portal: 'employee' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigateSection, onOpenPortal }) => {
  const { t, language, setLanguage } = useLanguage();
  const currentYear = new Date().getFullYear();

  const handleNav = (sectionId: string) => {
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white">HOME CALL</span>
                <span className="text-xl font-extrabold tracking-tight text-blue-400">JOBS</span>
              </div>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed">
              {t.footer.desc}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-950/80 border border-blue-800/60 text-blue-300">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                {t.footer.verifiedPartner}
              </span>
            </div>

            {/* Language Switcher in Footer */}
            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs text-slate-400">Language / भाषा:</span>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  language === 'hi' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  language === 'en' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider uppercase text-white">{t.footer.quickNav}</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-white transition-colors text-slate-400">
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition-colors text-slate-400">
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('why-us')} className="hover:text-white transition-colors text-slate-400">
                  {t.nav.whyUs}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors text-slate-400">
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Staff & Admin Access */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider uppercase text-white">{t.footer.staffPortals}</h3>
            <p className="text-xs text-slate-400">
              {t.footer.staffPortalsDesc}
            </p>
            <div className="space-y-2 pt-1">
              <button
                onClick={() => onOpenPortal?.('employee')}
                className="w-full text-left px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-between"
              >
                <span>{t.footer.employeeAttendance}</span>
                <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
              </button>
              <button
                onClick={() => onOpenPortal?.('admin')}
                className="w-full text-left px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-between"
              >
                <span>{t.footer.adminControl}</span>
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
              </button>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider uppercase text-white">{t.footer.contactSupport}</h3>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{settings.companyAddress}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition-colors">
                  {settings.contactEmail}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-slate-300 font-medium">
                  {language === 'hi' ? t.policy.workingHoursVal : (settings.workingHours || t.policy.workingHoursVal)}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-green-400 shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 font-medium"
                >
                  WhatsApp: {settings.contactPhone || '+91 72380 87918'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Paid Access Disclosure & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="max-w-2xl leading-relaxed">
            <span className="font-semibold text-slate-400">{t.footer.disclosureLabel}</span> {t.footer.disclosureText}
          </p>
          <div className="text-right">
            &copy; {currentYear} {t.footer.copyright}
          </div>
        </div>
      </div>
    </footer>
  );
};
