import { getApps, initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const employeeProvisioningApp =
  getApps().find((existingApp) => existingApp.name === 'employee-provisioning') ??
  initializeApp(firebaseConfig, 'employee-provisioning');

// CRITICAL: The app will break without specifying firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
const employeeProvisioningAuth = getAuth(employeeProvisioningApp);

export function getEmployeeLoginEmail(employeeId: string): string {
  const cleanId = employeeId.trim().toUpperCase();
  if (!/^[A-Z0-9][A-Z0-9-]{2,49}$/.test(cleanId)) {
    throw new Error('Employee ID may contain only letters, numbers, and hyphens.');
  }
  return `${cleanId.toLowerCase()}@employees.homecalljobs.com`;
}

export async function createEmployeeAuthAccount(
  employeeId: string,
  password: string
): Promise<string> {
  if (employeeProvisioningAuth.currentUser) {
    await signOut(employeeProvisioningAuth);
  }
  const credential = await createUserWithEmailAndPassword(
    employeeProvisioningAuth,
    getEmployeeLoginEmail(employeeId),
    password
  );
  const uid = credential.user.uid;
  await signOut(employeeProvisioningAuth);
  return uid;
}

// Test Firestore server connectivity on initialization
export async function testFirestoreConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client offline check:', error.message);
    }
  }
}

// Initial test trigger
testFirestoreConnection();

export default app;
