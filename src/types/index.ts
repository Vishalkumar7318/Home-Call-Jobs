export type Role = 'admin' | 'employee' | 'guest';

export interface Job {
  id: string;
  title: string;
  companyName: string;
  category: string;
  description: string;
  responsibilities: string;
  salary: string;
  incentives: string;
  location: string;
  workType: 'Work From Home' | 'Work From Office' | 'Hybrid';
  workingHours: string;
  weeklyOff: string;
  qualification: string;
  requiredSkills: string;
  experienceRequired: string;
  isFresherAllowed: boolean;
  selectionProcess: string;
  applicationInstructions: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string; // document id, typically employeeId or auto
  employeeId: string; // e.g. HCJ-101
  fullName: string;
  mobileNumber: string;
  email?: string;
  address?: string;
  department?: string;
  designation?: string;
  joiningDate: string; // YYYY-MM-DD
  employmentStatus: 'Active' | 'On Leave' | 'Terminated';
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Leave';

export interface AttendanceRecord {
  id: string; // composite key: employeeId_date
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  markedBy?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  contactEmail: string;
  contactPhone: string;
  companyAddress: string;
  workingHours: string;
  absentPenaltyRate?: number;
  updatedAt: string;
}

export interface MonthlyStats {
  month: string; // YYYY-MM
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  attendancePercentage: number;
}
