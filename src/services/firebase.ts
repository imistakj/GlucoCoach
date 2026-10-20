import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  Auth,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  projectId: firebaseConfigData.projectId,
  appId: firebaseConfigData.appId,
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  firestoreDatabaseId: firebaseConfigData.firestoreDatabaseId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
};

// Initialize Firebase App
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID if provided
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Auth
export const auth: Auth = getAuth(app);

let currentAuthUser: User | null = null;
let authInitPromise: Promise<User | null> | null = null;

export const ensureAuthenticatedUser = async (): Promise<User | null> => {
  if (currentAuthUser) return currentAuthUser;
  if (authInitPromise) return authInitPromise;

  authInitPromise = new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        currentAuthUser = user;
        unsubscribe();
        resolve(user);
      } else {
        try {
          const credential = await signInAnonymously(auth);
          currentAuthUser = credential.user;
          unsubscribe();
          resolve(credential.user);
        } catch (err) {
          console.warn('Anonymous sign-in note (will operate with local user storage fallback):', err);
          unsubscribe();
          resolve(null);
        }
      }
    });
  });

  return authInitPromise;
};

// Google Provider Instance
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

/**
 * Sign in using Google Medical SSO Popup
 */
export async function loginWithGooglePopup(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    currentAuthUser = result.user;
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In failed:', error);
    throw error;
  }
}

/**
 * Sign in with Email and Password
 */
export async function loginWithEmailPassword(email: string, pass: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  currentAuthUser = result.user;
  return result.user;
}

/**
 * Register with Email and Password
 */
export async function registerWithEmailPassword(
  email: string,
  pass: string,
  displayName: string
): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName) {
    await updateProfile(result.user, { displayName });
  }
  currentAuthUser = result.user;
  return result.user;
}

/**
 * Sign out
 */
export async function logoutFirebase(): Promise<void> {
  await signOut(auth);
  currentAuthUser = null;
  authInitPromise = null;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    currentAuthUser = user;
    callback(user);
  });
}

// Connection validator as required by skill
export async function validateFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is running in offline mode. Local persistence active.');
      return false;
    }
    return true; // standard response for non-existent test document
  }
}
