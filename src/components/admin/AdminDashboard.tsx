import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Settings,
  LogOut,
  UserPlus,
  TrendingUp,
  LayoutDashboard,
  CalendarCheck,
  PhoneCall,
  CalendarCheck2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getEmployees, getAllAttendance, getSettings } from '../../services/db';
import type { Employee, AttendanceRecord, SiteSettings } from '../../types';
import { EmployeeManager } from './EmployeeManager';
import { AttendanceManager } from './AttendanceManager';
import { SettingsManager } from './SettingsManager';

interface AdminDashboardProps {
  onBackToJobs?: () => void;
  onViewEmployeePortal?: (emp: Employee) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToJobs, onViewEmployeePortal }) => {
  const { signOut, currentUser, adminViewAsEmployee } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'attendance' | 'settings'>('overview');

  const handleViewEmployee = (emp: Employee) => {
    adminViewAsEmployee(emp);
    if (onViewEmployeePortal) {
      onViewEmployeePortal(emp);
    }
  };

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Today in YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [empList, attList, setts] = await Promise.all([
        getEmployees(),
        getAllAttendance(todayStr),
        getSettings(),
      ]);
      setEmployees(empList);
      setAttendance(attList);
      setSettings(setts);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Calculate Statistics
  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((e) => e.employmentStatus === 'Active').length;

    // Today's attendance counts
    const todayRecords = attendance.filter((a) => a.date === todayStr);
    const presentToday = todayRecords.filter((a) => a.status === 'Present').length;
    const absentToday = todayRecords.filter((a) => a.status === 'Absent').length;
    const leaveToday = todayRecords.filter((a) => a.status === 'Leave').length;

    const totalMarked = presentToday + absentToday + leaveToday;
    const attendanceRate = totalMarked > 0 ? ((presentToday / totalMarked) * 100).toFixed(0) : '0';

    return {
      totalEmployees,
      activeEmployees,
      presentToday,
      absentToday,
      leaveToday,
      attendanceRate,
    };
  }, [employees, attendance, todayStr]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Admin Top Header */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white">HOME CALL JOBS</span>
                <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-900/80 text-indigo-300 border border-indigo-700/60">
                  Control Center
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 hidden sm:inline">
                Sole Admin: <strong className="text-slate-200">{currentUser?.email || 'vishal731808@gmail.com'}</strong>
              </span>

              <button
                onClick={() => signOut()}
                className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-900 text-xs text-red-400 hover:text-red-300 font-bold transition-colors flex items-center gap-1.5"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="bg-slate-900 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 text-xs font-bold scrollbar-none">
              
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'overview'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview & Stats</span>
              </button>

              <button
                onClick={() => setActiveTab('employees')}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'employees'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Employee Management ({employees.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('attendance')}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'attendance'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Attendance & Reports</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'settings'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>WhatsApp & Settings</span>
              </button>

            </nav>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Tab 1: Overview & KPI Stats */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Header info */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Executive Control Overview
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Real-time operational metrics for today ({todayStr}) across staff attendance and team operations.
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              
              {/* 1. Total Employees */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
                  <span>Total Staff</span>
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  {stats.totalEmployees}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Enrolled accounts</div>
              </div>

              {/* 2. Active Employees */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-emerald-700 text-xs font-bold uppercase">
                  <span>Active Staff</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">
                  {stats.activeEmployees}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Active employment</div>
              </div>

              {/* 3. Present Today */}
              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
                <div className="flex items-center justify-between text-emerald-700 text-xs font-bold uppercase">
                  <span>Present Today</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
                  {stats.presentToday}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">On active shift</div>
              </div>

              {/* 4. Absent Today */}
              <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-xs">
                <div className="flex items-center justify-between text-red-700 text-xs font-bold uppercase">
                  <span>Absent Today</span>
                  <XCircle className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-red-600 mt-2">
                  {stats.absentToday}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Unmarked / off</div>
              </div>

              {/* 5. Employees on Leave */}
              <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs">
                <div className="flex items-center justify-between text-amber-700 text-xs font-bold uppercase">
                  <span>On Leave</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">
                  {stats.leaveToday}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Approved leaves</div>
              </div>

            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div
                onClick={() => setActiveTab('attendance')}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700">
                  Mark Today&apos;s Attendance
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Log Present, Absent, or Leave for staff and export attendance reports in Excel format.
                </p>
                <div className="mt-4 text-xs font-bold text-blue-700 flex items-center gap-1">
                  Launch Attendance Sheet &rarr;
                </div>
              </div>

              <div
                onClick={() => setActiveTab('employees')}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-indigo-400 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700">
                  Manage Employee Records
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Assign Employee IDs, manage employee profiles, update departments, and access any employee portal.
                </p>
                <div className="mt-4 text-xs font-bold text-indigo-700 flex items-center gap-1">
                  Manage Employees &rarr;
                </div>
              </div>

            </div>

            {/* Live WhatsApp Number Banner */}
            {settings && (
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-6 rounded-3xl text-white border border-emerald-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">Active WhatsApp Contact Number</div>
                    <div className="text-lg font-mono font-bold text-white">+{settings.whatsappNumber}</div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Configure WhatsApp & Site
                </button>
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Employees */}
        {activeTab === 'employees' && (
          <EmployeeManager
            employees={employees}
            onRefresh={loadAllData}
            onViewEmployeePortal={handleViewEmployee}
          />
        )}

        {/* Tab 3: Attendance */}
        {activeTab === 'attendance' && (
          <AttendanceManager employees={employees} />
        )}

        {/* Tab 4: Settings */}
        {activeTab === 'settings' && settings && (
          <SettingsManager settings={settings} onRefresh={loadAllData} />
        )}

      </main>

    </div>
  );
};
