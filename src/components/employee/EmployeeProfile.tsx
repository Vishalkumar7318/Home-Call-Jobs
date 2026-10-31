import React from 'react';
import {
  User,
  Phone,
  Calendar,
  Briefcase,
  Shield,
  BadgeCheck,
} from 'lucide-react';
import type { Employee } from '../../types';

interface EmployeeProfileProps {
  employee: Employee;
}

export const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employee }) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      
      {/* Top Banner & Avatar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-900 to-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
            {employee.fullName.charAt(0)}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">{employee.fullName}</h2>
              <BadgeCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-mono">
              <span className="bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-700">ID: {employee.employeeId}</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">{employee.employmentStatus}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Verified Employee
          </span>
        </div>
      </div>

      {/* Grid of Profile Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Full Name */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
            <User className="w-4 h-4 text-blue-600" /> Full Legal Name
          </div>
          <div className="text-sm font-bold text-slate-900 mt-1.5">{employee.fullName}</div>
        </div>

        {/* Employee ID */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-blue-600" /> Employee ID
          </div>
          <div className="text-sm font-extrabold text-blue-900 mt-1.5 font-mono">{employee.employeeId}</div>
        </div>

        {/* Contact Number */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-blue-600" /> Mobile Number
          </div>
          <div className="text-sm font-bold text-slate-900 mt-1.5">{employee.mobileNumber}</div>
        </div>

        {/* Joining Date */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-600" /> Date of Joining
          </div>
          <div className="text-sm font-bold text-slate-900 mt-1.5 font-mono">{employee.joiningDate}</div>
        </div>

      </div>

    </div>
  );
};
