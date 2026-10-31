import React, { createContext, useContext, useState } from 'react';
import type { Employee, Role } from '../types';

interface AuthContextType {
  currentUser: { uid?: string; email?: string; displayName?: string } | null;
  currentEmployee: Employee | null;
  role: Role;
  isAdmin: boolean;
  isEmployee: boolean;
  isAdminViewingAsEmployee: boolean;
  loading: boolean;
  error: string | null;
  adminSignInWithGoogle: () => Promise<void>;
  adminSignInWithCredentials: (username: string, pass: string) => Promise<boolean>;
  adminViewAsEmployee: (emp: Employee) => void;
  returnToAdmin: () => void;
  employeeLogin: (employeeId: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const SUPER_ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com').trim().toLowerCase();
const AUTH_BACKEND_REQUIRED_MESSAGE = 'Authentication is handled by a trusted backend service. Passwords are not validated in the browser.';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<{ uid?: string; email?: string; displayName?: string } | null>(null);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [role, setRole] = useState<Role>('guest');
  const [isAdminViewingAsEmployee, setIsAdminViewingAsEmployee] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const adminSignInWithGoogle = async () => {
    setError(AUTH_BACKEND_REQUIRED_MESSAGE);
    setLoading(false);
  };

  const adminSignInWithCredentials = async (_username: string, _pass: string): Promise<boolean> => {
    setError(AUTH_BACKEND_REQUIRED_MESSAGE);
    setRole('guest');
    setCurrentEmployee(null);
    setIsAdminViewingAsEmployee(false);
    return false;
  };

  const adminViewAsEmployee = (emp: Employee) => {
    setCurrentEmployee(emp);
    setIsAdminViewingAsEmployee(true);
    setRole('admin');
  };

  const returnToAdmin = () => {
    setIsAdminViewingAsEmployee(false);
    setCurrentEmployee(null);
    setRole('admin');
  };

  const employeeLogin = async (employeeId: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    setError(AUTH_BACKEND_REQUIRED_MESSAGE);

    if (!employeeId.trim() || !pass.trim()) {
      return { success: false, message: 'Please enter both Employee ID and Password.' };
    }

    return { success: false, message: AUTH_BACKEND_REQUIRED_MESSAGE };
  };

  const signOut = async () => {
    setCurrentUser(null);
    setCurrentEmployee(null);
    setIsAdminViewingAsEmployee(false);
    setRole('guest');
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentEmployee,
        role,
        isAdmin: role === 'admin',
        isEmployee: role === 'employee' || !!currentEmployee,
        isAdminViewingAsEmployee,
        loading,
        error,
        adminSignInWithGoogle,
        adminSignInWithCredentials,
        adminViewAsEmployee,
        returnToAdmin,
        employeeLogin,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
