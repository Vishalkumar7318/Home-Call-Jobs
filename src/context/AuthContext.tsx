
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

import { auth, getEmployeeLoginEmail } from '../firebase/config';
import { getEmployeeByAuthUid } from '../services/db';

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
      async (user) => {
        if (user && SUPER_ADMIN_EMAIL &&
          user.email?.toLowerCase() === SUPER_ADMIN_EMAIL) {

          setCurrentUser({
            uid: user.uid,
            email: user.email ?? undefined,
            displayName: user.displayName || ''
          });

          setRole('admin');
          setCurrentEmployee(null);
          setIsAdminViewingAsEmployee(false);
        } else {
          setCurrentUser(null);
          setCurrentEmployee(null);
          setIsAdminViewingAsEmployee(false);
          setRole('guest');
          if (user) {
            try {
              const employee = await getEmployeeByAuthUid(user.uid);
              if (!employee || employee.employmentStatus !== 'Active') {
                await firebaseSignOut(auth);
                setError('Employee account is not active or is not linked to an employee record.');
              } else {
                setCurrentUser({
                  uid: user.uid,
                  email: user.email ?? undefined,
                  displayName: employee.fullName,
                });
                setCurrentEmployee(employee);
                setRole('employee');
              }
            } catch (err) {
              await firebaseSignOut(auth);
              setError(err instanceof Error ? err.message : 'Unable to load employee profile.');
            }
          } else {
            setError(null);
          }
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
        email: result.user.email ?? undefined,
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
        email: result.user.email ?? undefined,
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
    let authenticated = false;
    setLoading(true);
    try {
      setError(null);
      const credential = await signInWithEmailAndPassword(
        auth,
        getEmployeeLoginEmail(employeeId),
        pass
      );
      authenticated = true;
      const employee = await getEmployeeByAuthUid(credential.user.uid);
      if (!employee || employee.employmentStatus !== 'Active') {
        await firebaseSignOut(auth);
        setCurrentUser(null);
        setCurrentEmployee(null);
        setRole('guest');
        return {
          success: false,
          message: 'Employee account is not active or is not linked to an employee record.',
        };
      }

      setCurrentUser({
        uid: credential.user.uid,
        email: credential.user.email ?? undefined,
        displayName: employee.fullName,
      });
      setCurrentEmployee(employee);
      setIsAdminViewingAsEmployee(false);
      setRole('employee');
      return { success: true };
    } catch (err) {
      if (authenticated) {
        await firebaseSignOut(auth);
      }
      const code = typeof err === 'object' && err !== null && 'code' in err
        ? String(err.code)
        : '';
      const message = code === 'auth/invalid-credential' ||
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password'
        ? 'Employee ID or password is incorrect.'
        : err instanceof Error
          ? err.message
          : 'Employee login failed.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
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
