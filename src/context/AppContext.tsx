import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Language,
  GlucoseUnit,
  BasketItem,
  FoodProduct,
  DailyCheckIn,
  UserProfile,
  TriageLevel,
  KitchenMealItem,
  KitchenFoodOrder,
  RecordedMeal,
  NextMealSuggestion,
  MealType,
} from '../types';
import { QATAR_SUPERMARKET_PRODUCTS } from '../data/qatarProducts';
import { QATAR_HEALTHY_MEALS } from '../data/qatarKitchens';
import { translations } from '../data/translations';
import { generateNextMealSuggestion } from '../services/nextMealEngine';
import {
  persistUserProfile,
  fetchUserProfile,
  persistRecordedMeal,
  removeRecordedMealFromDb,
  fetchRecordedMeals,
  persistBloodSugarLog,
  fetchBloodSugarLogs,
  persistKitchenOrder,
  fetchKitchenOrders,
  exportDatabaseBackup,
  checkDatabaseHealth,
} from '../services/databaseService';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (typeof translations)['en'];
  unit: GlucoseUnit;
  setUnit: (unit: GlucoseUnit) => void;
  formatGlucose: (valInMgDl: number) => string;
  activeTab: 'meal' | 'heart' | 'basket' | 'medical-id';
  setActiveTab: (tab: 'meal' | 'heart' | 'basket' | 'medical-id') => void;

  // Meal Recording & Next Meal Suggestion Engine
  recordedMeals: RecordedMeal[];
  recordMeal: (mealData: Partial<RecordedMeal> & { name: string; sugarGrams: number }) => RecordedMeal;
  deleteRecordedMeal: (id: string) => void;
  lastRecordedMeal?: RecordedMeal;
  currentSugarLevel: number;
  setCurrentSugarLevel: (val: number) => void;
  nextMealSuggestion: NextMealSuggestion;
  isMealLoggerOpen: boolean;
  setIsMealLoggerOpen: (open: boolean) => void;
  
  // Qatari Kitchens & Food Orders
  orders: KitchenFoodOrder[];
  placeKitchenOrder: (
    meal: KitchenMealItem,
    quantity?: number,
    selectedMods?: string[],
    deliveryAddress?: string,
    specialNotes?: string
  ) => KitchenFoodOrder;
  activeKitchenOrder: KitchenFoodOrder | null;
  setActiveKitchenOrder: (order: KitchenFoodOrder | null) => void;
  selectedMealForOrder: KitchenMealItem | null;
  setSelectedMealForOrder: (meal: KitchenMealItem | null) => void;
  openOrderModalForMeal: (meal: KitchenMealItem) => void;
  isOrderModalOpen: boolean;
  setIsOrderModalOpen: (open: boolean) => void;
  
  // Smart Basket
  basket: BasketItem[];
  addToBasket: (product: FoodProduct, quantity?: number) => void;
  removeFromBasket: (productId: string) => void;
  clearBasket: () => void;
  applySmartSwaps: () => void;
  totalBasketSugars: number;
  totalBasketCarbs: number;
  weeklySugarLimit: number;
  isSugarLimitExceeded: boolean;
  
  // Heart Guard & Check-Ins
  dailyCheckIns: DailyCheckIn[];
  addCheckIn: (checkIn: Omit<DailyCheckIn, 'id'>) => TriageLevel;
  triageStatus: TriageLevel;
  latestCheckIn?: DailyCheckIn;
  yesterdayGlucose: number;
  setYesterdayGlucose: (val: number) => void;
  wearableSynced: boolean;
  syncWearable: () => void;
  todayRestingHr: number;
  todaySteps: number;
  todaySleepHours: number;
  
  // Emergency Triage
  isRedAlertOpen: boolean;
  setRedAlertOpen: (open: boolean) => void;
  isAmberAlertOpen: boolean;
  setAmberAlertOpen: (open: boolean) => void;
  triggerRedEmergency: () => void;
  emergencyLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  
  // Profile
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Database & Patient Data Sovereignty
  databaseConnected: boolean;
  exportDatabase: () => string;
}

const defaultProfile: UserProfile = {
  name: 'Salem Al-Kuwari',
  qatarId: '28963401294',
  healthCardNumber: 'HC-9923841',
  dob: '1989-04-12',
  bloodType: 'O+',
  diabeticStatus: 'pre-diabetes',
  targetDailyAddedSugar: 25,
  targetDailyCarbs: 130,
  medications: ['Metformin 500mg (1x daily with dinner)', 'Vitamin D3 50,000 IU (weekly)'],
  allergies: ['Penicillin', 'Peanuts (Mild)'],
  primaryDoctor: 'Dr. Fatima Al-Sulaiti (Consultant Endocrinologist)',
  healthCenter: 'Al Sadd Primary Health Care Center (PHCC)',
  emergencyContact: {
    name: 'Tariq Al-Kuwari (Brother)',
    relationship: 'Brother',
    phone: '+974 5512 8493',
    notifyOnAmber: true,
  },
  chronicConditions: ['Pre-Diabetes (Impaired Fasting Glucose)', 'Mild Dyslipidemia'],
  emergencyNotes: '999 Protocol: In case of unresponsiveness or diaphoresis, evaluate blood sugar immediately. Patient carries oral rapid glucose gel.',
  preferredHospital: 'Hamad General Hospital - Emergency Department (Doha)',
  insulinDependent: false,
  resuscitationPreference: 'FULL_CODE',
};

const initialCheckIns: DailyCheckIn[] = [
  {
    id: 'chk-13',
    date: '2026-10-10',
    timeOfDay: 'morning',
    feelingRating: 'tired',
    sleepHours: 5.8,
    sleepQuality: 'fair',
    medicationTaken: true,
    glucoseLevel: 122,
    glucoseTiming: 'fasting',
    restingHeartRate: 71,
    steps: 5120,
    symptoms: {
      chestTightness: false,
      shortnessOfBreath: false,
      numbnessShoulderJaw: false,
      coldSweat: false,
      dizzinessFainting: false,
      legSwelling: false,
      unusualFatigue: true,
      excessiveThirst: false,
    },
    triageLevel: 'GREEN',
  },
  {
    id: 'chk-12',
    date: '2026-10-09',
    timeOfDay: 'evening',
    feelingRating: 'good',
    sleepHours: 7.0,
    sleepQuality: 'good',
    medicationTaken: true,
    glucoseLevel: 135,
    glucoseTiming: 'post_meal',
    restingHeartRate: 67,
    steps: 8200,
    symptoms: {
      chestTightness: false,
      shortnessOfBreath: false,
      numbnessShoulderJaw: false,
      coldSweat: false,
      dizzinessFainting: false,
      legSwelling: false,
      unusualFatigue: false,
      excessiveThirst: false,
    },
    triageLevel: 'GREEN',
  },
  {
    id: 'chk-11',
    date: '2026-10-09',
    timeOfDay: 'morning',
    feelingRating: 'good',
    sleepHours: 7.2,
    sleepQuality: 'good',
    medicationTaken: true,
    glucoseLevel: 104,
    glucoseTiming: 'fasting',
    restingHeartRate: 65,
    steps: 3400,
    symptoms: {
      chestTightness: false,
      shortnessOfBreath: false,
      numbnessShoulderJaw: false,
      coldSweat: false,
      dizzinessFainting: false,
      legSwelling: false,
      unusualFatigue: false,
      excessiveThirst: false,
    },
    triageLevel: 'GREEN',
  },
  {
    id: 'chk-10',
    date: '2026-10-08',
    timeOfDay: 'evening',
    feelingRating: 'good',
    sleepHours: 7.5,
    sleepQuality: 'good',
    medicationTaken: true,
    glucoseLevel: 118,
    glucoseTiming: 'post_meal',
    restingHeartRate: 66,
    steps: 7420,
    symptoms: {
      chestTightness: false,
      shortnessOfBreath: false,
      numbnessShoulderJaw: false,
      coldSweat: false,
      dizzinessFainting: false,
      legSwelling: false,
      unusualFatigue: false,
      excessiveThirst: false,
    },
    triageLevel: 'GREEN',
  },
  {
    id: 'chk-9',
    date: '2026-10-08',
    timeOfDay: 'morning',
    feelingRating: 'great',
    sleepHours: 7.4,
    sleepQuality: 'good',
    medicationTaken: true,
    glucoseLevel: 106,
    glucoseTiming: 'fasting',
    restingHeartRate: 64,
    steps: 2800,
    symptoms: {
      chestTightness: false,
      shortnessOfBreath: false,
      numbnessShoulderJaw: false,
      coldSweat: false,
      dizzinessFainting: false,
      legSwelling: false,
      unusualFatigue: false,
      excessiveThirst: false,
    },
    triageLevel: 'GREEN',
  },
  {
    id: 'chk-8',
    date: '2026-10-07',
    timeOfDay: 'evening',
    feelingRating: 'good',
    sleepHours: 6.8,
    sleepQuality: 'fair',
    medicationTaken: true,
    glucoseLevel: 145,
    glucoseTiming: 'post_meal',
    restingHeartRate: 69,
    steps: 6200,
    symptoms: {
      chestTightness: false,
      shortnessOfBreath: false,
      numbnessShoulderJaw: false,
      coldSweat: false,
      dizzinessFainting: false,
      legSwelling: false,
      unusualFatigue: false,
      excessiveThirst: false,
    },
    triageLevel: 'GREEN',
  },
  {
    id: 'chk-7',
    date: '2026-10-07',
    timeOfDay: 'morning',
    feelingRating: 'tired',
    sleepHours: 6.0,
    sleepQuality: 'fair',
    medicationTaken: true,
    glucoseLevel: 128,
    glucoseTiming: 'fasting',
    restingHeartRate: 73,
    steps: 3100,
    symptoms: {
      chestTightness: false,
      shortnessOfBreath: false,
      numbnessShoulderJaw: false,
      coldSweat: false,
      dizzinessFainting: false,
      legSwelling: false,
      unusualFatigue: true,
      excessiveThirst: false,
    },
    triageLevel: 'GREEN',
  },
  {
    id: 'chk-6',
    date: '2026-10-06',
    timeOfDay: 'evening',
    feelingRating: 'unwell',
    sleepHours: 6.5,
    sleepQuality: 'poor',
    medicationTaken: true,
    glucoseLevel: 195,
    glucoseTiming: 'post_meal',
    restingHeartRate: 78,
    steps: 4200,
    symptoms: {
      chestTightness: false,
      shortnessOfBreath: false,
      numbnessShoulderJaw: false,
      coldSweat: false,
      dizzinessFainting: false,
      legSwelling: false,
      unusualFatigue: true,
      excessiveThirst: true,
    },
    notes: 'Friday Majlis banquet: Sweet Karak with condensed milk + Luqaimat with date molasses',
    triageLevel: 'AMBER',
  },
  {
    id: 'chk-5',
    date: '2026-10-06',
    timeOfDay: 'morning',
    feelingRating: 'good',
    sleepHours: 7.0,
    sleepQuality: 'good',
    medicationTaken: true,
    glucoseLevel: 110,
    glucoseTiming: 'fasting',
    restingHeartRate: 66,
    steps: 2500,
    symptoms: {
      chestTightness: false,
      shortnessOfBreath: false,
      numbnessShoulderJaw: false,
      coldSweat: false,
      dizzinessFainting: false,
      legSwelling: false,
      unusualFatigue: false,
      excessiveThirst: false,
    },
    triageLevel: 'GREEN',
  },
  {
    id: 'chk-4',
    date: '2026-10-05',
    timeOfDay: 'evening',
    feelingRating: 'good',
    sleepHours: 7.2,
    sleepQuality: 'good',
    medicationTaken: true,
    glucoseLevel: 142,
    glucoseTiming: 'post_meal',
    restingHeartRate: 68,
    steps: 7100,
    symptoms: {
      chestTightness: false,
      shortnessOfBreath: false,
      numbnessShoulderJaw: false,
      coldSweat: false,
      dizzinessFainting: false,
      legSwelling: false,
      unusualFatigue: false,
      excessiveThirst: false,
    },
    triageLevel: 'GREEN',
  },
  {
    id: 'chk-3',
    date: '2026-10-05',
    timeOfDay: 'morning',
    feelingRating: 'good',
    sleepHours: 7.1,
    sleepQuality: 'good',
    medicationTaken: true,
    glucoseLevel: 108,
    glucoseTiming: 'fasting',
    restingHeartRate: 65,
    steps: 3200,
    symptoms: {
      chestTightness: false,
      shortnessOfBreath: false,
      numbnessShoulderJaw: false,
      coldSweat: false,
      dizzinessFainting: false,
      legSwelling: false,
      unusualFatigue: false,
      excessiveThirst: false,
    },
    triageLevel: 'GREEN',
  },
  {
    id: 'chk-2',
    date: '2026-10-04',
    timeOfDay: 'evening',
    feelingRating: 'good',
    sleepHours: 7.3,
    sleepQuality: 'good',
    medicationTaken: true,
    glucoseLevel: 138,
    glucoseTiming: 'post_meal',
    restingHeartRate: 67,
    steps: 6800,
    symptoms: {
      chestTightness: false,
      shortnessOfBreath: false,
      numbnessShoulderJaw: false,
      coldSweat: false,
      dizzinessFainting: false,
      legSwelling: false,
      unusualFatigue: false,
      excessiveThirst: false,
    },
    triageLevel: 'GREEN',
  },
  {
    id: 'chk-1',
    date: '2026-10-04',
    timeOfDay: 'morning',
    feelingRating: 'great',
    sleepHours: 7.8,
    sleepQuality: 'good',
    medicationTaken: true,
    glucoseLevel: 102,
    glucoseTiming: 'fasting',
    restingHeartRate: 64,
    steps: 4100,
    symptoms: {
      chestTightness: false,
      shortnessOfBreath: false,
      numbnessShoulderJaw: false,
      coldSweat: false,
      dizzinessFainting: false,
      legSwelling: false,
      unusualFatigue: false,
      excessiveThirst: false,
    },
    triageLevel: 'GREEN',
  },
];

const initialRecordedMeals: RecordedMeal[] = [
  {
    id: 'meal-rec-1',
    name: 'Baladna Shakshouka & Wholewheat Khubz',
    nameAr: 'شكشوكة بلدنا الطازجة مع خبز بر أسمر',
    mealType: 'breakfast',
    takenAt: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(),
    displayTime: '08:45 AM',
    displayDate: 'Today',
    sugarGrams: 2.8,
    addedSugarGrams: 0,
    carbsGrams: 22,
    proteinGrams: 20,
    calories: 340,
    spikeRisk: 'LOW',
    glucoseAtMeal: 118,
    glucoseTiming: 'post_meal',
    imageUrl: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=500&q=80',
    source: 'ai_photo',
    notes: 'Frontloaded with crisp rocca salad and olive oil',
  },
  {
    id: 'meal-rec-2',
    name: 'Grilled Sea Bass with Lemon Daqoos & Rocca',
    nameAr: 'سيباس مشوي مع دقوس بالليمون وسلطة جرجير',
    mealType: 'dinner',
    takenAt: new Date(Date.now() - 15 * 3600 * 1000).toISOString(),
    displayTime: '08:15 PM',
    displayDate: 'Yesterday',
    sugarGrams: 0.5,
    addedSugarGrams: 0,
    carbsGrams: 5,
    proteinGrams: 44,
    calories: 380,
    spikeRisk: 'LOW',
    glucoseAtMeal: 122,
    glucoseTiming: 'post_meal',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&q=80',
    source: 'kitchen_order',
    notes: 'Zero rice protocol from Bandar Aden, flat glucose curve',
  },
  {
    id: 'meal-rec-3',
    name: 'Traditional Chicken Machboos & Luqaimat',
    nameAr: 'مجبوس دجاج تقليدي مع حبات لقيمات',
    mealType: 'lunch',
    takenAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
    displayTime: '01:30 PM',
    displayDate: 'Yesterday',
    sugarGrams: 16.5,
    addedSugarGrams: 12,
    carbsGrams: 82,
    proteinGrams: 32,
    calories: 780,
    spikeRisk: 'HIGH',
    glucoseAtMeal: 168,
    glucoseTiming: 'post_meal',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80',
    source: 'ai_photo',
    notes: 'Large portion at Majlis with sweetened tea',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language & Direction
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('glucocoach_lang');
    return (saved as Language) || 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('glucocoach_lang', newLang);
  };

  const toggleLang = () => {
    if (lang === 'en') setLang('ar');
    else if (lang === 'ar') setLang('hi');
    else setLang('en');
  };

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Unit
  const [unit, setUnitState] = useState<GlucoseUnit>(() => {
    const saved = localStorage.getItem('glucocoach_unit');
    return (saved as GlucoseUnit) || 'mg/dL';
  });

  const setUnit = (newUnit: GlucoseUnit) => {
    setUnitState(newUnit);
    localStorage.setItem('glucocoach_unit', newUnit);
  };

  const formatGlucose = (valInMgDl: number): string => {
    if (unit === 'mmol/L') {
      return (valInMgDl / 18.0182).toFixed(1) + ' mmol/L';
    }
    return Math.round(valInMgDl) + ' mg/dL';
  };

  // Active Tab
  const [activeTab, setActiveTab] = useState<'meal' | 'heart' | 'basket' | 'medical-id'>('meal');

  // Recorded Meals History & Logging State
  const [recordedMeals, setRecordedMeals] = useState<RecordedMeal[]>(() => {
    const saved = localStorage.getItem('glucocoach_recorded_meals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialRecordedMeals;
  });

  useEffect(() => {
    localStorage.setItem('glucocoach_recorded_meals', JSON.stringify(recordedMeals));
  }, [recordedMeals]);

  // Current recorded blood sugar level (e.g. from checkins, fingerstick test, or meal reading)
  const [currentSugarLevel, setCurrentSugarLevelState] = useState<number>(() => {
    const saved = localStorage.getItem('glucocoach_current_glucose');
    if (saved) return Number(saved);
    if (initialRecordedMeals.length > 0 && initialRecordedMeals[0].glucoseAtMeal) {
      return initialRecordedMeals[0].glucoseAtMeal;
    }
    return 126;
  });

  const setCurrentSugarLevel = (val: number) => {
    setCurrentSugarLevelState(val);
    localStorage.setItem('glucocoach_current_glucose', String(val));
  };

  const [databaseConnected, setDatabaseConnected] = useState(true);

  // Initial cloud sync & database health check on app mount
  useEffect(() => {
    let isMounted = true;
    const initializeDatabase = async () => {
      try {
        const isHealthy = await checkDatabaseHealth();
        if (isMounted) setDatabaseConnected(isHealthy);

        // Fetch cloud user profile
        const cloudProfile = await fetchUserProfile();
        if (isMounted && cloudProfile) {
          setUserProfile((prev) => ({ ...prev, ...cloudProfile }));
        }

        // Fetch cloud recorded meals
        const cloudMeals = await fetchRecordedMeals();
        if (isMounted && cloudMeals && cloudMeals.length > 0) {
          setRecordedMeals(cloudMeals);
        }

        // Fetch cloud checkins
        const cloudLogs = await fetchBloodSugarLogs();
        if (isMounted && cloudLogs && cloudLogs.length > 0) {
          setDailyCheckIns(cloudLogs);
        }

        // Fetch cloud kitchen orders
        const cloudOrders = await fetchKitchenOrders();
        if (isMounted && cloudOrders && cloudOrders.length > 0) {
          setOrders(cloudOrders);
        }
      } catch (err) {
        console.warn('Initial cloud database sync notice:', err);
      }
    };

    initializeDatabase();
    return () => {
      isMounted = false;
    };
  }, []);

  const [isMealLoggerOpen, setIsMealLoggerOpen] = useState(false);

  const lastRecordedMeal = recordedMeals[0];

  // Dynamic clinical suggestion for NEXT meal based on last meal and current sugar level
  const nextMealSuggestion = useMemo(() => {
    return generateNextMealSuggestion(lastRecordedMeal, currentSugarLevel);
  }, [lastRecordedMeal, currentSugarLevel]);

  const recordMeal = (
    mealData: Partial<RecordedMeal> & { name: string; sugarGrams: number }
  ): RecordedMeal => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const hour = now.getHours();
    const autoType: MealType =
      hour >= 5 && hour < 11
        ? 'breakfast'
        : hour >= 11 && hour < 16
        ? 'lunch'
        : hour >= 16 && hour < 21
        ? 'dinner'
        : 'snack';

    const finalGlucose = mealData.glucoseAtMeal ?? currentSugarLevel;

    const newMeal: RecordedMeal = {
      id: 'meal-' + Date.now(),
      name: mealData.name,
      nameAr: mealData.nameAr || mealData.name,
      mealType: mealData.mealType || autoType,
      takenAt: mealData.takenAt || now.toISOString(),
      displayTime: mealData.displayTime || timeStr,
      displayDate: mealData.displayDate || 'Today',
      sugarGrams: Number(mealData.sugarGrams || 0),
      addedSugarGrams: Number(mealData.addedSugarGrams || 0),
      carbsGrams: Number(mealData.carbsGrams || 0),
      proteinGrams: Number(mealData.proteinGrams || 0),
      calories: Number(mealData.calories || 0),
      spikeRisk:
        mealData.spikeRisk ||
        (Number(mealData.sugarGrams) > 12 ? 'HIGH' : Number(mealData.sugarGrams) > 4 ? 'MEDIUM' : 'LOW'),
      glucoseAtMeal: finalGlucose,
      glucoseTiming: mealData.glucoseTiming || 'post_meal',
      imageUrl: mealData.imageUrl,
      source: mealData.source || 'quick_log',
      notes: mealData.notes,
    };

    setRecordedMeals((prev) => [newMeal, ...prev]);
    persistRecordedMeal(newMeal);

    if (mealData.glucoseAtMeal) {
      setCurrentSugarLevel(mealData.glucoseAtMeal);
    }

    return newMeal;
  };

  const deleteRecordedMeal = (id: string) => {
    setRecordedMeals((prev) => prev.filter((m) => m.id !== id));
    removeRecordedMealFromDb(id);
  };

  // Qatari Kitchen Food Orders
  const [orders, setOrders] = useState<KitchenFoodOrder[]>(() => {
    const saved = localStorage.getItem('glucocoach_kitchen_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'ord-101',
        meal: QATAR_HEALTHY_MEALS[0],
        quantity: 1,
        totalQAR: 58,
        status: 'delivered',
        customerName: defaultProfile.name,
        customerPhone: '+974 5512 8493',
        deliveryZone: 'Al Sadd, Zone 38, Doha',
        deliveryAddress: 'Building 14, St 840, Apartment 302',
        selectedMods: ['Zero Rice (Strict Low-Carb)', 'Extra Rocca Salad'],
        placedAt: '13:30',
        estimatedDeliveryTime: 'Delivered (28 mins)',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('glucocoach_kitchen_orders', JSON.stringify(orders));
  }, [orders]);

  const [activeKitchenOrder, setActiveKitchenOrder] = useState<KitchenFoodOrder | null>(null);
  const [selectedMealForOrder, setSelectedMealForOrder] = useState<KitchenMealItem | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const openOrderModalForMeal = (meal: KitchenMealItem) => {
    setSelectedMealForOrder(meal);
    setIsOrderModalOpen(true);
  };

  const placeKitchenOrder = (
    meal: KitchenMealItem,
    quantity = 1,
    selectedMods: string[] = [],
    deliveryAddress = 'Al Sadd, Zone 38, Doha',
    specialNotes = ''
  ): KitchenFoodOrder => {
    const newOrder: KitchenFoodOrder = {
      id: 'ord-' + Date.now(),
      meal,
      quantity,
      totalQAR: meal.priceQAR * quantity,
      status: 'confirmed',
      customerName: userProfile.name || 'Salem Al-Kuwari',
      customerPhone: userProfile.emergencyContact?.phone || '+974 5512 8493',
      deliveryZone: userProfile.healthCenter ? userProfile.healthCenter.split(' ')[0] : 'Al Sadd',
      deliveryAddress,
      specialNotes,
      selectedMods,
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedDeliveryTime: '25-30 mins',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveKitchenOrder(newOrder);
    persistKitchenOrder(newOrder);

    // Record this ordered meal automatically in user's recorded meals history
    const hour = new Date().getHours();
    const autoType: MealType =
      hour >= 5 && hour < 11
        ? 'breakfast'
        : hour >= 11 && hour < 16
        ? 'lunch'
        : hour >= 16 && hour < 21
        ? 'dinner'
        : 'snack';

    const loggedMeal: RecordedMeal = {
      id: 'meal-ord-' + Date.now(),
      name: meal.name.en,
      nameAr: meal.name.ar,
      mealType: autoType,
      takenAt: new Date().toISOString(),
      displayTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      displayDate: 'Today',
      sugarGrams: meal.sugarGrams,
      addedSugarGrams: meal.addedSugarGrams,
      carbsGrams: meal.carbsGrams,
      proteinGrams: meal.proteinGrams,
      calories: meal.calories,
      spikeRisk: meal.glycemicImpact === 'LOW' ? 'LOW' : 'MEDIUM',
      glucoseAtMeal: currentSugarLevel,
      glucoseTiming: 'post_meal',
      imageUrl: meal.imageUrl,
      source: 'kitchen_order',
      notes: `Ordered from ${meal.deliveryKitchenName.en}`,
    };
    setRecordedMeals((prev) => [loggedMeal, ...prev]);
    persistRecordedMeal(loggedMeal);

    // Simulate progress in kitchen
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) => (o.id === newOrder.id ? { ...o, status: 'preparing' } : o))
      );
      setActiveKitchenOrder((prev) => (prev?.id === newOrder.id ? { ...prev, status: 'preparing' } : prev));
    }, 4000);

    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) => (o.id === newOrder.id ? { ...o, status: 'on_the_way' } : o))
      );
      setActiveKitchenOrder((prev) => (prev?.id === newOrder.id ? { ...prev, status: 'on_the_way' } : prev));
    }, 9000);

    return newOrder;
  };

  // Smart Basket State
  const [basket, setBasket] = useState<BasketItem[]>(() => {
    const saved = localStorage.getItem('glucocoach_basket');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Initial seeded basket: Baladna Strawberry Yogurt (High) + Rainbow Condensed Milk (High) + Lulu White Bread (High)
    return [
      { product: QATAR_SUPERMARKET_PRODUCTS[0], quantity: 2, addedAt: new Date().toISOString() },
      { product: QATAR_SUPERMARKET_PRODUCTS[4], quantity: 1, addedAt: new Date().toISOString() },
      { product: QATAR_SUPERMARKET_PRODUCTS[2], quantity: 1, addedAt: new Date().toISOString() },
    ];
  });

  useEffect(() => {
    localStorage.setItem('glucocoach_basket', JSON.stringify(basket));
  }, [basket]);

  const addToBasket = (product: FoodProduct, quantity = 1) => {
    setBasket((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [{ product, quantity, addedAt: new Date().toISOString() }, ...prev];
    });
  };

  const removeFromBasket = (productId: string) => {
    setBasket((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearBasket = () => {
    setBasket([]);
  };

  // Replace High Glucose items in basket with their healthier local alternatives
  const applySmartSwaps = () => {
    setBasket((prev) => {
      return prev.map((item) => {
        if (item.product.trafficLight === 'HIGH') {
          // If product is strawberry yogurt -> swap to Baladna Fresh Laban (or wholewheat bread)
          if (item.product.id === 'prod-baladna-strawberry-yogurt') {
            const laban = QATAR_SUPERMARKET_PRODUCTS.find((p) => p.id === 'prod-baladna-fresh-laban');
            if (laban) return { product: laban, quantity: item.quantity, addedAt: new Date().toISOString() };
          }
          if (item.product.id === 'prod-lulu-white-khubz') {
            const wholewheat = QATAR_SUPERMARKET_PRODUCTS.find((p) => p.id === 'prod-almeera-wholewheat-bread');
            if (wholewheat) return { product: wholewheat, quantity: item.quantity, addedAt: new Date().toISOString() };
          }
          if (item.product.id === 'prod-rainbow-karak-condensed') {
            const laban = QATAR_SUPERMARKET_PRODUCTS.find((p) => p.id === 'prod-baladna-fresh-laban');
            if (laban) return { product: laban, quantity: item.quantity, addedAt: new Date().toISOString() };
          }
        }
        return item;
      });
    });
  };

  // Basket Metrics
  const totalBasketSugars = Math.round(
    basket.reduce((sum, item) => sum + item.product.nutrition.addedSugars * item.quantity, 0)
  );

  const totalBasketCarbs = Math.round(
    basket.reduce((sum, item) => sum + item.product.nutrition.carbs * item.quantity, 0)
  );

  const weeklySugarLimit = 175; // 25g/day * 7 days (WHO recommendation)
  const isSugarLimitExceeded = totalBasketSugars > 50; // trigger basket warning if scanned trip has > 50g added sugars

  // Daily Check-Ins & Heart Guard
  const [dailyCheckIns, setDailyCheckIns] = useState<DailyCheckIn[]>(() => {
    const saved = localStorage.getItem('glucocoach_checkins');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialCheckIns;
  });

  useEffect(() => {
    localStorage.setItem('glucocoach_checkins', JSON.stringify(dailyCheckIns));
  }, [dailyCheckIns]);

  // Yesterday's sugar / glucose level (defaults to second record in checkins or 122 mg/dL)
  const [yesterdayGlucose, setYesterdayGlucose] = useState<number>(() => {
    const saved = localStorage.getItem('glucocoach_yesterday_glucose');
    if (saved) return Number(saved);
    if (dailyCheckIns.length > 1 && dailyCheckIns[1].glucoseLevel) {
      return dailyCheckIns[1].glucoseLevel;
    }
    return 122;
  });

  const handleSetYesterdayGlucose = (val: number) => {
    setYesterdayGlucose(val);
    localStorage.setItem('glucocoach_yesterday_glucose', String(val));
  };

  // Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('glucocoach_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return defaultProfile;
  });

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('glucocoach_profile', JSON.stringify(next));
      persistUserProfile(next);
      return next;
    });
  };

  // Wearable simulated metrics
  const [wearableSynced, setWearableSynced] = useState(false);
  const [todayRestingHr, setTodayRestingHr] = useState(67);
  const [todaySteps, setTodaySteps] = useState(6480);
  const [todaySleepHours, setTodaySleepHours] = useState(7.1);

  const syncWearable = () => {
    setWearableSynced(true);
    // generate slight realistic variation
    setTodayRestingHr(66);
    setTodaySteps(8340);
    setTodaySleepHours(7.4);
  };

  // Emergency Triage Modals
  const [isRedAlertOpen, setRedAlertOpen] = useState(false);
  const [isAmberAlertOpen, setAmberAlertOpen] = useState(false);

  const triggerRedEmergency = () => {
    setRedAlertOpen(true);
  };

  // Evaluate current Triage Level
  const latestCheckIn = dailyCheckIns[0];

  const calculateTriage = (checkIns: DailyCheckIn[]): TriageLevel => {
    if (checkIns.length === 0) return 'GREEN';
    const latest = checkIns[0];

    // Check for RED FLAG symptoms
    const redSymptoms = [
      latest.symptoms.chestTightness,
      latest.symptoms.shortnessOfBreath,
      latest.symptoms.numbnessShoulderJaw,
      latest.symptoms.coldSweat,
      latest.symptoms.dizzinessFainting,
    ];
    if (redSymptoms.some(Boolean)) {
      return 'RED';
    }

    // Check for AMBER (persistent high glucose or multiple high readings)
    const recentHighGlucose = checkIns.slice(0, 3).filter((c) => (c.glucoseLevel || 0) > 180);
    const hasUnusualFatigue = latest.symptoms.unusualFatigue || latest.symptoms.legSwelling;
    const veryHighSingle = (latest.glucoseLevel || 0) >= 220;

    if (recentHighGlucose.length >= 2 || veryHighSingle || hasUnusualFatigue) {
      return 'AMBER';
    }

    return 'GREEN';
  };

  const triageStatus = calculateTriage(dailyCheckIns);

  const addCheckIn = (checkIn: Omit<DailyCheckIn, 'id'>): TriageLevel => {
    const isRed =
      checkIn.symptoms.chestTightness ||
      checkIn.symptoms.shortnessOfBreath ||
      checkIn.symptoms.numbnessShoulderJaw ||
      checkIn.symptoms.coldSweat ||
      checkIn.symptoms.dizzinessFainting;

    const level: TriageLevel = isRed
      ? 'RED'
      : (checkIn.glucoseLevel && checkIn.glucoseLevel > 180) || checkIn.symptoms.unusualFatigue
      ? 'AMBER'
      : 'GREEN';

    const newRecord: DailyCheckIn = {
      ...checkIn,
      id: 'chk-' + Date.now(),
      triageLevel: level,
    };

    setDailyCheckIns((prev) => [newRecord, ...prev]);
    persistBloodSugarLog(newRecord);

    if (checkIn.glucoseLevel) {
      setCurrentSugarLevel(checkIn.glucoseLevel);
    }

    if (level === 'RED') {
      setRedAlertOpen(true);
    } else if (level === 'AMBER') {
      setAmberAlertOpen(true);
    }

    return level;
  };

  const exportDatabase = () => {
    return exportDatabaseBackup(userProfile, recordedMeals, dailyCheckIns, orders);
  };

  const emergencyLocation = {
    lat: 25.286106,
    lng: 51.534817,
    address: 'Near Al Corniche / West Bay, Doha, State of Qatar (25.2861° N, 51.5348° E)',
  };

  const t = translations[lang];

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t,
        unit,
        setUnit,
        formatGlucose,
        activeTab,
        setActiveTab,
        recordedMeals,
        recordMeal,
        deleteRecordedMeal,
        lastRecordedMeal,
        currentSugarLevel,
        setCurrentSugarLevel,
        nextMealSuggestion,
        isMealLoggerOpen,
        setIsMealLoggerOpen,
        orders,
        placeKitchenOrder,
        activeKitchenOrder,
        setActiveKitchenOrder,
        selectedMealForOrder,
        setSelectedMealForOrder,
        openOrderModalForMeal,
        isOrderModalOpen,
        setIsOrderModalOpen,
        basket,
        addToBasket,
        removeFromBasket,
        clearBasket,
        applySmartSwaps,
        totalBasketSugars,
        totalBasketCarbs,
        weeklySugarLimit,
        isSugarLimitExceeded,
        dailyCheckIns,
        addCheckIn,
        triageStatus,
        latestCheckIn,
        yesterdayGlucose,
        setYesterdayGlucose: handleSetYesterdayGlucose,
        wearableSynced,
        syncWearable,
        todayRestingHr,
        todaySteps,
        todaySleepHours,
        isRedAlertOpen,
        setRedAlertOpen,
        isAmberAlertOpen,
        setAmberAlertOpen,
        triggerRedEmergency,
        emergencyLocation,
        userProfile,
        updateUserProfile,
        databaseConnected,
        exportDatabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
