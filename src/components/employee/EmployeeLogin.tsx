import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface EmployeeLoginProps {
  onSuccess?: () => void;
  onSwitchToPublic?: () => void;
  onSwitchToAdmin?: () => void;
}

export const EmployeeLogin: React.FC<EmployeeLoginProps> = ({ onSuccess, onSwitchToPublic, onSwitchToAdmin }) => {
  const { employeeLogin, loading, error, clearError, isAdmin } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const isIdValid = /^[A-Z0-9][A-Z0-9-]{2,49}$/.test(employeeId.trim());
  const isPasswordValid = password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);
    setTouched({ id: true, pass: true });

    if (!isIdValid) {
      setLocalError(language === 'hi' ? 'कृपया अपना मान्य Employee ID दर्ज करें (उदा. HCJ-101)।' : 'Please enter a valid Employee ID (e.g. HCJ-101).');
      return;
    }
    if (!isPasswordValid) {
      setLocalError(language === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters.');
      return;
    }

    const res = await employeeLogin(employeeId, password);
    if (res.success) {
      if (onSuccess) onSuccess();
    } else {
      setLocalError(res.message || (language === 'hi' ? 'लॉगिन विफल। कृपया क्रेडेंशियल जांचें।' : 'Login failed. Please check credentials.'));
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-100">
      <div className="max-w-md w-full space-y-6">
        
        {/* Language switch bar */}
        <div className="flex justify-end">
          <div className="inline-flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'hi' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇮🇳 हिन्दी
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-900 to-indigo-700 text-white flex items-center justify-center mx-auto shadow-md">
              <User className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.auth.employeePortal}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t.auth.employeeSubtitle}
            </p>
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                {language === 'hi'
                  ? 'सुरक्षित एक्सेस: केवल वही कर्मचारी लॉगिन कर सकते हैं जिन्हें एडमिन ने आईडी और पासवर्ड दिया है।'
                  : 'Secured Access: Only employees with ID & Password provided by Admin can log in.'}
              </span>
            </div>
          </div>

          {/* Error Banner */}
          {(localError || error) && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{localError || error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t.auth.empIdLabel}
                </label>
                {touched.id && !isIdValid && (
                  <span className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                    {t.auth.empIdError}
                  </span>
                )}
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder={t.auth.empIdPlaceholder}
                  value={employeeId}
                  onBlur={() => setTouched((p) => ({ ...p, id: true }))}
                  onChange={(e) => {
                    setEmployeeId(e.target.value.toUpperCase());
                    setTouched((p) => ({ ...p, id: true }));
                    if (localError) setLocalError(null);
                  }}
                  className={`w-full pl-10 pr-14 py-2.5 rounded-xl border text-sm font-semibold uppercase transition-all ${
                    (touched.id && !isIdValid) || (localError && !isIdValid)
                      ? 'border-red-500 bg-red-50/50 text-red-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500'
                      : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900'
                  }`}
                />
                {touched.id && !isIdValid && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 pointer-events-none">
                    <span className="text-[10px] font-extrabold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                      {t.contact.galatBadge}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{t.auth.empIdAssigned}</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t.auth.passwordLabel}
                </label>
                {touched.pass && !isPasswordValid && (
                  <span className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                    {t.auth.passwordError}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onBlur={() => setTouched((p) => ({ ...p, pass: true }))}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setTouched((p) => ({ ...p, pass: true }));
                    if (localError) setLocalError(null);
                  }}
                  className={`w-full pl-10 pr-20 py-2.5 rounded-xl border text-sm transition-all ${
                    (touched.pass && !isPasswordValid) || (localError && !isPasswordValid)
                      ? 'border-red-500 bg-red-50/50 text-red-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500'
                      : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900'
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {touched.pass && !isPasswordValid && (
                    <span className="text-[10px] font-extrabold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                      {t.contact.galatBadge}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t.auth.signInBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Admin Fast-Track Access */}
          {isAdmin && (
            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onSwitchToAdmin}
                className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>{t.auth.adminAccessText}</span>
              </button>
            </div>
          )}

          {/* Switchers */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <button
              type="button"
              onClick={onSwitchToPublic}
              className="hover:text-blue-700 font-semibold"
            >
              {t.auth.backToJobs}
            </button>
            <button
              type="button"
              onClick={onSwitchToAdmin}
              className="hover:text-indigo-700 font-semibold flex items-center gap-1 text-indigo-700"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> {t.auth.adminPortal}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
