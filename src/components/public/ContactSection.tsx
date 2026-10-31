import React, { useState } from 'react';
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
} from 'lucide-react';
import type { SiteSettings } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ContactSectionProps {
  settings: SiteSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [submitted, setSubmitted] = useState(false);

  // Real-time validation helpers
  const isNameValid = formData.name.trim().length >= 2;
  const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
  const isPhoneValid = cleanPhone.length === 10;
  const isMessageValid = formData.message.trim().length >= 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, message: true });

    if (!isNameValid || !isPhoneValid || !isMessageValid) {
      return;
    }

    // Direct WhatsApp message formatting
    const cleanNum = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello Home Call Jobs Team,\n\nName: ${formData.name}\nPhone: ${formData.phone}\nMessage: ${formData.message}`
    );
    window.open(`https://wa.me/${cleanNum}?text=${text}`, '_blank');
    setSubmitted(true);
  };

  const handleDirectWhatsApp = () => {
    const cleanNum = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent('Hello Home Call Jobs Support Team, I would like to inquire about telecalling openings.');
    window.open(`https://wa.me/${cleanNum}?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            {t.contact.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.contact.title}
          </h2>
          <p className="text-slate-600 mt-3 text-base sm:text-lg">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6 shadow-xl">
              <div>
                <h3 className="text-xl font-bold">{t.contact.cardTitle}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t.contact.cardSubtitle}
                </p>
              </div>

              {/* WhatsApp Card */}
              <div
                onClick={handleDirectWhatsApp}
                className="p-4 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-emerald-300 uppercase tracking-wider">{t.contact.instantWhatsapp}</div>
                    <div className="text-sm font-bold text-white">{settings.contactPhone || '+91 72380 87918'}</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  {t.contact.chatNow}
                </span>
              </div>

              {/* Direct Info List */}
              <div className="space-y-4 pt-2 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-400">{t.contact.emailLabel}</div>
                    <a href={`mailto:${settings.contactEmail}`} className="font-semibold text-white hover:underline">
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <PhoneCall className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-400">{t.contact.supportPhoneLabel}</div>
                    <span className="font-semibold text-white">{settings.contactPhone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-400">{t.contact.officeLabel}</div>
                    <span className="font-normal text-slate-300 leading-snug">{settings.companyAddress}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-400">{t.contact.hoursLabel}</div>
                    <span className="font-semibold text-white">
                      {language === 'hi' ? t.policy.workingHoursVal : (settings.workingHours || t.policy.workingHoursVal)}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Inquiry Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-xs">
              
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{t.contact.successTitle}</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    {t.contact.successDesc}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', phone: '', message: '' });
                      setTouched({});
                    }}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700"
                  >
                    {t.contact.sendAnotherBtn}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{t.contact.formTitle}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {t.contact.formSubtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold uppercase text-slate-700">
                          {t.contact.nameLabel}
                        </label>
                        {touched.name && !isNameValid && (
                          <span className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                            {t.contact.nameError}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder={t.contact.namePlaceholder}
                          value={formData.name}
                          onBlur={() => setTouched({ ...touched, name: true })}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            setTouched({ ...touched, name: true });
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
                            touched.name && !isNameValid
                              ? 'border-red-500 bg-red-50/50 text-red-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 pr-14'
                              : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800'
                          }`}
                        />
                        {touched.name && !isNameValid && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none flex items-center gap-1">
                            <span className="text-xs font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                              {t.contact.galatBadge}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Phone / WhatsApp Number */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold uppercase text-slate-700">
                          {t.contact.phoneLabel}
                        </label>
                        {touched.phone && !isPhoneValid && (
                          <span className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                            {t.contact.phoneError}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder={t.contact.phonePlaceholder}
                          value={formData.phone}
                          onBlur={() => setTouched({ ...touched, phone: true })}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            setFormData({ ...formData, phone: val });
                            setTouched({ ...touched, phone: true });
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono transition-all ${
                            touched.phone && !isPhoneValid
                              ? 'border-red-500 bg-red-50/50 text-red-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 pr-14'
                              : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800'
                          }`}
                        />
                        {touched.phone && !isPhoneValid && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none flex items-center gap-1">
                            <span className="text-xs font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                              {t.contact.galatBadge}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase text-slate-700">
                        {t.contact.messageLabel}
                      </label>
                      {touched.message && !isMessageValid && (
                        <span className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                          {t.contact.messageError}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <textarea
                        rows={3}
                        required
                        placeholder={t.contact.messagePlaceholder}
                        value={formData.message}
                        onBlur={() => setTouched({ ...touched, message: true })}
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value });
                          setTouched({ ...touched, message: true });
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
                          touched.message && !isMessageValid
                            ? 'border-red-500 bg-red-50/50 text-red-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500'
                            : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800'
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.contact.sendBtn}</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
