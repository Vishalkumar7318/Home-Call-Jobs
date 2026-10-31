import React from 'react';
import {
  ShieldCheck,
  Zap,
  Users2,
  DollarSign,
  GraduationCap,
  Clock4,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const WhyChooseUs: React.FC = () => {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: ShieldCheck,
      title: t.whyUs.b1Title,
      description: t.whyUs.b1Desc,
      badge: t.whyUs.b1Badge,
    },
    {
      icon: DollarSign,
      title: t.whyUs.b2Title,
      description: t.whyUs.b2Desc,
      badge: t.whyUs.b2Badge,
    },
    {
      icon: Zap,
      title: t.whyUs.b3Title,
      description: t.whyUs.b3Desc,
      badge: t.whyUs.b3Badge,
    },
    {
      icon: GraduationCap,
      title: t.whyUs.b4Title,
      description: t.whyUs.b4Desc,
      badge: t.whyUs.b4Badge,
    },
    {
      icon: Clock4,
      title: t.whyUs.b5Title,
      description: t.whyUs.b5Desc,
      badge: t.whyUs.b5Badge,
    },
    {
      icon: Users2,
      title: t.whyUs.b6Title,
      description: t.whyUs.b6Desc,
      badge: t.whyUs.b6Badge,
    },
  ];

  return (
    <section id="why-us" className="py-20 bg-slate-100 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-200 mb-3">
            <CheckCircle className="w-3.5 h-3.5 text-blue-700" />
            {t.whyUs.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.whyUs.title}
          </h2>
          <p className="text-slate-600 mt-3 text-base sm:text-lg">
            {t.whyUs.subtitle}
          </p>
        </div>

        {/* User-Requested Prominent Headline Banner: ₹3,000 monthly fee payable only after salary */}
        <div className="max-w-4xl mx-auto mb-14">
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border-2 border-amber-400/80 shadow-2xl relative overflow-hidden">
            {/* Background accent glow */}
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg font-black text-xl">
                ₹
              </div>
              <div className="space-y-2 flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-black uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>महत्वपूर्ण सूचना / Official Candidate Policy</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-amber-300 leading-snug tracking-tight">
                  {t.whyUs.salaryFeeHeadline}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  {t.whyUs.salaryFeeSubtext}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {b.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">{b.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{b.description}</p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-700">
                  <span>{t.whyUs.guaranteedVerification}</span>
                  <CheckCircle className="w-3.5 h-3.5 ml-1 text-emerald-600" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
