import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const missingFirebaseVariables = Object.entries(firebaseOptions)
  .filter(([, value]) => !value?.trim())
  .map(([key]) => key);

export const firebaseConfigured = missingFirebaseVariables.length === 0;
export const adminUid = import.meta.env.VITE_ADMIN_UID?.trim() ?? "";

export const firebaseApp = firebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseOptions)
  : null;

export const database = firebaseApp ? getDatabase(firebaseApp) : null;

export function getFirebaseSetupMessage() {
  if (!firebaseConfigured) {
    return `Firebase is not configured. Add ${missingFirebaseVariables.join(", ")} to the project .env file.`;
  }

  if (!adminUid) {
    return "Firebase is connected, but VITE_ADMIN_UID is not configured. Add the authorized administrator UID before signing in.";
  }

  return null;
}
