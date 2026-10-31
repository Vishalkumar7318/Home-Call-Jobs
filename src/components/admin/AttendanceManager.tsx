import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Printer,
  Search,
  Filter,
  AlertCircle,
  Edit2,
  Check,
  RefreshCw,
} from 'lucide-react';
import type { Employee, AttendanceRecord, AttendanceStatus } from '../../types';
import { markAttendance, updateAttendance, getAllAttendance, getAttendanceDocId } from '../../services/db';
import { exportAttendanceToCSV, printAttendanceReport } from '../../utils/export';

interface AttendanceManagerProps {
  employees: Employee[];
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({ employees }) => {
  // Selected date for date-wise operations (default today in YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-10');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchEmployee, setSearchEmployee] = useState<string>('');
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [editStatus, setEditStatus] = useState<AttendanceStatus>('Present');
  const [editRemarks, setEditRemarks] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const data = await getAllAttendance(selectedMonth);
      setAttendanceRecords(data);
    } catch (err) {
      console.error('Error loading attendance records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth]);

  // Map of existing attendance for selectedDate: employeeId -> record
  const dateRecordsMap = React.useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    attendanceRecords.forEach((r) => {
      if (r.date === selectedDate) {
        map.set(r.employeeId.toUpperCase(), r);
      }
    });
    return map;
  }, [attendanceRecords, selectedDate]);

  // Aggregate monthly statistics
  const monthStats = React.useMemo(() => {
    const present = attendanceRecords.filter((r) => r.status === 'Present').length;
    const absent = attendanceRecords.filter((r) => r.status === 'Absent').length;
    const leave = attendanceRecords.filter((r) => r.status === 'Leave').length;
    const totalDeductions = absent * 500;
    return { present, absent, leave, totalDeductions, total: attendanceRecords.length };
  }, [attendanceRecords]);

  // Per-employee monthly attendance and penalty map
  const employeeStatsMap = React.useMemo(() => {
    const map = new Map<string, { present: number; absent: number; leave: number; totalDeduction: number }>();
    attendanceRecords.forEach((r) => {
      const key = r.employeeId.toUpperCase();
      const current = map.get(key) || { present: 0, absent: 0, leave: 0, totalDeduction: 0 };
      if (r.status === 'Present') current.present += 1;
      else if (r.status === 'Absent') {
        current.absent += 1;
        current.totalDeduction += 500;
      } else if (r.status === 'Leave') current.leave += 1;
      map.set(key, current);
    });
    return map;
  }, [attendanceRecords]);

  // Quick mark attendance handler
  const handleMark = async (emp: Employee, status: AttendanceStatus, remarks = '') => {
    try {
      await markAttendance({
        employeeId: emp.employeeId,
        employeeName: emp.fullName,
        date: selectedDate,
        status,
        markedBy: 'Admin',
        remarks: remarks || `Marked ${status} by Administrator`,
      });
      setActionSuccess(`Marked ${emp.fullName} as ${status} on ${selectedDate}`);
      setTimeout(() => setActionSuccess(null), 3000);
      fetchAttendance();
    } catch (err) {
      console.error('Failed to mark attendance:', err);
      alert('Failed to save attendance record.');
    }
  };

  // Mark all active employees as Present
  const handleMarkAllActivePresent = async () => {
    if (!confirm(`Mark all active employees as Present for date ${selectedDate}?`)) return;
    setLoading(true);
    try {
      const activeEmps = employees.filter((e) => e.employmentStatus === 'Active');
      for (const emp of activeEmps) {
        await markAttendance({
          employeeId: emp.employeeId,
          employeeName: emp.fullName,
          date: selectedDate,
          status: 'Present',
          markedBy: 'Admin',
          remarks: 'Bulk marked Present',
        });
      }
      setActionSuccess(`All active staff marked Present for ${selectedDate}`);
      setTimeout(() => setActionSuccess(null), 3000);
      fetchAttendance();
    } catch (err) {
      console.error('Bulk mark error:', err);
      alert('Failed to bulk mark attendance.');
    } finally {
      setLoading(false);
    }
  };

  // Save edit record modal
  const handleSaveEdit = async () => {
    if (!editingRecord) return;
    try {
      await updateAttendance(editingRecord.id, {
        status: editStatus,
        remarks: editRemarks,
        markedBy: 'Admin (Edited)',
      });
      setEditingRecord(null);
      fetchAttendance();
      setActionSuccess('Attendance record updated successfully.');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error('Error editing attendance:', err);
      alert('Failed to update record.');
    }
  };

  // Export handlers
  const handleExportCSV = () => {
    exportAttendanceToCSV(attendanceRecords, `Attendance_Month_${selectedMonth}`);
  };

  const handlePrintReport = () => {
    printAttendanceReport(
      attendanceRecords,
      `Monthly Attendance Report (${selectedMonth})`,
      `Includes all staff attendance verified by Home Call Jobs Admin.`
    );
  };

  // Active employees filtered
  const filteredEmployees = employees.filter((e) => {
    if (!searchEmployee.trim()) return true;
    const q = searchEmployee.toLowerCase();
    return (
      e.fullName.toLowerCase().includes(q) ||
      e.employeeId.toLowerCase().includes(q) ||
      (e.mobileNumber && e.mobileNumber.toLowerCase().includes(q)) ||
      (e.department && e.department.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Success alert banner */}
      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Top Controls Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Date Selector & Month Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs font-bold text-slate-600 uppercase">Target Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Filter className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs font-bold text-slate-600 uppercase">Month Filter:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none"
            >
              <option value="2026-10">October 2026</option>
              <option value="2026-09">September 2026</option>
              <option value="2026-08">August 2026</option>
              <option value="2026-07">July 2026</option>
            </select>
          </div>
        </div>

        {/* Export and Bulk Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleMarkAllActivePresent}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
            title="Mark all active staff Present for selected date"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark All Present</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
            title="Download CSV for Microsoft Excel"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Excel / CSV</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
            title="Print Attendance Report"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>

          <button
            onClick={fetchAttendance}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh Attendance Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Office Timings & Absent Penalty Rule Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-5 text-white border border-blue-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Shift Timings & Official Penalty Policy</span>
          </div>
          <h4 className="text-sm sm:text-base font-bold text-white">
            कार्य समय (Timings): <span className="text-blue-300 font-extrabold">11:50 AM to 8:00 PM (All Days / No Holiday)</span>
          </h4>
          <p className="text-xs text-amber-300 font-semibold flex items-center gap-1.5 pt-0.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>नियम: अगर कोई 1 दिन काम नहीं करता है तो उसका ₹500 कम हो जाएगा (Absent Penalty: ₹500/day deduction)</span>
          </p>
        </div>

        <div className="bg-rose-950/80 border border-rose-800 px-4 py-2.5 rounded-2xl shrink-0 text-center sm:text-right">
          <div className="text-[11px] uppercase tracking-wider text-rose-300 font-semibold">Total Month Penalty</div>
          <div className="text-xl font-black text-rose-300 font-mono">- ₹{monthStats.totalDeductions}</div>
          <div className="text-[10px] text-rose-400">{monthStats.absent} absences logged</div>
        </div>
      </div>

      {/* Monthly Aggregate Statistics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-500">Total Shifts Logged</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{monthStats.total}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">In {selectedMonth}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
          <div className="text-xs font-bold uppercase text-emerald-700">Present Shifts</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{monthStats.present}</div>
          <div className="text-[11px] text-emerald-600/70 mt-0.5">Staff on floor</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-red-100 shadow-xs">
          <div className="text-xs font-bold uppercase text-red-700">Absent Shifts</div>
          <div className="text-2xl font-black text-red-600 mt-1">{monthStats.absent}</div>
          <div className="text-[11px] text-red-600/70 mt-0.5">Unexcused off days</div>
        </div>

        <div className="bg-gradient-to-tr from-rose-950 to-red-900 p-4 rounded-2xl text-white shadow-md">
          <div className="text-xs font-bold uppercase text-rose-200">Total Absent Deductions</div>
          <div className="text-2xl font-black text-rose-300 font-mono mt-1">- ₹{monthStats.totalDeductions}</div>
          <div className="text-[11px] text-rose-200/80 mt-0.5">₹500 / absent shift</div>
        </div>
      </div>

      {/* Date-wise Attendance Marking Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Mark Date-Wise Attendance for <span className="font-mono text-blue-800 bg-blue-50 px-2 py-0.5 rounded">{selectedDate}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click buttons to instantly mark status. Duplicate prevention enforces single record per employee per day.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search employee..."
              value={searchEmployee}
              onChange={(e) => setSearchEmployee(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-600 tracking-wider">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Mobile Number</th>
                <th className="py-3 px-4">Month Absences & Penalty</th>
                <th className="py-3 px-4">Status for {selectedDate}</th>
                <th className="py-3 px-4">Quick Mark Actions</th>
                <th className="py-3 px-4 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredEmployees.map((emp) => {
                const currentRecord = dateRecordsMap.get(emp.employeeId.toUpperCase());
                const isPresent = currentRecord?.status === 'Present';
                const isAbsent = currentRecord?.status === 'Absent';
                const isLeave = currentRecord?.status === 'Leave';
                const empMonthly = employeeStatsMap.get(emp.employeeId.toUpperCase()) || { present: 0, absent: 0, leave: 0, totalDeduction: 0 };

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Employee info */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{emp.fullName}</div>
                      <div className="text-[11px] font-mono text-blue-700 font-semibold">{emp.employeeId}</div>
                    </td>

                    {/* Mobile Number */}
                    <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                      {emp.mobileNumber}
                    </td>

                    {/* Month Absences & Penalty */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${empMonthly.absent > 0 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'}`}>
                          {empMonthly.absent} {empMonthly.absent === 1 ? 'day' : 'days'}
                        </span>
                        {empMonthly.absent > 0 ? (
                          <span className="text-xs font-bold text-red-600 font-mono">
                            -₹{empMonthly.totalDeduction}
                          </span>
                        ) : (
                          <span className="text-xs text-emerald-600 font-semibold">₹0</span>
                        )}
                      </div>
                    </td>

                    {/* Current status */}
                    <td className="py-3 px-4">
                      {currentRecord ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isPresent
                              ? 'bg-emerald-100 text-emerald-800'
                              : isAbsent
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isPresent && <CheckCircle2 className="w-3 h-3" />}
                          {isAbsent && <XCircle className="w-3 h-3" />}
                          {isLeave && <Clock className="w-3 h-3" />}
                          {isAbsent ? 'Absent (-₹500)' : currentRecord.status}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic font-normal">
                          Not marked yet
                        </span>
                      )}
                    </td>

                    {/* Quick Mark Buttons (Requirement 8) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleMark(emp, 'Present')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            isPresent
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          Present
                        </button>

                        <button
                          onClick={() => handleMark(emp, 'Absent')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            isAbsent
                              ? 'bg-red-700 text-white shadow-xs'
                              : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                          }`}
                        >
                          Absent (-₹500)
                        </button>

                        <button
                          onClick={() => handleMark(emp, 'Leave')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            isLeave
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                          }`}
                        >
                          Leave
                        </button>
                      </div>
                    </td>

                    {/* Edit button */}
                    <td className="py-3 px-4 text-right">
                      {currentRecord && (
                        <button
                          onClick={() => {
                            setEditingRecord(currentRecord);
                            setEditStatus(currentRecord.status);
                            setEditRemarks(currentRecord.remarks || '');
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Attendance Note"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Record Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Edit Attendance: {editingRecord.employeeName} ({editingRecord.employeeId})
            </h3>
            <p className="text-xs text-slate-500">Date: {editingRecord.date}</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Change Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Present', 'Absent', 'Leave'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setEditStatus(s)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                        editStatus === s
                          ? s === 'Present'
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : s === 'Absent'
                            ? 'bg-red-600 border-red-600 text-white'
                            : 'bg-amber-500 border-amber-500 text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Remarks / Justification
                </label>
                <input
                  type="text"
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  placeholder="e.g. Approved half-day or medical emergency"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingRecord(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-900 text-white hover:bg-blue-800 shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
