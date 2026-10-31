import React from 'react';
import { PhoneCall, ShieldCheck, Users, Headphones, CheckCircle2, Award, Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const AboutUs: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 mb-3">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            {t.about.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.about.title}
          </h2>
          <p className="text-slate-600 mt-3 text-base sm:text-lg leading-relaxed">
            {t.about.subtitle}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Story & Mission */}
          <div className="space-y-6 text-slate-700">
            <h3 className="text-2xl font-bold text-slate-900">
              {t.about.missionTitle}
            </h3>

            <p className="leading-relaxed text-sm sm:text-base">
              {t.about.missionPara1}
            </p>

            <p className="leading-relaxed text-sm sm:text-base">
              {t.about.missionPara2}
            </p>

            {/* Crucial required statement block */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    {t.about.termsTitle}
                  </h4>
                  <p className="text-sm font-semibold text-slate-800 mt-1 leading-relaxed">
                    &ldquo;{t.about.mandatoryStatement}&rdquo;
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    {t.about.termsNote}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-slate-800">{t.about.bullet1}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-slate-800">{t.about.bullet2}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-slate-800">{t.about.bullet3}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-slate-800">{t.about.bullet4}</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase Box */}
          <div className="bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-900 p-8 sm:p-10 rounded-3xl text-white shadow-xl space-y-8 relative overflow-hidden">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-2xl font-extrabold tracking-tight">{t.about.cardTitle}</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t.about.cardDesc}
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{t.about.service1Title}</div>
                  <div className="text-xs text-slate-400">{t.about.service1Desc}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{t.about.service2Title}</div>
                  <div className="text-xs text-slate-400">{t.about.service2Desc}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{t.about.service3Title}</div>
                  <div className="text-xs text-slate-400">{t.about.service3Desc}</div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
