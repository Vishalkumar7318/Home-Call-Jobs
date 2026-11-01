import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import type { Job, Employee, AttendanceRecord, SiteSettings } from '../types';

const STORAGE_KEYS = {
  settings: 'hcj_settings',
  jobs: 'hcj_jobs',
  employees: 'hcj_employees',
  attendance: 'hcj_attendance',
} as const;

function hasLocalStorage(): boolean {
  try {
    const key = '__hcj_local_storage_test__';
    if (typeof window === 'undefined') return false;
    window.localStorage.setItem(key, key);
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function readLocalStorage<T>(key: string): T | null {
  if (!hasLocalStorage()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeLocalStorage<T>(key: string, value: T): void {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures and fallback to in-memory behavior.
  }
}

const LOCAL_SAMPLE_EMPLOYEES: Employee[] = [
  {
    id: 'HCJ-101',
    employeeId: 'HCJ-101',
    fullName: 'Rahul Sharma',
    mobileNumber: '9820144521',
    joiningDate: '2026-01-15',
    employmentStatus: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'HCJ-102',
    employeeId: 'HCJ-102',
    fullName: 'Priya Verma',
    mobileNumber: '9711288390',
    joiningDate: '2026-03-01',
    employmentStatus: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'HCJ-103',
    employeeId: 'HCJ-103',
    fullName: 'Amit Patel',
    mobileNumber: '9425012345',
    joiningDate: '2026-05-10',
    employmentStatus: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  whatsappNumber: '917238087918',
  whatsappDefaultMessage: 'Hello Home Call Jobs Team, I would like to connect regarding telecalling services and inquiries.',
  contactEmail: 'support@homecalljobs.com',
  contactPhone: '+91 72380 87918',
  companyAddress: 'Unit 402, Apex Corporate Tower, Business Bay, Mumbai, MH - 400051',
  workingHours: '11:50 AM - 8:00 PM (All Days / No Holiday)',
  absentPenaltyRate: 500,
  updatedAt: new Date().toISOString(),
};

// -------------------- SETTINGS --------------------
export async function getSettings(): Promise<SiteSettings> {
  const path = 'settings/general';
  try {
    const snap = await getDoc(doc(db, 'settings', 'general'));
    if (snap.exists()) {
      const data = snap.data() as SiteSettings;
      let needsUpdate = false;
      const updated: Partial<SiteSettings> = {};

      if (
        !data.whatsappNumber ||
        data.whatsappNumber === '919876543210' ||
        data.whatsappNumber.includes('9876543210') ||
        data.whatsappNumber === '917318087918' ||
        data.whatsappNumber.includes('7318087918')
      ) {
        updated.whatsappNumber = '917238087918';
        updated.contactPhone = '+91 72380 87918';
        needsUpdate = true;
      }

      if (!data.workingHours || data.workingHours.includes('9:30') || data.workingHours.includes('6:30') || data.workingHours.includes('Mon - Sat')) {
        updated.workingHours = '11:50 AM - 8:00 PM (All Days / No Holiday)';
        needsUpdate = true;
      }

      if (!data.absentPenaltyRate || data.absentPenaltyRate !== 500) {
        updated.absentPenaltyRate = 500;
        needsUpdate = true;
      }

      if (needsUpdate) {
        const merged = {
          ...data,
          ...updated,
          updatedAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'settings', 'general'), merged, { merge: true });
        writeLocalStorage(STORAGE_KEYS.settings, { ...DEFAULT_SETTINGS, ...merged });
        return { ...DEFAULT_SETTINGS, ...merged };
      }

      const normalized = { ...DEFAULT_SETTINGS, ...data };
      writeLocalStorage(STORAGE_KEYS.settings, normalized);
      return normalized;
    }

    await setDoc(doc(db, 'settings', 'general'), DEFAULT_SETTINGS);
    writeLocalStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  } catch (err) {
    const localSettings = readLocalStorage<SiteSettings>(STORAGE_KEYS.settings);
    if (localSettings) {
      return localSettings;
    }
    console.warn('Using default settings fallback:', err);
    writeLocalStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<void> {
  const path = 'settings/general';
  try {
    const existing = await getSettings();
    const updated: SiteSettings = {
      ...existing,
      ...settings,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'settings', 'general'), updated);
    writeLocalStorage(STORAGE_KEYS.settings, updated);
  } catch (error) {
    const existing = readLocalStorage<SiteSettings>(STORAGE_KEYS.settings) ?? DEFAULT_SETTINGS;
    const updated: SiteSettings = {
      ...existing,
      ...settings,
      updatedAt: new Date().toISOString(),
    };
    writeLocalStorage(STORAGE_KEYS.settings, updated);
  }
}

// -------------------- JOBS --------------------
export async function getJobs(includeUnpublished = false): Promise<Job[]> {
  const path = 'jobs';
  try {
    const snap = await getDocs(collection(db, path));
    const jobs: Job[] = [];
    snap.forEach((d) => {
      const data = d.data() as Job;
      jobs.push({ ...data, id: d.id });
    });

    const normalized = jobs.sort((a, b) => a.title.localeCompare(b.title));
    writeLocalStorage(STORAGE_KEYS.jobs, normalized);

    if (!includeUnpublished) {
      return normalized.filter((j) => j.isPublished);
    }
    return normalized;
  } catch (error) {
    const localJobs = readLocalStorage<Job[]>(STORAGE_KEYS.jobs) ?? [];
    if (localJobs.length === 0 && typeof window !== 'undefined') {
      writeLocalStorage(STORAGE_KEYS.jobs, []);
    }
    return includeUnpublished ? localJobs : localJobs.filter((j) => j.isPublished);
  }
}

export async function addJob(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const path = 'jobs';
  try {
    const id = 'job_' + Date.now();
    const now = new Date().toISOString();
    const newJob: Job = {
      ...jobData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(doc(db, path, id), newJob);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateJob(id: string, updates: Partial<Job>): Promise<void> {
  const path = `jobs/${id}`;
  try {
    const now = new Date().toISOString();
    await updateDoc(doc(db, 'jobs', id), {
      ...updates,
      updatedAt: now,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteJob(id: string): Promise<void> {
  const path = `jobs/${id}`;
  try {
    await deleteDoc(doc(db, 'jobs', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// -------------------- EMPLOYEES --------------------
export async function getEmployees(): Promise<Employee[]> {
  const path = 'employees';
  try {
    const snap = await getDocs(collection(db, path));
    const employees: Employee[] = [];
    snap.forEach((d) => {
      const data = d.data() as Employee;
      employees.push({ ...data, id: d.id });
    });
    const sorted = employees.sort((a, b) => a.employeeId.localeCompare(b.employeeId));
    writeLocalStorage(STORAGE_KEYS.employees, sorted);
    return sorted;
  } catch (error) {
    const localEmployees = readLocalStorage<Employee[]>(STORAGE_KEYS.employees) ?? LOCAL_SAMPLE_EMPLOYEES;
    if (localEmployees.length === 0) {
      writeLocalStorage(STORAGE_KEYS.employees, LOCAL_SAMPLE_EMPLOYEES);
      return LOCAL_SAMPLE_EMPLOYEES;
    }
    writeLocalStorage(STORAGE_KEYS.employees, localEmployees);
    return localEmployees;
  }
}

export async function getEmployeeByEmployeeId(employeeId: string): Promise<Employee | null> {
  const path = 'employees';
  const cleanedId = employeeId.trim().toUpperCase();
  try {
    const q = query(collection(db, path), where('employeeId', '==', cleanedId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      return { ...(docSnap.data() as Employee), id: docSnap.id };
    }
    const directDoc = await getDoc(doc(db, path, cleanedId));
    if (directDoc.exists()) {
      return { ...(directDoc.data() as Employee), id: directDoc.id };
    }

    const localEmployees = readLocalStorage<Employee[]>(STORAGE_KEYS.employees) ?? LOCAL_SAMPLE_EMPLOYEES;
    return localEmployees.find((emp) => emp.employeeId.toUpperCase() === cleanedId) ?? null;
  } catch (error) {
    const localEmployees = readLocalStorage<Employee[]>(STORAGE_KEYS.employees) ?? LOCAL_SAMPLE_EMPLOYEES;
    return localEmployees.find((emp) => emp.employeeId.toUpperCase() === cleanedId) ?? null;
  }
}

export async function getEmployeeByAuthUid(authUid: string): Promise<Employee | null> {
  try {
    const employeeQuery = query(
      collection(db, 'employees'),
      where('authUid', '==', authUid)
    );
    const snapshot = await getDocs(employeeQuery);
    if (!snapshot.empty) {
      const employeeDoc = snapshot.docs[0];
      return { ...(employeeDoc.data() as Employee), id: employeeDoc.id };
    }

    const localEmployees = readLocalStorage<Employee[]>(STORAGE_KEYS.employees) ?? [];
    return localEmployees.find((employee) => employee.authUid === authUid) ?? null;
  } catch (error) {
    const localEmployees = readLocalStorage<Employee[]>(STORAGE_KEYS.employees) ?? [];
    const employee = localEmployees.find((item) => item.authUid === authUid);
    if (employee) return employee;
    throw error;
  }
}

export async function addEmployee(emp: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const path = 'employees';
  const cleanId = emp.employeeId.trim().toUpperCase();
  try {
    const existing = await getEmployeeByEmployeeId(cleanId);
    if (existing) {
      throw new Error(`Employee ID "${cleanId}" already exists. Please choose a different ID.`);
    }

    const now = new Date().toISOString();
    const newEmp: Employee = {
      ...emp,
      id: cleanId,
      employeeId: cleanId,
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(doc(db, path, cleanId), newEmp);

    const existingLocal = readLocalStorage<Employee[]>(STORAGE_KEYS.employees) ?? [];
    const updatedLocal = [...existingLocal, newEmp].sort((a, b) => a.employeeId.localeCompare(b.employeeId));
    writeLocalStorage(STORAGE_KEYS.employees, updatedLocal);
    return cleanId;
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      throw error;
    }

    const existingLocal = readLocalStorage<Employee[]>(STORAGE_KEYS.employees) ?? LOCAL_SAMPLE_EMPLOYEES;
    if (existingLocal.some((empDoc) => empDoc.employeeId.toUpperCase() === cleanId)) {
      throw new Error(`Employee ID "${cleanId}" already exists. Please choose a different ID.`);
    }

    const now = new Date().toISOString();
    const newEmp: Employee = {
      ...emp,
      id: cleanId,
      employeeId: cleanId,
      createdAt: now,
      updatedAt: now,
    };
    const updatedLocal = [...existingLocal, newEmp].sort((a, b) => a.employeeId.localeCompare(b.employeeId));
    writeLocalStorage(STORAGE_KEYS.employees, updatedLocal);
    return cleanId;
  }
}

export async function updateEmployee(id: string, updates: Partial<Employee>): Promise<void> {
  const path = `employees/${id}`;
  const cleanId = id.trim().toUpperCase();
  try {
    const now = new Date().toISOString();
    await updateDoc(doc(db, 'employees', cleanId), {
      ...updates,
      updatedAt: now,
    });

    const existingLocal = readLocalStorage<Employee[]>(STORAGE_KEYS.employees) ?? [];
    const updatedLocal = existingLocal.map((emp) =>
      emp.id.toUpperCase() === cleanId || emp.employeeId.toUpperCase() === cleanId
        ? { ...emp, ...updates, id: cleanId, employeeId: updates.employeeId ?? emp.employeeId, updatedAt: now }
        : emp
    );
    writeLocalStorage(STORAGE_KEYS.employees, updatedLocal);
  } catch (error) {
    const existingLocal = readLocalStorage<Employee[]>(STORAGE_KEYS.employees) ?? LOCAL_SAMPLE_EMPLOYEES;
    const updatedLocal = existingLocal.map((emp) =>
      emp.id.toUpperCase() === cleanId || emp.employeeId.toUpperCase() === cleanId
        ? { ...emp, ...updates, id: cleanId, employeeId: updates.employeeId ?? emp.employeeId, updatedAt: new Date().toISOString() }
        : emp
    );
    writeLocalStorage(STORAGE_KEYS.employees, updatedLocal);
  }
}

export async function deleteEmployee(id: string): Promise<void> {
  const path = `employees/${id}`;
  const cleanId = id.trim().toUpperCase();
  try {
    const attSnap = await getDocs(
      query(collection(db, 'attendance'), where('employeeId', '==', cleanId))
    );
    const deletePromises = attSnap.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);
    await deleteDoc(doc(db, 'employees', cleanId));

    const existingLocal = readLocalStorage<Employee[]>(STORAGE_KEYS.employees) ?? [];
    const filtered = existingLocal.filter((emp) => emp.id.toUpperCase() !== cleanId && emp.employeeId.toUpperCase() !== cleanId);
    writeLocalStorage(STORAGE_KEYS.employees, filtered);
  } catch (error) {
    const existingLocal = readLocalStorage<Employee[]>(STORAGE_KEYS.employees) ?? LOCAL_SAMPLE_EMPLOYEES;
    const filtered = existingLocal.filter((emp) => emp.id.toUpperCase() !== cleanId && emp.employeeId.toUpperCase() !== cleanId);
    writeLocalStorage(STORAGE_KEYS.employees, filtered);
  }
}

// -------------------- ATTENDANCE --------------------
// Document ID format: `${employeeId}_${date}`
// This strictly prevents duplicate attendance entries for the same employee and date!
export function getAttendanceDocId(employeeId: string, date: string): string {
  return `${employeeId.trim().toUpperCase()}_${date.trim()}`;
}

export async function markAttendance(record: {
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent' | 'Leave';
  markedBy?: string;
  remarks?: string;
}): Promise<void> {
  const path = 'attendance';
  const docId = getAttendanceDocId(record.employeeId, record.date);
  try {
    const now = new Date().toISOString();
    const newRecord: AttendanceRecord = {
      id: docId,
      employeeId: record.employeeId.trim().toUpperCase(),
      employeeName: record.employeeName,
      date: record.date,
      status: record.status,
      markedBy: record.markedBy || 'Admin',
      remarks: record.remarks || '',
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(doc(db, path, docId), newRecord);

    const existingLocal = readLocalStorage<AttendanceRecord[]>(STORAGE_KEYS.attendance) ?? [];
    const updatedLocal = [...existingLocal.filter((r) => r.id !== docId), newRecord];
    writeLocalStorage(STORAGE_KEYS.attendance, updatedLocal);
  } catch (error) {
    const now = new Date().toISOString();
    const newRecord: AttendanceRecord = {
      id: docId,
      employeeId: record.employeeId.trim().toUpperCase(),
      employeeName: record.employeeName,
      date: record.date,
      status: record.status,
      markedBy: record.markedBy || 'Admin',
      remarks: record.remarks || '',
      createdAt: now,
      updatedAt: now,
    };
    const existingLocal = readLocalStorage<AttendanceRecord[]>(STORAGE_KEYS.attendance) ?? [];
    const updatedLocal = [...existingLocal.filter((r) => r.id !== docId), newRecord];
    writeLocalStorage(STORAGE_KEYS.attendance, updatedLocal);
  }
}

export async function updateAttendance(id: string, updates: Partial<AttendanceRecord>): Promise<void> {
  const path = `attendance/${id}`;
  try {
    const now = new Date().toISOString();
    await updateDoc(doc(db, 'attendance', id), {
      ...updates,
      updatedAt: now,
    });

    const existingLocal = readLocalStorage<AttendanceRecord[]>(STORAGE_KEYS.attendance) ?? [];
    const updatedLocal = existingLocal.map((record) =>
      record.id === id ? { ...record, ...updates, updatedAt: now } : record
    );
    writeLocalStorage(STORAGE_KEYS.attendance, updatedLocal);
  } catch (error) {
    const existingLocal = readLocalStorage<AttendanceRecord[]>(STORAGE_KEYS.attendance) ?? [];
    const updatedLocal = existingLocal.map((record) =>
      record.id === id ? { ...record, ...updates, updatedAt: new Date().toISOString() } : record
    );
    writeLocalStorage(STORAGE_KEYS.attendance, updatedLocal);
  }
}

export async function deleteAttendance(id: string): Promise<void> {
  const path = `attendance/${id}`;
  try {
    await deleteDoc(doc(db, 'attendance', id));

    const existingLocal = readLocalStorage<AttendanceRecord[]>(STORAGE_KEYS.attendance) ?? [];
    const filtered = existingLocal.filter((record) => record.id !== id);
    writeLocalStorage(STORAGE_KEYS.attendance, filtered);
  } catch (error) {
    const existingLocal = readLocalStorage<AttendanceRecord[]>(STORAGE_KEYS.attendance) ?? [];
    const filtered = existingLocal.filter((record) => record.id !== id);
    writeLocalStorage(STORAGE_KEYS.attendance, filtered);
  }
}

export async function getAttendanceByEmployee(employeeId: string, monthPrefix?: string): Promise<AttendanceRecord[]> {
  const path = 'attendance';
  const cleanId = employeeId.trim().toUpperCase();
  try {
    const q = query(
      collection(db, path),
      where('employeeId', '==', cleanId)
    );
    const snap = await getDocs(q);
    const records: AttendanceRecord[] = [];
    snap.forEach((d) => {
      const data = d.data() as AttendanceRecord;
      if (!monthPrefix || data.date.startsWith(monthPrefix)) {
        records.push({ ...data, id: d.id });
      }
    });
    const sorted = records.sort((a, b) => b.date.localeCompare(a.date));
    writeLocalStorage(STORAGE_KEYS.attendance, sorted);
    return sorted;
  } catch (error) {
    const localRecords = (readLocalStorage<AttendanceRecord[]>(STORAGE_KEYS.attendance) ?? []).filter(
      (record) => record.employeeId.toUpperCase() === cleanId && (!monthPrefix || record.date.startsWith(monthPrefix))
    );
    return localRecords.sort((a, b) => b.date.localeCompare(a.date));
  }
}

export async function getAllAttendance(dateOrMonth?: string): Promise<AttendanceRecord[]> {
  const path = 'attendance';
  try {
    const snap = await getDocs(collection(db, path));
    const records: AttendanceRecord[] = [];
    snap.forEach((d) => {
      const data = d.data() as AttendanceRecord;
      if (!dateOrMonth) {
        records.push({ ...data, id: d.id });
      } else if (dateOrMonth.length === 10 && data.date === dateOrMonth) {
        records.push({ ...data, id: d.id });
      } else if (data.date.startsWith(dateOrMonth)) {
        records.push({ ...data, id: d.id });
      }
    });
    const sorted = records.sort((a, b) => b.date.localeCompare(a.date));
    writeLocalStorage(STORAGE_KEYS.attendance, sorted);
    return sorted;
  } catch (error) {
    const localRecords = (readLocalStorage<AttendanceRecord[]>(STORAGE_KEYS.attendance) ?? []).filter((record) => {
      if (!dateOrMonth) return true;
      if (dateOrMonth.length === 10) return record.date === dateOrMonth;
      return record.date.startsWith(dateOrMonth);
    });
    return localRecords.sort((a, b) => b.date.localeCompare(a.date));
  }
}

// -------------------- INITIAL SEED DATA --------------------
export async function seedInitialDataIfNeeded(): Promise<void> {
  try {
    const jobSnap = await getDocs(collection(db, 'jobs'));
    if (!jobSnap.empty) {
      const jobs = [] as Job[];
      jobSnap.forEach((d) => jobs.push({ ...d.data(), id: d.id } as Job));
      writeLocalStorage(STORAGE_KEYS.jobs, jobs);
      return;
    }

    console.log('Seeding initial Home Call Jobs data...');

    await setDoc(doc(db, 'settings', 'general'), DEFAULT_SETTINGS);
    writeLocalStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS);

    const initialJobs: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        title: 'Customer Support Telecaller (Inbound Voice)',
        companyName: 'Apex Connect Solutions',
        category: 'Inbound Support',
        description: 'We are hiring enthusiastic Customer Support Telecallers to handle inbound customer queries, assist with order status, address service questions, and provide top-notch customer satisfaction over telephone calls.',
        responsibilities: 'Answer incoming customer phone calls politely and professionally; diagnose customer queries regarding service accounts; log call records and customer feedback in CRM; coordinate with tier-2 escalation teams when necessary; achieve 95%+ first-call resolution rate.',
        salary: '₹22,000 - ₹32,000 / month',
        incentives: 'Quarterly attendance bonus ₹4,000 + CSAT score incentives up to ₹6,000/month',
        location: 'Mumbai (Andheri East)',
        workType: 'Work From Home',
        workingHours: '9:30 AM - 6:30 PM (Day Shift)',
        weeklyOff: 'Fixed Sunday Off + Alternate Saturday',
        qualification: '12th Pass / Any Graduate / Diploma',
        requiredSkills: 'Fluent Hindi & conversational English, pleasant telephone etiquette, active listening, basic typing and computer handling.',
        experienceRequired: 'Fresher to 1 Year',
        isFresherAllowed: true,
        selectionProcess: 'HR Telephonic Screening -> Voice Quality Assessment -> Final Virtual Interview -> Same-day Offer Letter.',
        applicationInstructions: 'Click the WhatsApp button below to submit your resume directly to HR. Please mention "Inbound Voice Support" in your message.',
        isPublished: true,
      },
      {
        title: 'Outbound Tele-Sales Executive (Banking & Loans)',
        companyName: 'FinTrust Capital Services',
        category: 'Tele-Sales',
        description: 'Exciting career opportunity for dynamic Tele-Sales callers to engage pre-qualified banking leads, explain financial products (credit cards & personal loans), and assist interested customers in completing applications.',
        responsibilities: 'Make outbound calls to verified, warm leads; explain financial products and credit features transparently; resolve customer objections and schedule document pickup; maintain daily CRM call quotas (80-100 calls/day); achieve weekly disbursal targets.',
        salary: '₹25,000 - ₹40,000 / month',
        incentives: 'Uncapped performance commissions (average executive earns ₹15,000 - ₹25,000 additional incentive per month)',
        location: 'Delhi NCR / Gurgaon',
        workType: 'Work From Office',
        workingHours: '10:00 AM - 7:00 PM',
        weeklyOff: 'Sunday Fixed Off',
        qualification: 'Graduate in any discipline (Freshers with high persuasion skills encouraged)',
        requiredSkills: 'Strong persuasive speaking, negotiation skills, confidence, Hindi fluency, target-oriented mindset.',
        experienceRequired: '0 - 3 Years',
        isFresherAllowed: true,
        selectionProcess: 'Aptitude & Pitch Test -> Manager Round -> Immediate Joining.',
        applicationInstructions: 'Contact our hiring team directly on WhatsApp with your name and city for fast-track interview scheduling.',
        isPublished: true,
      },
      {
        title: 'BPO International Voice Associate (US Shift)',
        companyName: 'GlobalBridge Teleservices',
        category: 'International BPO',
        description: 'Join our premier international voice process assisting US healthcare and insurance clients. Receive comprehensive paid voice & accent training and attractive night-shift allowances.',
        responsibilities: 'Handle inbound customer verification and benefits explanation calls; verify insured member details compliant with HIPAA standards; document call summaries accurately; maintain high quality assurance scores.',
        salary: '₹35,000 - ₹50,000 / month',
        incentives: 'Night shift allowance ₹5,000/month + free home drop cab facility + process quality incentives up to ₹8,000',
        location: 'Bengaluru / Hybrid',
        workType: 'Hybrid',
        workingHours: '6:30 PM - 3:30 AM (US Shift)',
        weeklyOff: 'Saturday & Sunday Fixed Off (5-Day Work Week)',
        qualification: 'Undergraduate / Graduate',
        requiredSkills: 'Excellent English communication (verbal & written), clear neutral accent, high attention to detail.',
        experienceRequired: 'Fresher or 6+ months in Voice BPO',
        isFresherAllowed: true,
        selectionProcess: 'Versant Voice Assessment -> HR Round -> Operations Manager Interview.',
        applicationInstructions: 'Message HR on WhatsApp with your voice recording or resume to book your interview slot.',
        isPublished: true,
      },
      {
        title: 'Lead Generation Representative (B2B Telecalling)',
        companyName: 'Nexus Growth Marketing',
        category: 'Lead Generation',
        description: 'Home Call Jobs exclusive opening for B2B tele-marketers to connect with SME business owners, introduce SaaS software solutions, and book online product demonstration appointments for senior consultants.',
        responsibilities: 'Identify and reach decision-makers across mid-sized companies; introduce our flagship business productivity software; qualify interest and schedule discovery calls for the sales team; maintain lead pipeline in HubSpot.',
        salary: '₹24,000 - ₹35,000 / month',
        incentives: '₹500 per qualified demo booked + monthly performance awards',
        location: 'Pune / Remote',
        workType: 'Work From Home',
        workingHours: '9:30 AM - 6:30 PM',
        weeklyOff: 'Sunday Fixed Off',
        qualification: '12th Pass or Bachelor’s degree',
        requiredSkills: 'Professional corporate tone, persistence, good conversational abilities, laptop with high-speed internet.',
        experienceRequired: 'Fresher / Experienced',
        isFresherAllowed: true,
        selectionProcess: 'HR Call -> Mock Pitch Exercise -> Final Selection.',
        applicationInstructions: 'Send WhatsApp message to HR with your educational background and availability.',
        isPublished: true,
      },
      {
        title: 'Team Leader - Telecalling & Quality Auditing',
        companyName: 'Apex Connect Solutions',
        category: 'Team Lead',
        description: 'Lead a team of 15 telecalling executives, monitor live calls, conduct calibration sessions, and drive daily KPIs and attendance adherence.',
        responsibilities: 'Manage day-to-day call center floor operations; conduct daily team huddles and call quality audits; coach low-performing agents; liaise with senior management on conversion metrics and staffing.',
        salary: '₹42,000 - ₹58,000 / month',
        incentives: 'Team target achievement bonus up to ₹15,000 monthly',
        location: 'Mumbai (Andheri East)',
        workType: 'Work From Office',
        workingHours: '9:30 AM - 6:30 PM',
        weeklyOff: 'Fixed Sunday Off',
        qualification: 'Graduate in any stream',
        requiredSkills: 'Team leadership, call center reporting, conflict resolution, KPI management, advanced Excel.',
        experienceRequired: '2 - 5 Years in Telecalling / BPO',
        isFresherAllowed: false,
        selectionProcess: 'Technical Case Study -> HR Interview -> Director Discussion.',
        applicationInstructions: 'WhatsApp your updated CV highlighting team handling experience.',
        isPublished: true,
      }
    ];

    for (const job of initialJobs) {
      await addJob(job);
    }

    writeLocalStorage(STORAGE_KEYS.jobs, (readLocalStorage<Job[]>(STORAGE_KEYS.jobs) ?? []).concat(
      initialJobs.map((job, index) => ({
        ...job,
        id: `job_${Date.now()}_${index}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))
    ));

    const initialEmployees: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        employeeId: 'HCJ-101',
        fullName: 'Rahul Sharma',
        mobileNumber: '+91 98201 44521',
        joiningDate: '2026-01-15',
        employmentStatus: 'Active',
      },
      {
        employeeId: 'HCJ-102',
        fullName: 'Priya Verma',
        mobileNumber: '+91 97112 88390',
        joiningDate: '2026-03-01',
        employmentStatus: 'Active',
      },
      {
        employeeId: 'HCJ-103',
        fullName: 'Amit Patel',
        mobileNumber: '+91 94250 12345',
        joiningDate: '2026-05-10',
        employmentStatus: 'Active',
      }
    ];

    for (const emp of initialEmployees) {
      await addEmployee(emp);
    }

    writeLocalStorage(STORAGE_KEYS.employees, LOCAL_SAMPLE_EMPLOYEES);

    const initialAttendance: AttendanceRecord[] = [];
    // Generating October 1st to October 30th attendance for HCJ-101
    const attendancePatterns: { empId: string; name: string }[] = [
      { empId: 'HCJ-101', name: 'Rahul Sharma' },
      { empId: 'HCJ-102', name: 'Priya Verma' },
      { empId: 'HCJ-103', name: 'Amit Patel' },
    ];

    for (const p of attendancePatterns) {
      for (let day = 1; day <= 28; day++) {
        const dayStr = day < 10 ? `0${day}` : `${day}`;
        const dateStr = `2026-10-${dayStr}`;
        const dayOfWeek = (day + 3) % 7;

        if (dayOfWeek === 0) continue;

        let status: 'Present' | 'Absent' | 'Leave' = 'Present';
        let remarks = 'Regular shift completed';

        if (day === 5 || day === 17) {
          status = 'Leave';
          remarks = 'Casual leave approved by manager';
        } else if (day === 12) {
          status = 'Absent';
          remarks = 'Uninformed absence';
        }

        const attendanceDoc: AttendanceRecord = {
          id: `${p.empId}_${dateStr}`,
          employeeId: p.empId,
          employeeName: p.name,
          date: dateStr,
          status,
          markedBy: 'Admin (System)',
          remarks,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        initialAttendance.push(attendanceDoc);
        await markAttendance({
          employeeId: p.empId,
          employeeName: p.name,
          date: dateStr,
          status,
          markedBy: 'Admin (System)',
          remarks,
        });
      }
    }

    writeLocalStorage(STORAGE_KEYS.attendance, initialAttendance);
    console.log('Seeding completed successfully!');
  } catch (err) {
    writeLocalStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
    writeLocalStorage(STORAGE_KEYS.employees, LOCAL_SAMPLE_EMPLOYEES);
    writeLocalStorage(STORAGE_KEYS.jobs, []);
    writeLocalStorage(STORAGE_KEYS.attendance, []);
    console.error('Initial seed error:', err);
  }
}
