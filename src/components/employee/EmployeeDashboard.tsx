import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Percent,
  ListFilter,
  LayoutGrid,
  FileText,
  CalendarCheck2,
  ArrowLeft,
  Shield,
  AlertCircle,
  Check,
  Send,
  Timer,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getAttendanceByEmployee, markAttendance } from '../../services/db';
import type { AttendanceRecord } from '../../types';
import { EmployeeProfile } from './EmployeeProfile';

interface EmployeeDashboardProps {
  onBackToJobs?: () => void;
  onReturnToAdmin?: () => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ onBackToJobs, onReturnToAdmin }) => {
  const { currentEmployee, signOut, isAdminViewingAsEmployee, returnToAdmin, isAdmin } = useAuth();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'attendance' | 'profile'>('attendance');
  const [attendanceViewMode, setAttendanceViewMode] = useState<'table' | 'calendar'>('table');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Real-time clock for 11:50 AM to 12:30 PM window
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  // Test simulation override so user/admin can preview & test outside real clock time
  const [testWindowOverride, setTestWindowOverride] = useState<boolean>(false);

  // Self attendance check-in form states
  const [selectedStatus, setSelectedStatus] = useState<'Present' | 'Absent' | null>(null);
  const [absentReason, setAbsentReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Today's date string YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const currentMonthKey = useMemo(() => todayStr.slice(0, 7), [todayStr]);

  // Month selection (defaults to current month: e.g. 2026-10 or current date)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);

  // Ticking clock effect every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Calculate 11:50 AM to 12:30 PM time window
  const windowStatus = useMemo(() => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMins = hours * 60 + minutes;

    // 11:50 AM = 11 * 60 + 50 = 710 minutes from midnight
    // 12:30 PM = 12 * 60 + 30 = 750 minutes from midnight
    const startMins = 11 * 60 + 50;
    const endMins = 12 * 60 + 30;

    const isRealInWindow = totalMins >= startMins && totalMins <= endMins;
    const isOpen = isRealInWindow || testWindowOverride;
    const isBefore = totalMins < startMins;
    const isAfter = totalMins > endMins;

    const timeFormatted = currentTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    return {
      isOpen,
      isRealInWindow,
      isBefore,
      isAfter,
      timeFormatted,
      startMins,
      endMins,
    };
  }, [currentTime, testWindowOverride]);

  // Fetch attendance records for current employee
  const fetchRecords = useCallback(async () => {
    if (!currentEmployee) return;
    setLoading(true);
    try {
      const data = await getAttendanceByEmployee(currentEmployee.employeeId, selectedMonth);
      setRecords(data);
    } catch (err) {
      console.error('Error fetching employee attendance:', err);
    } finally {
      setLoading(false);
    }
  }, [currentEmployee, selectedMonth]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Check if today's attendance has already been recorded
  const todayRecord = useMemo(() => {
    return records.find((r) => r.date === todayStr);
  }, [records, todayStr]);

  // Statistics calculation
  const stats = useMemo(() => {
    const present = records.filter((r) => r.status === 'Present').length;
    const absent = records.filter((r) => r.status === 'Absent').length;
    const leave = records.filter((r) => r.status === 'Leave').length;
    const totalRecordedDays = records.length;
    // Working days count
    const totalWorkingDays = present + absent + leave;
    const percentage = totalWorkingDays > 0 ? ((present / totalWorkingDays) * 100).toFixed(1) : '0';

    return {
      present,
      absent,
      leave,
      totalWorkingDays,
      percentage: Number(percentage),
    };
  }, [records]);

  // Submit today's attendance
  const handleSubmitAttendance = async () => {
    if (!currentEmployee) return;
    if (!selectedStatus) {
      setSubmitError(language === 'hi' ? 'कृपया उपस्थित या अनुपस्थित का चयन करें।' : 'Please select Present or Absent.');
      return;
    }

    if (selectedStatus === 'Absent' && !absentReason.trim()) {
      setSubmitError(language === 'hi' ? 'कृपया अनुपस्थिति का कारण अवश्य दर्ज करें।' : 'Please enter the reason for absence.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formattedRemarks = selectedStatus === 'Absent'
        ? `अनुपस्थित कारण: ${absentReason.trim()}`
        : 'Self Check-in (Present / उपस्थित)';

      await markAttendance({
        employeeId: currentEmployee.employeeId,
        employeeName: currentEmployee.fullName,
        date: todayStr,
        status: selectedStatus,
        markedBy: 'Employee (Self Check-in)',
        remarks: formattedRemarks,
      });

      setSubmitSuccess(
        selectedStatus === 'Present'
          ? (language === 'hi' ? 'आपकी आज की उपस्थिति (Present) दर्ज हो गई है!' : 'Your attendance (Present) has been successfully recorded!')
          : (language === 'hi' ? 'आपकी अनुपस्थिति (Absent) दर्ज हो गई है। नियम अनुसार ₹500 वेतन कटौती लागू होगी।' : 'Your absence has been logged. Policy penalty of ₹500 will apply.')
      );

      setSelectedStatus(null);
      setAbsentReason('');
      await fetchRecords();
    } catch (err) {
      console.error('Error submitting self attendance:', err);
      setSubmitError(language === 'hi' ? 'हाजिरी दर्ज करने में त्रुटि हुई। कृपया पुनः प्रयास करें।' : 'Failed to record attendance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Months available for history view
  const availableMonths = useMemo(() => {
    const list = [
      { label: `${currentMonthKey} (Current)`, value: currentMonthKey },
      { label: 'October 2026', value: '2026-10' },
      { label: 'September 2026', value: '2026-09' },
      { label: 'August 2026', value: '2026-08' },
      { label: 'July 2026', value: '2026-07' },
      { label: 'June 2026', value: '2026-06' },
    ];
    const seen = new Set<string>();
    return list.filter((item) => {
      if (seen.has(item.value)) return false;
      seen.add(item.value);
      return true;
    });
  }, [currentMonthKey]);

  if (!currentEmployee) {
    return (
      <div className="py-20 text-center text-slate-600">
        <p>No active employee session. Please log in.</p>
      </div>
    );
  }

  // Format date helper: converts '2026-10-05' into '05-10-2026'
  const formatDateDisplay = (isoDate: string) => {
    if (!isoDate || isoDate.length !== 10) return isoDate;
    const [y, m, d] = isoDate.split('-');
    return `${d}-${m}-${y}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Admin Inspection Mode Banner */}
        {isAdminViewingAsEmployee && (
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-indigo-100 p-4 rounded-3xl border border-indigo-700/60 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-indigo-400">
                  Administrator Master Access Mode
                </div>
                <div className="text-sm font-bold text-white">
                  You are inspecting Employee Portal for: <span className="text-indigo-300 font-extrabold">{currentEmployee.fullName}</span> ({currentEmployee.employeeId})
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                returnToAdmin();
                if (onReturnToAdmin) onReturnToAdmin();
              }}
              className="px-4 py-2 rounded-xl bg-white hover:bg-indigo-50 text-indigo-950 font-bold text-xs shadow-md flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Admin Panel</span>
            </button>
          </div>
        )}
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-blue-900 to-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
              {currentEmployee.fullName.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                  Employee Dashboard
                </span>
                <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {currentEmployee.employeeId}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {currentEmployee.fullName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Mobile: <span className="text-slate-800 font-semibold">{currentEmployee.mobileNumber}</span> • Joined: <span className="text-slate-700 font-mono">{currentEmployee.joiningDate}</span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
              <button
                onClick={() => setActiveTab('attendance')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'attendance'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Attendance & Report
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Profile
              </button>
            </div>

            <button
              onClick={() => signOut()}
              className="p-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors flex items-center gap-1.5"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Attendance & Monthly Report */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">

            {/* REQUIREMENT 10: DAILY SELF-ATTENDANCE CHECK-IN CARD (11:50 AM to 12:30 PM Window) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-md">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm ${
                      todayRecord
                        ? todayRecord.status === 'Present'
                          ? 'bg-emerald-600'
                          : 'bg-red-600'
                        : windowStatus.isOpen
                        ? 'bg-blue-600 animate-pulse'
                        : 'bg-slate-700'
                    }`}
                  >
                    {todayRecord ? (
                      todayRecord.status === 'Present' ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <XCircle className="w-6 h-6" />
                      )
                    ) : (
                      <Timer className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                        {language === 'hi' ? 'दैनिक उपस्थिति चेक-इन' : 'Daily Self-Attendance Check-In'}
                      </span>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                        {formatDateDisplay(todayStr)}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                      {language === 'hi' ? 'आज की हाजिरी विंडो (11:50 AM से 12:30 PM)' : "Today's Attendance Window (11:50 AM to 12:30 PM)"}
                    </h2>
                  </div>
                </div>

                {/* Live Clock & Window Badge */}
                <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-mono text-xs font-bold border border-slate-200">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{windowStatus.timeFormatted}</span>
                  </div>

                  {todayRecord ? (
                    <span
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${
                        todayRecord.status === 'Present'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}
                    >
                      {todayRecord.status === 'Present' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      <span>
                        {todayRecord.status === 'Present'
                          ? (language === 'hi' ? 'उपस्थिति दर्ज है (Present)' : 'Present Recorded')
                          : (language === 'hi' ? 'अनुपस्थिति दर्ज है (Absent)' : 'Absent Recorded')}
                      </span>
                    </span>
                  ) : windowStatus.isOpen ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      <span>{language === 'hi' ? 'विंडो खुली है (11:50 - 12:30)' : 'Window Open (11:50 - 12:30)'}</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>{language === 'hi' ? 'विंडो बंद है' : 'Window Closed'}</span>
                    </span>
                  )}

                  {/* Test Mode Simulation Toggle (so user can test anytime) */}
                  <button
                    type="button"
                    onClick={() => {
                      setTestWindowOverride((prev) => !prev);
                      setSubmitError(null);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
                      testWindowOverride
                        ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
                    }`}
                    title="Toggle simulation of 11:50 AM - 12:30 PM window for testing"
                  >
                    {testWindowOverride ? '🧪 Test Window: ON' : '🧪 Test Window'}
                  </button>
                </div>
              </div>

              {/* Notification Alerts */}
              {submitSuccess && (
                <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">{submitSuccess}</p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      {language === 'hi' ? 'आपका रिकॉर्ड सुरक्षित रूप से सेव कर लिया गया है।' : 'Your attendance record has been safely saved.'}
                    </p>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">{submitError}</p>
                  </div>
                </div>
              )}

              {/* Body Content */}
              <div className="mt-5">
                {todayRecord ? (
                  /* State 1: Today's attendance already marked */
                  <div
                    className={`p-5 rounded-2xl border ${
                      todayRecord.status === 'Present'
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : 'bg-red-50/70 border-red-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                              todayRecord.status === 'Present'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-red-600 text-white shadow-xs'
                            }`}
                          >
                            {todayRecord.status === 'Present'
                              ? (language === 'hi' ? 'उपस्थित (Present)' : 'Present')
                              : (language === 'hi' ? 'अनुपस्थित (Absent) - ₹500' : 'Absent - ₹500')}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-600">
                            {formatDateDisplay(todayStr)}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-800">
                          {todayRecord.status === 'Present'
                            ? (language === 'hi' ? 'आज आपकी उपस्थिति सफलतापूर्वक दर्ज की जा चुकी है।' : 'Your attendance for today has been logged as Present.')
                            : (language === 'hi' ? 'आज आपकी अनुपस्थिति दर्ज है।' : 'Your attendance for today is logged as Absent.')}
                        </p>
                        {todayRecord.remarks && (
                          <div className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                            <span className="font-bold text-slate-800">{language === 'hi' ? 'कारण / विवरण:' : 'Reason / Note:'}</span> {todayRecord.remarks}
                          </div>
                        )}
                        {todayRecord.status === 'Absent' && (
                          <p className="text-xs font-bold text-red-700 flex items-center gap-1.5 pt-0.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                            <span>
                              {language === 'hi'
                                ? 'नियम अनुसार 1 दिन काम नहीं करने पर ₹500 वेतन में से काटा जाएगा।'
                                : 'Policy: ₹500 will be deducted from your payout for this absent day.'}
                            </span>
                          </p>
                        )}
                      </div>

                      <div className="text-left sm:text-right shrink-0 bg-white/70 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-200">
                        <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-wider">
                          {language === 'hi' ? 'दर्जकर्ता (Marked By)' : 'Marked By'}
                        </span>
                        <span className="text-xs font-bold text-slate-800 font-mono">
                          {todayRecord.markedBy || 'Employee (Self)'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : !windowStatus.isOpen ? (
                  /* State 2: Outside 11:50 AM - 12:30 PM window */
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-5">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span>{language === 'hi' ? 'हाजिरी का समय: केवल 11:50 AM से 12:30 PM' : 'Attendance Time: 11:50 AM to 12:30 PM Only'}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800">
                        {windowStatus.isBefore
                          ? (language === 'hi' ? 'आज की हाजिरी विंडो अभी बंद है (11:50 AM पर खुलेगी)' : 'Today\'s check-in window is currently closed (Opens at 11:50 AM)')
                          : (language === 'hi' ? 'आज की हाजिरी विंडो समाप्त हो चुकी है (12:30 PM पर बंद)' : 'Today\'s check-in window has closed at 12:30 PM')}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                        {windowStatus.isBefore
                          ? (language === 'hi'
                              ? 'हाजिरी लगाने का विकल्प केवल 11:50 AM से 12:30 PM तक ही खुला रहेगा। कृपया 11:50 AM पर लॉगिन करके अपनी हाजिरी लगाएं।'
                              : 'The check-in option is strictly available between 11:50 AM and 12:30 PM daily. Please check back at 11:50 AM.')
                          : (language === 'hi'
                              ? 'आज की हाजिरी का समय (11:50 AM से 12:30 PM) समाप्त हो चुका है। यदि आप आज कार्य पर उपस्थित थे तो कृपया एडमिन से संपर्क करें।'
                              : 'The 11:50 AM to 12:30 PM check-in window for today has closed. If you were on duty, please contact your Administrator.')}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setTestWindowOverride(true);
                        setSubmitError(null);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition-all shrink-0 active:scale-95"
                    >
                      {language === 'hi' ? 'परीक्षण के लिए विंडो खोलें (Test Window)' : 'Open Window for Testing'}
                    </button>
                  </div>
                ) : (
                  /* State 3: Inside 11:50 AM - 12:30 PM window (or test override active) */
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-950">
                          {language === 'hi' ? 'कृपया अपनी आज की हाजिरी चुनें:' : 'Please choose your attendance for today:'}
                        </p>
                        <p className="text-xs text-blue-700 mt-0.5">
                          {language === 'hi'
                            ? 'यह विकल्प केवल 11:50 AM से 12:30 PM तक ही खुला रहेगा।'
                            : 'This option is only active between 11:50 AM and 12:30 PM.'}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs inline-flex items-center gap-1.5 self-start sm:self-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                        {language === 'hi' ? 'विंडो सक्रिय (11:50 - 12:30)' : 'Window Active (11:50 - 12:30)'}
                      </span>
                    </div>

                    {/* Present & Absent Option Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Option 1: Present (उपस्थित) */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStatus('Present');
                          setSubmitError(null);
                        }}
                        className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                          selectedStatus === 'Present'
                            ? 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
                            : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-colors ${
                              selectedStatus === 'Present' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-base font-black text-slate-900">
                              {language === 'hi' ? 'उपस्थित (Present)' : 'Present'}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {language === 'hi' ? 'आज कार्य के लिए उपस्थित हूँ' : 'Reporting for work today'}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedStatus === 'Present'
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {selectedStatus === 'Present' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>

                      {/* Option 2: Absent (अनुपस्थित) */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStatus('Absent');
                          setSubmitError(null);
                        }}
                        className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                          selectedStatus === 'Absent'
                            ? 'bg-red-50 border-red-600 shadow-md ring-2 ring-red-500/30'
                            : 'bg-white border-slate-200 hover:border-red-300 hover:bg-red-50/30'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-colors ${
                              selectedStatus === 'Absent' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            <XCircle className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-black text-slate-900">
                                {language === 'hi' ? 'अनुपस्थित (Absent)' : 'Absent'}
                              </h4>
                              <span className="text-[11px] font-black px-1.5 py-0.5 rounded bg-red-100 text-red-800">
                                -₹500
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {language === 'hi' ? 'आज कार्य पर नहीं आ सकता/सकती' : 'Unable to work today'}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedStatus === 'Absent'
                              ? 'border-red-600 bg-red-600 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {selectedStatus === 'Absent' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>

                    </div>

                    {/* Dynamic Reason Box: Opens directly beneath when Absent is selected */}
                    {selectedStatus === 'Absent' && (
                      <div className="p-5 rounded-2xl bg-red-50/80 border-2 border-red-300 space-y-3 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <label className="text-xs sm:text-sm font-black text-red-950 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span>{language === 'hi' ? 'अनुपस्थिति का कारण लिखें (Reason for Absence) *' : 'Enter Reason for Absence *'}</span>
                          </label>
                          <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                            {language === 'hi' ? 'कारण अनिवार्य है' : 'Reason Required'}
                          </span>
                        </div>

                        <textarea
                          rows={3}
                          value={absentReason}
                          onChange={(e) => {
                            setAbsentReason(e.target.value);
                            if (submitError) setSubmitError(null);
                          }}
                          placeholder={
                            language === 'hi'
                              ? 'कृपया यहाँ अनुपस्थिति का वास्तविक कारण लिखें (उदा. तबियत खराब है, आवश्यक पारिवारिक कार्य, इमरजेंसी)...'
                              : 'Please state the reason for absence (e.g. fever/sick, personal emergency, urgent travel)...'
                          }
                          className="w-full p-3.5 rounded-xl border border-red-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />

                        {/* Absent Penalty Policy Warning */}
                        <div className="p-3.5 rounded-xl bg-red-100/90 border border-red-300 text-red-950 text-xs font-bold flex items-center gap-2.5">
                          <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                          <span>
                            {language === 'hi'
                              ? 'नियम: अगर कोई 1 दिन काम नहीं करता है तो उसका ₹500 कम हो जाएगा (वेतन में से ₹500 की कटौती की जाएगी)।'
                              : 'Policy: If someone does not work for 1 day, ₹500 will be deducted from payout.'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Submit Attendance Button */}
                    {selectedStatus && (
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs text-slate-600">
                          {selectedStatus === 'Present'
                            ? (language === 'hi' ? '✓ आप उपस्थित (Present) के रूप में अपनी हाजिरी सबमिट करने जा रहे हैं।' : '✓ You are submitting your attendance as Present.')
                            : (language === 'hi' ? '⚠️ आप अनुपस्थित (Absent) दर्ज करने जा रहे हैं। वेतन में से ₹500 कटौती लागू होगी।' : '⚠️ You are submitting as Absent. ₹500 penalty will apply.')}
                        </p>

                        <button
                          type="button"
                          disabled={isSubmitting || (selectedStatus === 'Absent' && !absentReason.trim())}
                          onClick={handleSubmitAttendance}
                          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-black text-sm text-white shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
                            selectedStatus === 'Present'
                              ? 'bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50'
                              : 'bg-red-600 hover:bg-red-700 disabled:opacity-50'
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>{language === 'hi' ? 'सबमिट हो रहा है...' : 'Submitting...'}</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>
                                {selectedStatus === 'Present'
                                  ? (language === 'hi' ? 'उपस्थिति दर्ज करें (Submit Present)' : 'Submit Present')
                                  : (language === 'hi' ? 'अनुपस्थिति दर्ज करें (Submit Absent)' : 'Submit Absent')}
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                  </div>
                )}
              </div>
            </div>

            {/* Month Selector & Controls */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <CalendarIcon className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-xs font-bold uppercase text-slate-500">Attendance Month:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {availableMonths.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Format:</span>
                <button
                  onClick={() => setAttendanceViewMode('table')}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    attendanceViewMode === 'table'
                      ? 'bg-blue-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <ListFilter className="w-4 h-4" />
                  <span>Table View</span>
                </button>
                <button
                  onClick={() => setAttendanceViewMode('calendar')}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    attendanceViewMode === 'calendar'
                      ? 'bg-blue-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Calendar Grid</span>
                </button>
              </div>
            </div>

            {/* Working Hours & Absent Penalty Policy Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white border border-blue-800 shadow-md">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-bold uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.policy.workingHoursTitle}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>{language === 'hi' ? 'समय: 11:50 AM से 8:00 PM (प्रतिदिन - कोई अवकाश नहीं)' : 'Timings: 11:50 AM to 8:00 PM (All Days / No Holiday)'}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-300 font-semibold flex items-center gap-1.5 pt-0.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{language === 'hi' ? 'नियम: अगर कोई 1 दिन काम नहीं करता है तो उसका ₹500 कम हो जाएगा (वेतन कटौती)।' : 'Policy: If someone does not work for 1 day, ₹500 will be deducted from payout.'}</span>
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-white/10 shrink-0 text-center sm:text-right">
                  <div className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">{t.policy.absentDeductionStat}</div>
                  <div className="text-lg font-black text-rose-300 font-mono">- ₹{stats.absent * 500}</div>
                  <div className="text-[10px] text-slate-400">₹500 / {language === 'hi' ? 'दिन' : 'day'}</div>
                </div>
              </div>
            </div>

            {/* Attendance Stat Cards (Requirement 5 & 7) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              
              {/* Total Working Days */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
                  <span>{language === 'hi' ? 'कुल कार्य दिवस' : 'Total Days'}</span>
                  <CalendarCheck2 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  {stats.totalWorkingDays}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{language === 'hi' ? 'माह के कुल दिन' : 'Logged shifts'}</div>
              </div>

              {/* Present Days */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100 shadow-xs">
                <div className="flex items-center justify-between text-emerald-700 text-xs font-bold uppercase">
                  <span>{language === 'hi' ? 'उपस्थित' : 'Present'}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
                  {stats.present}
                </div>
                <div className="text-[11px] text-emerald-700/70 mt-1">{language === 'hi' ? 'पूर्ण शिफ्ट दर्ज' : 'Full shifts'}</div>
              </div>

              {/* Absent Days */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-red-100 shadow-xs">
                <div className="flex items-center justify-between text-red-700 text-xs font-bold uppercase">
                  <span>{language === 'hi' ? 'अनुपस्थित' : 'Absent'}</span>
                  <XCircle className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-red-600 mt-2">
                  {stats.absent}
                </div>
                <div className="text-[11px] text-red-700/70 mt-1">{language === 'hi' ? 'बिना सूचना अनुपस्थित' : 'Uninformed off'}</div>
              </div>

              {/* Leave Days */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-100 shadow-xs">
                <div className="flex items-center justify-between text-amber-700 text-xs font-bold uppercase">
                  <span>{language === 'hi' ? 'स्वीकृत छुट्टी' : 'Leave'}</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">
                  {stats.leave}
                </div>
                <div className="text-[11px] text-amber-700/70 mt-1">{language === 'hi' ? 'स्वीकृत अवकाश' : 'Approved leave'}</div>
              </div>

              {/* Monthly Attendance Percentage */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blue-100 shadow-xs">
                <div className="flex items-center justify-between text-blue-700 text-xs font-bold uppercase">
                  <span>{language === 'hi' ? 'उपस्थिति दर' : 'Rate'}</span>
                  <Percent className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-blue-900 mt-2">
                  {stats.percentage}%
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, stats.percentage)}%` }}
                  />
                </div>
              </div>

              {/* Absent Salary Deduction (₹500 per absent day) */}
              <div className="bg-gradient-to-tr from-rose-950 to-red-900 p-4 sm:p-5 rounded-2xl text-white shadow-md">
                <div className="flex items-center justify-between text-rose-200 text-xs font-bold uppercase">
                  <span>{t.policy.absentDeductionStat}</span>
                  <AlertCircle className="w-4 h-4 text-rose-300" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-rose-300 mt-2 font-mono">
                  - ₹{stats.absent * 500}
                </div>
                <div className="text-[11px] text-rose-200/80 mt-1">
                  ₹500 × {stats.absent} {language === 'hi' ? 'दिन कटौती' : 'absent days'}
                </div>
              </div>

            </div>

            {/* Attendance History View */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Date-Wise Attendance History
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Records verified by authorized Administrator. Read-only individual staff access.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {language === 'hi' ? 'उपस्थित' : 'Present'}: {stats.present}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                    {language === 'hi' ? 'अनुपस्थित' : 'Absent'}: {stats.absent} (-₹{stats.absent * 500})
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    {language === 'hi' ? 'छुट्टी' : 'Leave'}: {stats.leave}
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center text-slate-400">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs">Loading attendance records...</p>
                </div>
              ) : records.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold">No attendance entries recorded for {selectedMonth}.</p>
                  <p className="text-xs text-slate-400 mt-1">Admin marks daily attendance for active shifts.</p>
                </div>
              ) : attendanceViewMode === 'table' ? (
                /* Table Format (Conforming to requested example: Date | Attendance) */
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-700">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-600 tracking-wider">
                      <tr>
                        <th className="py-3.5 px-6">Date</th>
                        <th className="py-3.5 px-6">Attendance</th>
                        <th className="py-3.5 px-6">Marked By</th>
                        <th className="py-3.5 px-6">Remarks / Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {records.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-6 font-mono font-bold text-slate-900">
                            {formatDateDisplay(r.date)}
                          </td>
                          <td className="py-3 px-6">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                r.status === 'Present'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : r.status === 'Absent'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {r.status === 'Present' && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {r.status === 'Absent' && <XCircle className="w-3.5 h-3.5 text-red-600" />}
                              {r.status === 'Leave' && <Clock className="w-3.5 h-3.5" />}
                              <span>
                                {r.status === 'Absent'
                                  ? `${language === 'hi' ? 'अनुपस्थित' : 'Absent'} (-₹500)`
                                  : r.status === 'Present'
                                  ? (language === 'hi' ? 'उपस्थित' : 'Present')
                                  : (language === 'hi' ? 'स्वीकृत छुट्टी' : 'Leave')}
                              </span>
                            </span>
                          </td>
                          <td className="py-3 px-6 text-xs text-slate-500">
                            {r.markedBy || 'Administrator'}
                          </td>
                          <td className="py-3 px-6 text-xs text-slate-600">
                            {r.remarks || 'Standard shift'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Calendar Grid Format */
                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                    {records.map((r) => {
                      const dayNumber = r.date.split('-')[2];
                      return (
                        <div
                          key={r.id}
                          className={`p-3 rounded-2xl border text-center transition-all ${
                            r.status === 'Present'
                              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                              : r.status === 'Absent'
                              ? 'bg-red-50/80 border-red-200 text-red-950'
                              : 'bg-amber-50/80 border-amber-200 text-amber-950'
                          }`}
                        >
                          <div className="text-xs font-bold text-slate-500">Day {dayNumber}</div>
                          <div className="text-xs font-mono font-semibold text-slate-700 mt-0.5">
                            {formatDateDisplay(r.date)}
                          </div>
                          <div className="mt-2">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-black uppercase ${
                                r.status === 'Present'
                                  ? 'bg-emerald-600 text-white'
                                  : r.status === 'Absent'
                                  ? 'bg-red-600 text-white shadow-xs'
                                  : 'bg-amber-500 text-white'
                              }`}
                            >
                              {r.status === 'Absent' ? `${r.status} (-₹500)` : r.status}
                            </span>
                          </div>
                          {r.remarks && (
                            <div className="text-[10px] text-slate-500 truncate mt-1" title={r.remarks}>
                              {r.remarks}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* Tab 2: Profile */}
        {activeTab === 'profile' && (
          <EmployeeProfile employee={currentEmployee} />
        )}

      </div>
    </div>
  );
};
