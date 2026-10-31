
import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import type { Employee, Role } from '../types';

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth';

import { auth } from '../firebase/config';

interface AuthContextType {
  currentUser: {
    uid?: string;
    email?: string;
    displayName?: string;
  } | null;

  currentEmployee: Employee | null;
  role: Role;
  isAdmin: boolean;
  isEmployee: boolean;
  isAdminViewingAsEmployee: boolean;
  loading: boolean;
  error: string | null;

  adminSignInWithGoogle: () => Promise<void>;
  adminSignInWithCredentials: (
    username: string,
    pass: string
  ) => Promise<boolean>;

  adminViewAsEmployee: (emp: Employee) => void;
  returnToAdmin: () => void;

  employeeLogin: (
    employeeId: string,
    pass: string
  ) => Promise<{ success: boolean; message?: string }>;

  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext =
  createContext<AuthContextType | undefined>(undefined);

export const SUPER_ADMIN_EMAIL = (
  import.meta.env.VITE_ADMIN_EMAIL || ''
).trim().toLowerCase();

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  const [currentUser, setCurrentUser] =
    useState<AuthContextType['currentUser']>(null);

  const [currentEmployee, setCurrentEmployee] =
    useState<Employee | null>(null);

  const [role, setRole] = useState<Role>('guest');

  const [isAdminViewingAsEmployee, setIsAdminViewingAsEmployee] =
    useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user && SUPER_ADMIN_EMAIL &&
          user.email?.toLowerCase() === SUPER_ADMIN_EMAIL) {

          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || ''
          });

          setRole('admin');
        } else {
          setCurrentUser(null);
          setRole('guest');
        }

        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const adminSignInWithGoogle = async () => {
    try {
      setError(null);

      if (!SUPER_ADMIN_EMAIL) {
        throw new Error('Admin email is not configured.');
      }

      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      if (result.user.email?.toLowerCase() !== SUPER_ADMIN_EMAIL) {
        await firebaseSignOut(auth);
        throw new Error('Unauthorized Admin Email.');
      }

      setCurrentUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || ''
      });

      setRole('admin');

    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Google login failed.'
      );
      throw err;
    }
  };

  const adminSignInWithCredentials = async (
    username: string,
    pass: string
  ): Promise<boolean> => {
    try {
      setError(null);

      if (!SUPER_ADMIN_EMAIL ||
        username.trim().toLowerCase() !== SUPER_ADMIN_EMAIL) {
        throw new Error('Unauthorized Admin Email.');
      }

      const result = await signInWithEmailAndPassword(
        auth,
        username.trim(),
        pass
      );

      if (result.user.email?.toLowerCase() !== SUPER_ADMIN_EMAIL) {
        await firebaseSignOut(auth);
        throw new Error('Unauthorized Admin.');
      }

      setCurrentUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || ''
      });

      setRole('admin');
      return true;

    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Login failed.'
      );
      return false;
    }
  };

  const adminViewAsEmployee = (emp: Employee) => {
    setCurrentEmployee(emp);
    setIsAdminViewingAsEmployee(true);
    setRole('admin');
  };

  const returnToAdmin = () => {
    setCurrentEmployee(null);
    setIsAdminViewingAsEmployee(false);
    setRole('admin');
  };

  const employeeLogin = async (
    employeeId: string,
    pass: string
  ): Promise<{ success: boolean; message?: string }> => {
    return {
      success: false,
      message: 'Employee authentication is not configured yet.'
    };
  };

  const signOut = async () => {
    await firebaseSignOut(auth);

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
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};
