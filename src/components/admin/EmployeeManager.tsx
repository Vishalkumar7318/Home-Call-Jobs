import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  Edit2,
  Trash2,
  User,
  X,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import type { Employee } from '../../types';
import { addEmployee, updateEmployee, deleteEmployee } from '../../services/db';
import { formatFriendlyError } from '../../firebase/errors';

interface EmployeeManagerProps {
  employees: Employee[];
  onRefresh: () => void;
  onViewEmployeePortal?: (emp: Employee) => void;
}

export const EmployeeManager: React.FC<EmployeeManagerProps> = ({ employees, onRefresh, onViewEmployeePortal }) => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [deleteConfirmEmp, setDeleteConfirmEmp] = useState<Employee | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    mobileNumber: '',
    joiningDate: new Date().toISOString().split('T')[0],
    employmentStatus: 'Active' as 'Active' | 'On Leave' | 'Terminated',
  });

  const isIdValid = formData.employeeId.trim().length >= 3;
  const isNameValid = formData.fullName.trim().length >= 2;
  const cleanMobile = formData.mobileNumber.replace(/[^0-9]/g, '');
  const isMobileValid = cleanMobile.length === 10;

  const handleOpenAdd = () => {
    setEditingEmp(null);
    setFormError(null);
    setTouched({});
    const nextNum = employees.length + 101;
    setFormData({
      employeeId: `HCJ-${nextNum}`,
      fullName: '',
      mobileNumber: '',
      joiningDate: new Date().toISOString().split('T')[0],
      employmentStatus: 'Active',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmp(emp);
    setFormError(null);
    setTouched({});
    setFormData({
      employeeId: emp.employeeId,
      fullName: emp.fullName,
      mobileNumber: emp.mobileNumber,
      joiningDate: emp.joiningDate,
      employmentStatus: emp.employmentStatus,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setTouched({ employeeId: true, fullName: true, mobileNumber: true });

    if (!isIdValid) {
      setFormError('Employee ID kam se kam 3 akshar hona chahiye.');
      return;
    }
    if (!isNameValid) {
      setFormError('Full Name galat hai (kam se kam 2 akshar).');
      return;
    }
    if (!isMobileValid) {
      setFormError('Mobile number galat hai (10 anko ka valid number dalein).');
      return;
    }

    setSaving(true);
    try {
      if (editingEmp) {
        await updateEmployee(editingEmp.id, {
          fullName: formData.fullName.trim(),
          mobileNumber: cleanMobile,
          joiningDate: formData.joiningDate,
          employmentStatus: formData.employmentStatus,
        });
      } else {
        await addEmployee({
          employeeId: formData.employeeId.trim().toUpperCase(),
          fullName: formData.fullName.trim(),
          mobileNumber: cleanMobile,
          joiningDate: formData.joiningDate,
          employmentStatus: formData.employmentStatus,
        });
      }
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      console.error('Error saving employee:', err);
      setFormError(formatFriendlyError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmEmp) return;
    try {
      await deleteEmployee(deleteConfirmEmp.id);
      setDeleteConfirmEmp(null);
      onRefresh();
    } catch (err) {
      console.error('Error deleting employee:', err);
      alert(formatFriendlyError(err));
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      emp.fullName.toLowerCase().includes(q) ||
      emp.employeeId.toLowerCase().includes(q) ||
      emp.mobileNumber.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Employee</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Total Employees: <strong className="text-slate-900">{filteredEmployees.length}</strong></span>
          <span>Only administrator can add or remove employee records.</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-600 tracking-wider">
              <tr>
                <th className="py-3 px-4">Employee Name</th>
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Mobile Number</th>
                <th className="py-3 px-4">Joining Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No employees matching your search query.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs">
                          {emp.fullName.charAt(0)}
                        </div>
                        <span>{emp.fullName}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-extrabold text-blue-900 bg-blue-50 px-2.5 py-1 rounded text-xs border border-blue-200/60">
                        {emp.employeeId}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {emp.mobileNumber}
                    </td>

                    <td className="py-3.5 px-4 text-xs font-mono text-slate-600">
                      {emp.joiningDate}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          emp.employmentStatus === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : emp.employmentStatus === 'On Leave'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {emp.employmentStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onViewEmployeePortal && (
                          <button
                            onClick={() => onViewEmployeePortal(emp)}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1 shadow-2xs"
                            title="Directly access and inspect this employee's dashboard"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Access Portal</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(emp)}
                          className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Employee"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmEmp(emp)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">
                {editingEmp ? 'Edit Employee' : 'Add New Employee'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase text-slate-700">
                      Employee ID *
                    </label>
                    {touched.employeeId && !isIdValid && (
                      <span className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                        गलत (कम से कम 3 अक्षर)
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      disabled={!!editingEmp}
                      placeholder="e.g. HCJ-104"
                      value={formData.employeeId}
                      onBlur={() => setTouched((prev) => ({ ...prev, employeeId: true }))}
                      onChange={(e) => {
                        setFormData({ ...formData, employeeId: e.target.value.toUpperCase() });
                        setTouched((prev) => ({ ...prev, employeeId: true }));
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-bold uppercase transition-all ${
                        touched.employeeId && !isIdValid
                          ? 'border-red-500 bg-red-50/50 text-red-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 pr-12'
                          : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-800 disabled:opacity-60'
                      }`}
                    />
                    {touched.employeeId && !isIdValid && (
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-red-600 pointer-events-none">
                        <span className="text-[10px] font-extrabold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Galat</span>
                      </div>
                    )}
                  </div>
                  {editingEmp && <p className="text-[10px] text-slate-400 mt-1">ID cannot be changed</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Joining Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase text-slate-700">
                    Full Name *
                  </label>
                  {touched.fullName && !isNameValid && (
                    <span className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                      गलत (कम से कम 2 अक्षर)
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.fullName}
                    onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      setTouched((prev) => ({ ...prev, fullName: true }));
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                      touched.fullName && !isNameValid
                        ? 'border-red-500 bg-red-50/50 text-red-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 pr-12'
                        : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold'
                    }`}
                  />
                  {touched.fullName && !isNameValid && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-red-600 pointer-events-none">
                      <span className="text-[10px] font-extrabold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Galat</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase text-slate-700">
                      Mobile Number *
                    </label>
                    {touched.mobileNumber && !isMobileValid && (
                      <span className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                        गलत (10 अंक जरूरी)
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10 अंकों का मोबाइल नंबर"
                      value={formData.mobileNumber}
                      onBlur={() => setTouched((prev) => ({ ...prev, mobileNumber: true }))}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({ ...formData, mobileNumber: val });
                        setTouched((prev) => ({ ...prev, mobileNumber: true }));
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium font-mono transition-all ${
                        touched.mobileNumber && !isMobileValid
                          ? 'border-red-500 bg-red-50/50 text-red-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 pr-12'
                          : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium'
                      }`}
                    />
                    {touched.mobileNumber && !isMobileValid && (
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-red-600 pointer-events-none">
                        <span className="text-[10px] font-extrabold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Galat</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Employment Status
                  </label>
                  <select
                    value={formData.employmentStatus}
                    onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-sm shadow-md"
                >
                  {saving ? 'Saving...' : editingEmp ? 'Update Employee' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmEmp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delete Employee Record?</h3>
            <p className="text-sm text-slate-600">
              Are you sure you want to remove <strong>{deleteConfirmEmp.fullName}</strong> ({deleteConfirmEmp.employeeId})? This will delete the employee and all their attendance history.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmEmp(null)}
                className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
