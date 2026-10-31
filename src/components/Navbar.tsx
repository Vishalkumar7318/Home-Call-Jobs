import React, { useState } from 'react';
import { PhoneCall, User, ShieldCheck, LogOut, Menu, X, ArrowRight, Languages } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  activeView: 'public' | 'employee' | 'admin';
  setActiveView: (view: 'public' | 'employee' | 'admin') => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, setActiveView, onNavigateSection }) => {
  const { role, currentEmployee, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setActiveView('public');
    setMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => { setActiveView('public'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-900 via-blue-800 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform duration-200">
              <PhoneCall className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">HOME CALL</span>
                <span className="text-xl font-extrabold tracking-tight text-blue-600 font-sans">JOBS</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 tracking-wider uppercase">
                {t.nav.subBrand}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items for Public view */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-sm font-semibold transition-colors ${
                activeView === 'public' ? 'text-blue-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors"
            >
              {t.nav.about}
            </button>
            <button
              onClick={() => handleNavClick('why-us')}
              className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors"
            >
              {t.nav.whyUs}
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors"
            >
              {t.nav.contact}
            </button>
          </nav>

          {/* Portal Switchers, Language Toggle & Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Language Switcher Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'hi'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="हिन्दी में देखें"
              >
                <span>🇮🇳 हिन्दी</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View in English"
              >
                <span>🇬🇧 English</span>
              </button>
            </div>

            {/* Employee Portal Access */}
            {role === 'employee' && currentEmployee ? (
              <button
                onClick={() => setActiveView('employee')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  activeView === 'employee'
                    ? 'bg-blue-50 border-blue-300 text-blue-900 ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentEmployee.fullName.charAt(0)}
                </div>
                <span>{currentEmployee.fullName} ({currentEmployee.employeeId})</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveView('employee')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  activeView === 'employee'
                    ? 'bg-blue-900 border-blue-900 text-white shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.nav.employeeLogin}</span>
              </button>
            )}

            {/* Admin Portal Access */}
            {role === 'admin' ? (
              <button
                onClick={() => setActiveView('admin')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  activeView === 'admin'
                    ? 'bg-indigo-900 border-indigo-900 text-white shadow-sm'
                    : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t.nav.adminPanel}</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveView('admin')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  activeView === 'admin'
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>{t.nav.adminLogin}</span>
              </button>
            )}

            {/* Logout button if active session */}
            {(role === 'employee' || role === 'admin') && (
              <button
                onClick={() => {
                  signOut();
                  setActiveView('public');
                }}
                title={t.nav.signOut}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            {/* Quick Explore Jobs CTA */}
            {activeView !== 'public' && (
              <button
                onClick={() => setActiveView('public')}
                className="ml-2 text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
              >
                {t.nav.jobPortal} <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Mobile hamburger menu toggle & quick language toggle */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Quick Language Toggle on Mobile */}
            <button
              onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200"
              title="भाषा बदलें / Change Language"
            >
              <Languages className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'hi' ? 'English' : 'हिन्दी'}</span>
            </button>

            <button
              onClick={() => setActiveView(activeView === 'public' ? 'employee' : 'public')}
              className="text-xs px-2.5 py-1.5 rounded-md font-semibold bg-blue-50 text-blue-700 border border-blue-200"
            >
              {activeView === 'public' ? t.nav.portalSwitch : t.nav.publicSwitch}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-blue-600" />
              भाषा चुनें / Choose Language:
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'hi' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-700'
                }`}
              >
                🇮🇳 हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'en' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-700'
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-md"
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-md"
            >
              {t.nav.about}
            </button>
            <button
              onClick={() => handleNavClick('why-us')}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-md"
            >
              {t.nav.whyUs}
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-md"
            >
              {t.nav.contact}
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => {
                setActiveView('employee');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-900 text-white font-semibold text-sm"
            >
              <User className="w-4 h-4" />
              {currentEmployee ? `${t.nav.employeeDashboard} (${currentEmployee.employeeId})` : t.nav.employeeLogin}
            </button>
            <button
              onClick={() => {
                setActiveView('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 text-white font-semibold text-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              {t.nav.adminPanel}
            </button>

            {(role === 'employee' || role === 'admin') && (
              <button
                onClick={() => {
                  signOut();
                  setActiveView('public');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-4 rounded-lg border border-red-200 text-red-600 font-semibold text-sm flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" /> {t.nav.signOut}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
