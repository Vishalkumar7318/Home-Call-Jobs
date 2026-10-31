import React, { useState } from 'react';
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAuth, SUPER_ADMIN_EMAIL } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface AdminLoginProps {
  onSuccess?: () => void;
  onSwitchToPublic?: () => void;
  onSwitchToEmployee?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onSwitchToPublic, onSwitchToEmployee }) => {
  const { adminSignInWithGoogle, adminSignInWithCredentials, loading, error, clearError } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!username.trim() || !password.trim()) {
      setLocalError(language === 'hi' ? 'कृपया एडमिन यूजरनेम और पासवर्ड दोनों दर्ज करें।' : 'Please enter both Admin username and password.');
      return;
    }

    const success = await adminSignInWithCredentials(username, password);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  const handleGoogleSubmit = async () => {
    clearError();
    try {
      await adminSignInWithGoogle();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setLocalError(err?.message || 'Google authentication failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="max-w-md w-full space-y-6">
        
        {/* Language switch bar */}
        <div className="flex justify-end">
          <div className="inline-flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 shadow-2xs">
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'hi' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🇮🇳 हिन्दी
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-950 rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-6 text-white">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {t.auth.adminLoginTitle}
            </h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950 border border-indigo-700/60 text-indigo-300">
              <span>{language === 'hi' ? 'केवल अधिकृत एडमिन:' : 'Restricted Sole Admin:'}</span>
              <span className="font-mono text-white">{SUPER_ADMIN_EMAIL}</span>
            </div>
            <p className="text-xs text-amber-300/90 font-medium pt-1">
              {language === 'hi'
                ? '⚠️ यह पोर्टल केवल अधिकृत व्यवस्थापक (Admin) के लिए है। केवल एडमिन ही इसे खोल सकते हैं।'
                : '⚠️ Restricted Access: Only the authorized Administrator can open this portal.'}
            </p>
          </div>

          {/* Error Banner */}
          {(localError || error) && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{localError || error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Admin Email / Username
                </label>
                {(localError || error) && !username.trim() && (
                  <span className="text-[10px] font-bold text-red-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    गलत Email / Username
                  </span>
                )}
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder=""
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (localError) setLocalError(null);
                  }}
                  className={`w-full pl-10 pr-12 py-2.5 rounded-xl border text-sm text-white transition-all ${
                    (localError || error) && (!username.trim() || username.length < 3)
                      ? 'border-red-500 bg-red-950/40 focus:ring-red-400 focus:border-red-500'
                      : 'border-slate-700 bg-slate-900 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
                {(localError || error) && (!username.trim() || username.length < 3) && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 pointer-events-none">
                    <span className="text-[10px] font-extrabold bg-red-950 text-red-400 border border-red-800 px-1.5 py-0.5 rounded">Galat</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Admin Password
                </label>
                {(localError || error) && !password.trim() && (
                  <span className="text-[10px] font-bold text-red-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    गलत Password
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (localError) setLocalError(null);
                  }}
                  className={`w-full pl-10 pr-12 py-2.5 rounded-xl border text-sm text-white font-mono transition-all ${
                    (localError || error) && !password.trim()
                      ? 'border-red-500 bg-red-950/40 focus:ring-red-400 focus:border-red-500'
                      : 'border-slate-700 bg-slate-900 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
                {(localError || error) && !password.trim() && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 pointer-events-none">
                    <span className="text-[10px] font-extrabold bg-red-950 text-red-400 border border-red-800 px-1.5 py-0.5 rounded">Galat</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Login as Admin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full"></div>
            <span className="bg-slate-950 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Or Sign In With Google
            </span>
            <div className="border-t border-slate-800 w-full"></div>
          </div>

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSubmit}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign In as {SUPER_ADMIN_EMAIL}</span>
          </button>

          {/* Switchers */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <button
              type="button"
              onClick={onSwitchToPublic}
              className="hover:text-white"
            >
              &larr; Public Job Portal
            </button>
            <button
              type="button"
              onClick={onSwitchToEmployee}
              className="hover:text-white text-blue-400"
            >
              Employee Login &rarr;
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
