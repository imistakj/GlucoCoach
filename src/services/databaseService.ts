import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db, ensureAuthenticatedUser, validateFirestoreConnection } from './firebase';
import { UserProfile, RecordedMeal, DailyCheckIn, KitchenFoodOrder } from '../types';

export interface DatabaseSyncState {
  isOnline: boolean;
  firestoreConnected: boolean;
  lastSyncedAt: string | null;
  recordsCount: {
    meals: number;
    checkIns: number;
    orders: number;
  };
}

const LOCAL_STORAGE_KEYS = {
  PROFILE: 'glucocoach_profile_data',
  MEALS: 'glucocoach_recorded_meals',
  CHECKINS: 'glucocoach_daily_checkins',
  ORDERS: 'glucocoach_kitchen_orders',
};

// Fallback session user ID when running in demo/offline mode
function getAppUserId(): string {
  let uid = localStorage.getItem('glucocoach_user_uid');
  if (!uid) {
    uid = 'user-qatar-' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('glucocoach_user_uid', uid);
  }
  return uid;
}

/**
 * 1. USER PROFILE & EMERGENCY MEDICAL DATA PERSISTENCE
 */
export async function persistUserProfile(profile: UserProfile): Promise<void> {
  // Always persist locally first for instant availability
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('LocalStorage error saving profile:', e);
  }

  // Persist to Cloud Firestore
  try {
    const authUser = await ensureAuthenticatedUser();
    const userId = authUser?.uid || getAppUserId();
    const profileRef = doc(db, 'users', userId, 'profile', 'medical');

    const cleanData = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };

    await setDoc(profileRef, cleanData, { merge: true });
  } catch (err) {
    console.warn('Firestore profile sync note (persisted locally):', err);
  }
}

export async function fetchUserProfile(): Promise<UserProfile | null> {
  // Try Firestore first
  try {
    const authUser = await ensureAuthenticatedUser();
    const userId = authUser?.uid || getAppUserId();
    const profileRef = doc(db, 'users', userId, 'profile', 'medical');
    const docSnap = await getDoc(profileRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as UserProfile;
      localStorage.setItem(LOCAL_STORAGE_KEYS.PROFILE, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Firestore profile fetch fallback to local:', err);
  }

  // Fallback to local
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEYS.PROFILE);
    if (local) return JSON.parse(local);
  } catch {
    // ignore
  }

  return null;
}

/**
 * 2. RECORDED MEALS PERSISTENCE
 */
export async function persistRecordedMeal(meal: RecordedMeal): Promise<void> {
  // Cloud Firestore
  try {
    const authUser = await ensureAuthenticatedUser();
    const userId = authUser?.uid || getAppUserId();
    const mealRef = doc(db, 'users', userId, 'recordedMeals', meal.id);
    await setDoc(mealRef, { ...meal, userId }, { merge: true });
  } catch (err) {
    console.warn('Firestore meal sync note:', err);
  }
}

export async function removeRecordedMealFromDb(mealId: string): Promise<void> {
  try {
    const authUser = await ensureAuthenticatedUser();
    const userId = authUser?.uid || getAppUserId();
    const mealRef = doc(db, 'users', userId, 'recordedMeals', mealId);
    await deleteDoc(mealRef);
  } catch (err) {
    console.warn('Firestore meal delete note:', err);
  }
}

export async function fetchRecordedMeals(): Promise<RecordedMeal[]> {
  try {
    const authUser = await ensureAuthenticatedUser();
    const userId = authUser?.uid || getAppUserId();
    const mealsColl = collection(db, 'users', userId, 'recordedMeals');
    const snap = await getDocs(mealsColl);

    if (!snap.empty) {
      const meals: RecordedMeal[] = [];
      snap.forEach((d) => meals.push(d.data() as RecordedMeal));
      // Sort newest first
      meals.sort((a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime());
      return meals;
    }
  } catch (err) {
    console.warn('Firestore fetch meals fallback to local:', err);
  }

  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEYS.MEALS);
    if (local) return JSON.parse(local);
  } catch {
    // ignore
  }

  return [];
}

/**
 * 3. BLOOD SUGAR READINGS & CHECK-INS PERSISTENCE
 */
export async function persistBloodSugarLog(checkIn: DailyCheckIn): Promise<void> {
  try {
    const authUser = await ensureAuthenticatedUser();
    const userId = authUser?.uid || getAppUserId();
    const logRef = doc(db, 'users', userId, 'bloodSugarLogs', checkIn.id);
    await setDoc(logRef, { ...checkIn, userId }, { merge: true });
  } catch (err) {
    console.warn('Firestore blood sugar sync note:', err);
  }
}

export async function fetchBloodSugarLogs(): Promise<DailyCheckIn[]> {
  try {
    const authUser = await ensureAuthenticatedUser();
    const userId = authUser?.uid || getAppUserId();
    const logsColl = collection(db, 'users', userId, 'bloodSugarLogs');
    const snap = await getDocs(logsColl);

    if (!snap.empty) {
      const logs: DailyCheckIn[] = [];
      snap.forEach((d) => logs.push(d.data() as DailyCheckIn));
      logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return logs;
    }
  } catch (err) {
    console.warn('Firestore blood sugar fetch fallback:', err);
  }

  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEYS.CHECKINS);
    if (local) return JSON.parse(local);
  } catch {
    // ignore
  }

  return [];
}

/**
 * 4. KITCHEN FOOD ORDERS PERSISTENCE
 */
export async function persistKitchenOrder(order: KitchenFoodOrder): Promise<void> {
  try {
    const authUser = await ensureAuthenticatedUser();
    const userId = authUser?.uid || getAppUserId();
    const orderRef = doc(db, 'users', userId, 'orders', order.id);
    await setDoc(orderRef, { ...order, userId }, { merge: true });
  } catch (err) {
    console.warn('Firestore order sync note:', err);
  }
}

export async function fetchKitchenOrders(): Promise<KitchenFoodOrder[]> {
  try {
    const authUser = await ensureAuthenticatedUser();
    const userId = authUser?.uid || getAppUserId();
    const ordersColl = collection(db, 'users', userId, 'orders');
    const snap = await getDocs(ordersColl);

    if (!snap.empty) {
      const orders: KitchenFoodOrder[] = [];
      snap.forEach((d) => orders.push(d.data() as KitchenFoodOrder));
      orders.sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
      return orders;
    }
  } catch (err) {
    console.warn('Firestore orders fetch fallback:', err);
  }

  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
    if (local) return JSON.parse(local);
  } catch {
    // ignore
  }

  return [];
}

/**
 * 5. DATABASE EXPORT & IMPORT FOR PATIENT DATA SOVEREIGNTY
 */
export function exportDatabaseBackup(
  profile: UserProfile,
  meals: RecordedMeal[],
  checkIns: DailyCheckIn[],
  orders: KitchenFoodOrder[]
): string {
  const exportPayload = {
    app: 'GlucoCoach Qatar Health & Nutrition Database',
    exportedAt: new Date().toISOString(),
    version: '2.0.0',
    data: {
      profile,
      recordedMeals: meals,
      bloodSugarLogs: checkIns,
      kitchenFoodOrders: orders,
    },
  };
  return JSON.stringify(exportPayload, null, 2);
}

/**
 * 6. CHECK CONNECTION HEALTH
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  return validateFirestoreConnection();
}
