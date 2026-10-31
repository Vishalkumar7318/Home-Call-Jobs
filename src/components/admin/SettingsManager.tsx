import React, { useState } from 'react';
import {
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Clock,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import type { SiteSettings } from '../../types';
import { updateSettings } from '../../services/db';

interface SettingsManagerProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({ settings, onRefresh }) => {
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateSettings(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onRefresh();
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError(err?.message || 'Failed to update system settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleTestWhatsApp = () => {
    const cleanNum = formData.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(formData.whatsappDefaultMessage + ' [Test Message]');
    window.open(`https://wa.me/${cleanNum}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-4xl space-y-6">
      
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Site Configuration & WhatsApp Integration
        </h3>
        <p className="text-xs text-slate-500">
          Configure the active WhatsApp contact number and default candidate application messages across the entire public job recruitment portal.
        </p>
      </div>

      {success && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Settings saved successfully! WhatsApp numbers and messages updated across all job listings.</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        
        {/* WhatsApp Section */}
        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <span>Configurable WhatsApp Application Number</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                WhatsApp Number (with country code, digits only) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 919876543210"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-bold font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Do not include +, spaces or dashes (e.g., 919876543210 for India)
              </p>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleTestWhatsApp}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>Test WhatsApp Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Predefined WhatsApp Message Prefix
            </label>
            <textarea
              rows={2}
              value={formData.whatsappDefaultMessage}
              onChange={(e) => setFormData({ ...formData, whatsappDefaultMessage: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              This text is automatically prefixed when a visitor clicks &quot;Apply on WhatsApp&quot; on any job card.
            </p>
          </div>
        </div>

        {/* Company Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Contact Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Support Phone Number *
            </label>
            <input
              type="text"
              required
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
            Registered Company Address *
          </label>
          <input
            type="text"
            required
            value={formData.companyAddress}
            onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Operating Office Hours (कार्य समय)
            </label>
            <input
              type="text"
              value={formData.workingHours}
              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Standard: 11:50 AM - 8:00 PM (All Days / No Holiday)
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Absent Penalty Rate (₹ प्रति दिन कटौती)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">₹</span>
              <input
                type="number"
                min="0"
                step="50"
                value={formData.absentPenaltyRate ?? 500}
                onChange={(e) => setFormData({ ...formData, absentPenaltyRate: Number(e.target.value) || 0 })}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold font-mono text-red-600"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              अगर कोई 1 दिन काम नहीं करता है तो ₹500 कम हो जाएगा (Deduction per absent day)
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-sm shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating...' : 'Save Configuration'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
