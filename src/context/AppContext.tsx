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
  PersonalizedNextMealPlan,
  MealType,
  QatarFoodProvider,
  AutoMealOrderConfig,
  HighSugarAlarmInfo,
  AppAuthUser,
} from '../types';
import { QATAR_SUPERMARKET_PRODUCTS } from '../data/qatarProducts';
import { QATAR_HEALTHY_MEALS, DUMMY_QATAR_FOOD_PROVIDERS } from '../data/qatarKitchens';
import { translations } from '../data/translations';
import { generateNextMealSuggestion, generatePersonalizedNextMealPlan } from '../services/nextMealEngine';
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
import {
  auth,
  loginWithGooglePopup,
  loginWithEmailPassword,
  registerWithEmailPassword,
  logoutFirebase,
  onAuthChange,
  ensureAuthenticatedUser,
} from '../services/firebase';

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

  // Patient Portal & Authentication
  currentUser: AppAuthUser | null;
  isAuthLoading: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, patientName: string) => Promise<void>;
  loginWithQatarHealthId: (
    qatarId: string,
    healthCardNumber: string,
    patientName?: string,
    diabeticStatus?: 'pre-diabetes' | 'type-2' | 'preventative' | 'type-1'
  ) => Promise<void>;
  loginAsDemoPatient: (profileKey: 'salem' | 'fatima' | 'dr_tariq') => Promise<void>;
  logout: () => Promise<void>;

  // Meal Recording & Next Meal Suggestion Engine
  recordedMeals: RecordedMeal[];
  recordMeal: (mealData: Partial<RecordedMeal> & { name: string; sugarGrams: number }) => RecordedMeal;
  deleteRecordedMeal: (id: string) => void;
  lastRecordedMeal?: RecordedMeal;
  currentSugarLevel: number;
  setCurrentSugarLevel: (val: number) => void;
  nextMealSuggestion: NextMealSuggestion;
  nextMealPlan: PersonalizedNextMealPlan;
  todaySugarIntake: number;
  remainingSugarBudget: number;
  isMealLoggerOpen: boolean;
  setIsMealLoggerOpen: (open: boolean) => void;
  
  // Qatari Kitchens & Food Orders & Dummy Qatar Providers
  orders: KitchenFoodOrder[];
  foodProviders: QatarFoodProvider[];
  placeKitchenOrder: (
    meal: KitchenMealItem,
    quantity?: number,
    selectedMods?: string[],
    deliveryAddress?: string,
    specialNotes?: string,
    providerId?: string
  ) => KitchenFoodOrder;
  activeKitchenOrder: KitchenFoodOrder | null;
  setActiveKitchenOrder: (order: KitchenFoodOrder | null) => void;
  selectedMealForOrder: KitchenMealItem | null;
  setSelectedMealForOrder: (meal: KitchenMealItem | null) => void;
  openOrderModalForMeal: (meal: KitchenMealItem) => void;
  isOrderModalOpen: boolean;
  setIsOrderModalOpen: (open: boolean) => void;

  // Automated On-Time Meal Ordering
  autoMealOrderConfig: AutoMealOrderConfig;
  updateAutoMealOrderConfig: (config: Partial<AutoMealOrderConfig>) => void;
  triggerAutoMealOrderNow: (mealType?: MealType) => KitchenFoodOrder;

  // High Sugar Health Monitor & Clinic Alarm
  isHighSugarAlarmOpen: boolean;
  setIsHighSugarAlarmOpen: (open: boolean) => void;
  highSugarAlarmInfo: HighSugarAlarmInfo | null;
  triggerHighSugarAlarm: (glucoseVal: number) => void;
  
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

  // Mobile App View Simulator Mode
  isMobileSimulator: boolean;
  setIsMobileSimulator: (val: boolean) => void;
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
    takenAt: '2026-10-10T08:45:00.000Z',
    displayTime: '08:45 AM',
    displayDate: 'Oct 10',
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
    name: 'Grilled Mazzraty Chicken Breast with Tabbouleh',
    nameAr: 'صدر دجاج مزرعتي مشوي مع تبولة بزيت الزيتون',
    mealType: 'lunch',
    takenAt: '2026-10-10T13:15:00.000Z',
    displayTime: '01:15 PM',
    displayDate: 'Oct 10',
    sugarGrams: 1.5,
    addedSugarGrams: 0,
    carbsGrams: 14,
    proteinGrams: 42,
    calories: 390,
    spikeRisk: 'LOW',
    glucoseAtMeal: 122,
    glucoseTiming: 'post_meal',
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=500&q=80',
    source: 'kitchen_order',
    notes: 'High fiber, zero added sugar, flat post-prandial response',
  },
  {
    id: 'meal-rec-3',
    name: 'Low-fat Baladna Labneh with Cucumbers & Mint',
    nameAr: 'لبنة بلدنا قليلة الدسم مع خيار ونعناع وزيت زيتون',
    mealType: 'breakfast',
    takenAt: '2026-10-09T08:30:00.000Z',
    displayTime: '08:30 AM',
    displayDate: 'Oct 09',
    sugarGrams: 3.5,
    addedSugarGrams: 0,
    carbsGrams: 8,
    proteinGrams: 14,
    calories: 220,
    spikeRisk: 'LOW',
    glucoseAtMeal: 104,
    glucoseTiming: 'fasting',
    imageUrl: 'https://images.unsplash.com/photo-1505253758473-96b3d5ebcd96?auto=format&fit=crop&w=500&q=80',
    source: 'quick_log',
    notes: 'Natural lactose only, zero added sucrose',
  },
  {
    id: 'meal-rec-4',
    name: 'Bandar Aden Grilled Sea Bass with Lemon Daqoos',
    nameAr: 'سيباس مشوي مع دقوس بالليمون وسلطة جرجير',
    mealType: 'dinner',
    takenAt: '2026-10-09T20:15:00.000Z',
    displayTime: '08:15 PM',
    displayDate: 'Oct 09',
    sugarGrams: 0.5,
    addedSugarGrams: 0,
    carbsGrams: 5,
    proteinGrams: 44,
    calories: 380,
    spikeRisk: 'LOW',
    glucoseAtMeal: 135,
    glucoseTiming: 'post_meal',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&q=80',
    source: 'kitchen_order',
    notes: 'Zero rice protocol from Souq Waqif, optimal glycemic control',
  },
  {
    id: 'meal-rec-5',
    name: 'Boiled Farm Eggs with Sliced Avocado & Thyme',
    nameAr: 'بيض مزارع مسلوق مع أفوكادو وزعتر بري',
    mealType: 'breakfast',
    takenAt: '2026-10-08T08:00:00.000Z',
    displayTime: '08:00 AM',
    displayDate: 'Oct 08',
    sugarGrams: 0.8,
    addedSugarGrams: 0,
    carbsGrams: 4,
    proteinGrams: 18,
    calories: 280,
    spikeRisk: 'LOW',
    glucoseAtMeal: 106,
    glucoseTiming: 'fasting',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500&q=80',
    source: 'ai_photo',
    notes: 'High monounsaturated healthy fats, minimal insulin demand',
  },
  {
    id: 'meal-rec-6',
    name: 'Steamed Gulf Hamour with Sautéed Broccoli & Cumin',
    nameAr: 'فيليه هامور خليجي بالبخار مع بروكلي سوتيه وكمون',
    mealType: 'dinner',
    takenAt: '2026-10-08T19:30:00.000Z',
    displayTime: '07:30 PM',
    displayDate: 'Oct 08',
    sugarGrams: 2.2,
    addedSugarGrams: 0,
    carbsGrams: 12,
    proteinGrams: 40,
    calories: 360,
    spikeRisk: 'LOW',
    glucoseAtMeal: 118,
    glucoseTiming: 'post_meal',
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=500&q=80',
    source: 'kitchen_order',
    notes: 'Portion controlled, 0g added sugar',
  },
  {
    id: 'meal-rec-7',
    name: 'Foul Mudammas with Olive Oil, Lemon & Parsley',
    nameAr: 'فول مدمس بزيت الزيتون والليمون والبقدونس',
    mealType: 'breakfast',
    takenAt: '2026-10-07T08:30:00.000Z',
    displayTime: '08:30 AM',
    displayDate: 'Oct 07',
    sugarGrams: 2.0,
    addedSugarGrams: 0,
    carbsGrams: 28,
    proteinGrams: 16,
    calories: 310,
    spikeRisk: 'LOW',
    glucoseAtMeal: 128,
    glucoseTiming: 'fasting',
    imageUrl: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=500&q=80',
    source: 'quick_log',
    notes: 'High dietary fiber blunts morning fasting response',
  },
  {
    id: 'meal-rec-8',
    name: 'Grilled Lamb Chops with Sumac & Crisp Garden Salad',
    nameAr: 'ريش لحم مشوية بالسماق مع سلطة خضراء',
    mealType: 'dinner',
    takenAt: '2026-10-07T20:00:00.000Z',
    displayTime: '08:00 PM',
    displayDate: 'Oct 07',
    sugarGrams: 1.2,
    addedSugarGrams: 0,
    carbsGrams: 6,
    proteinGrams: 36,
    calories: 450,
    spikeRisk: 'MEDIUM',
    glucoseAtMeal: 145,
    glucoseTiming: 'post_meal',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    source: 'kitchen_order',
    notes: 'Lean protein dinner, moderate satiety',
  },
  {
    id: 'meal-rec-9',
    name: 'Sweetened Cardamom Karak with Condensed Milk',
    nameAr: 'كرك قطري محلى بحليب مكثف وهيل',
    mealType: 'snack',
    takenAt: '2026-10-06T16:30:00.000Z',
    displayTime: '04:30 PM',
    displayDate: 'Oct 06',
    sugarGrams: 22.0,
    addedSugarGrams: 20.0,
    carbsGrams: 24,
    proteinGrams: 4,
    calories: 210,
    spikeRisk: 'HIGH',
    glucoseAtMeal: 160,
    glucoseTiming: 'post_meal',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80',
    source: 'ai_photo',
    notes: 'Friday Majlis hospitality: high sucrose and condensed milk spike',
  },
  {
    id: 'meal-rec-10',
    name: 'Traditional Chicken Machboos & Luqaimat in Date Syrup',
    nameAr: 'مجبوس دجاج تقليدي مع لقيمات مقرمشة بدبس التمر',
    mealType: 'dinner',
    takenAt: '2026-10-06T20:30:00.000Z',
    displayTime: '08:30 PM',
    displayDate: 'Oct 06',
    sugarGrams: 26.0,
    addedSugarGrams: 18.0,
    carbsGrams: 98,
    proteinGrams: 30,
    calories: 820,
    spikeRisk: 'HIGH',
    glucoseAtMeal: 195,
    glucoseTiming: 'post_meal',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80',
    source: 'ai_photo',
    notes: 'Friday Banquet: High glycemic load + date molasses triggered 195 spike',
  },
  {
    id: 'meal-rec-11',
    name: 'Baladna Grilled Halloumi with Fresh Tomatoes & Rocca',
    nameAr: 'حلوم بلدنا مشوي مع طماطم وجرجير طازج',
    mealType: 'breakfast',
    takenAt: '2026-10-05T08:15:00.000Z',
    displayTime: '08:15 AM',
    displayDate: 'Oct 05',
    sugarGrams: 1.8,
    addedSugarGrams: 0,
    carbsGrams: 4,
    proteinGrams: 22,
    calories: 310,
    spikeRisk: 'LOW',
    glucoseAtMeal: 108,
    glucoseTiming: 'fasting',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=500&q=80',
    source: 'quick_log',
    notes: 'Zero added sugar, calm fasting baseline',
  },
  {
    id: 'meal-rec-12',
    name: 'Charcoal Shish Tawook with Roasted Garlic & Green Peppers',
    nameAr: 'شيش طاووق على الفحم مع ثومية مشوية وفلفل أخضر',
    mealType: 'lunch',
    takenAt: '2026-10-05T13:45:00.000Z',
    displayTime: '01:45 PM',
    displayDate: 'Oct 05',
    sugarGrams: 2.5,
    addedSugarGrams: 0,
    carbsGrams: 10,
    proteinGrams: 40,
    calories: 410,
    spikeRisk: 'MEDIUM',
    glucoseAtMeal: 142,
    glucoseTiming: 'post_meal',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80',
    source: 'kitchen_order',
    notes: 'High protein lean poultry, mild elevation',
  },
  {
    id: 'meal-rec-13',
    name: 'Organic Scrambled Eggs with Spinach & Unsweetened Laban',
    nameAr: 'بيض مخفوق عضوي مع سبانخ ولبن خالي الدسم بدون سكر',
    mealType: 'breakfast',
    takenAt: '2026-10-04T08:30:00.000Z',
    displayTime: '08:30 AM',
    displayDate: 'Oct 04',
    sugarGrams: 4.0,
    addedSugarGrams: 0,
    carbsGrams: 8,
    proteinGrams: 24,
    calories: 320,
    spikeRisk: 'LOW',
    glucoseAtMeal: 102,
    glucoseTiming: 'fasting',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500&q=80',
    source: 'ai_photo',
    notes: 'Balanced micronutrients and flat glycemic start',
  },
  {
    id: 'meal-rec-14',
    name: 'Bandar Aden Charcoal Kingfish with Tomato Daqoos',
    nameAr: 'كنعد مشوي على الفحم مع دقوس طماطم وأعشاب',
    mealType: 'dinner',
    takenAt: '2026-10-04T19:45:00.000Z',
    displayTime: '07:45 PM',
    displayDate: 'Oct 04',
    sugarGrams: 0.8,
    addedSugarGrams: 0,
    carbsGrams: 6,
    proteinGrams: 45,
    calories: 420,
    spikeRisk: 'LOW',
    glucoseAtMeal: 138,
    glucoseTiming: 'post_meal',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&q=80',
    source: 'kitchen_order',
    notes: 'Rich in Omega-3 fatty acids, excellent cardiovascular profile',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language & Direction (Arabic & English Only)
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('glucocoach_lang');
    return saved === 'ar' ? 'ar' : 'en';
  });

  const setLang = (newLang: Language) => {
    const sanitizedLang: Language = newLang === 'ar' ? 'ar' : 'en';
    setLangState(sanitizedLang);
    localStorage.setItem('glucocoach_lang', sanitizedLang);
  };

  const toggleLang = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
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
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 7) {
          return parsed;
        }
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

  // High Sugar Health Monitor & Clinic Alarm State
  const [isHighSugarAlarmOpen, setIsHighSugarAlarmOpen] = useState(false);
  const [highSugarAlarmInfo, setHighSugarAlarmInfo] = useState<HighSugarAlarmInfo | null>(null);

  const triggerHighSugarAlarm = (glucoseVal: number) => {
    const isCritical = glucoseVal >= 250;
    const info: HighSugarAlarmInfo = {
      glucose: glucoseVal,
      consecutiveHighCount: 2,
      isPersistent: true,
      clinicName: defaultProfile.healthCenter || 'Al Sadd Primary Health Care Center (PHCC)',
      clinicPhone: '+974 4492 4222',
      doctorName: defaultProfile.primaryDoctor || 'Dr. Fatima Al-Sulaiti (Endocrinology)',
      severity: isCritical ? 'CRITICAL' : 'WARNING',
      suggestedAction: {
        en: 'Drink 500mL pure water, eat an on-time zero-sugar stabilizer meal, and contact your PHCC doctor immediately.',
        ar: 'اشرب نصف لتر ماء فوراً، وتناول وجبة صحية خالية من السكر في موعدها، وتواصل مع طبيبك في المركز الصحي.',
      },
    };
    setHighSugarAlarmInfo(info);
    setIsHighSugarAlarmOpen(true);
  };

  const setCurrentSugarLevel = (val: number) => {
    setCurrentSugarLevelState(val);
    localStorage.setItem('glucocoach_current_glucose', String(val));
    if (val >= 180) {
      triggerHighSugarAlarm(val);
    }
  };

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

const DEMO_PATIENTS: Record<'salem' | 'fatima' | 'dr_tariq', { profile: UserProfile; auth: AppAuthUser }> = {
  salem: {
    profile: defaultProfile,
    auth: {
      uid: 'patient-salem-28963401294',
      displayName: 'Salem Al-Kuwari',
      email: 'salem.alkuwari@health.qa',
      qatarId: '28963401294',
      healthCardNumber: 'HC-9923841',
      patientType: 'pre-diabetes',
      loginProvider: 'qatar_health',
    },
  },
  fatima: {
    profile: {
      name: 'Fatima Al-Sulaiti',
      qatarId: '29263408192',
      healthCardNumber: 'HC-8812490',
      dob: '1984-11-23',
      bloodType: 'B+',
      diabeticStatus: 'type-2',
      targetDailyAddedSugar: 18,
      targetDailyCarbs: 100,
      medications: ['Metformin 850mg (2x daily)', 'Empagliflozin 10mg (morning)'],
      allergies: ['Sulfonamides'],
      primaryDoctor: 'Dr. Tariq Al-Kuwari (Hamad Endocrine Division)',
      healthCenter: 'Rawdat Al Khail Health Center (PHCC)',
      emergencyContact: {
        name: 'Abdullah Al-Sulaiti (Husband)',
        relationship: 'Husband',
        phone: '+974 6623 9102',
        notifyOnAmber: true,
      },
      chronicConditions: ['Type 2 Diabetes', 'Microalbuminuria (Monitored)'],
      emergencyNotes: '999 Protocol: Continuous glucose sensor active on left arm. Carries glucagon nasal spray in handbag.',
      preferredHospital: 'Hamad General Hospital - Emergency Department (Doha)',
      insulinDependent: false,
      resuscitationPreference: 'FULL_CODE',
    },
    auth: {
      uid: 'patient-fatima-29263408192',
      displayName: 'Fatima Al-Sulaiti',
      email: 'fatima.alsulaiti@health.qa',
      qatarId: '29263408192',
      healthCardNumber: 'HC-8812490',
      patientType: 'type-2',
      loginProvider: 'qatar_health',
    },
  },
  dr_tariq: {
    profile: {
      name: 'Dr. Tariq Al-Kuwari',
      qatarId: '28063405521',
      healthCardNumber: 'HMC-84920',
      dob: '1980-02-14',
      bloodType: 'A+',
      diabeticStatus: 'preventative',
      targetDailyAddedSugar: 30,
      targetDailyCarbs: 150,
      medications: ['Multivitamins'],
      allergies: ['None'],
      primaryDoctor: 'HMC Senior Consultant Staff',
      healthCenter: 'Hamad General Hospital - Diabetes & Endocrine Center',
      emergencyContact: {
        name: 'HMC Medical Staff Operations',
        relationship: 'Colleague',
        phone: '+974 4439 2222',
        notifyOnAmber: true,
      },
      chronicConditions: ['Preventative Health / HMC Clinician Protocol'],
      emergencyNotes: 'HMC Senior Staff & Emergency Medical Supervisor ID: HMC-84920.',
      preferredHospital: 'Hamad General Hospital - Trauma & Emergency Center',
      insulinDependent: false,
      resuscitationPreference: 'FULL_CODE',
    },
    auth: {
      uid: 'staff-tariq-28063405521',
      displayName: 'Dr. Tariq Al-Kuwari',
      email: 'tariq.alkuwari@hamad.qa',
      qatarId: '28063405521',
      healthCardNumber: 'HMC-84920',
      patientType: 'preventative',
      loginProvider: 'qatar_health',
    },
  },
};

  // Patient Portal & Authentication State
  const [currentUser, setCurrentUser] = useState<AppAuthUser | null>(() => {
    const saved = localStorage.getItem('glucocoach_current_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEMO_PATIENTS.salem.auth;
  });
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Sync Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((fbUser) => {
      if (fbUser && !fbUser.isAnonymous) {
        const authUser: AppAuthUser = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || 'Patient',
          photoURL: fbUser.photoURL,
          isAnonymous: fbUser.isAnonymous,
          loginProvider: 'google',
          qatarId: userProfile.qatarId,
          healthCardNumber: userProfile.healthCardNumber,
          patientType: userProfile.diabeticStatus,
        };
        setCurrentUser(authUser);
        localStorage.setItem('glucocoach_current_auth_user', JSON.stringify(authUser));
      }
    });
    return () => unsubscribe();
  }, [userProfile.qatarId, userProfile.healthCardNumber, userProfile.diabeticStatus]);

  const loginWithGoogle = async () => {
    setIsAuthLoading(true);
    try {
      const fbUser = await loginWithGooglePopup();
      const authUser: AppAuthUser = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || 'Patient',
        photoURL: fbUser.photoURL,
        isAnonymous: false,
        loginProvider: 'google',
        qatarId: userProfile.qatarId,
        healthCardNumber: userProfile.healthCardNumber,
        patientType: userProfile.diabeticStatus,
      };
      setCurrentUser(authUser);
      localStorage.setItem('glucocoach_current_auth_user', JSON.stringify(authUser));
      if (fbUser.displayName) {
        updateUserProfile({ name: fbUser.displayName });
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setIsAuthLoading(true);
    try {
      const fbUser = await loginWithEmailPassword(email, pass);
      const authUser: AppAuthUser = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || email.split('@')[0],
        isAnonymous: false,
        loginProvider: 'email',
        qatarId: userProfile.qatarId,
        healthCardNumber: userProfile.healthCardNumber,
        patientType: userProfile.diabeticStatus,
      };
      setCurrentUser(authUser);
      localStorage.setItem('glucocoach_current_auth_user', JSON.stringify(authUser));
    } finally {
      setIsAuthLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string, patientName: string) => {
    setIsAuthLoading(true);
    try {
      const fbUser = await registerWithEmailPassword(email, pass, patientName);
      const authUser: AppAuthUser = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: patientName || email.split('@')[0],
        isAnonymous: false,
        loginProvider: 'email',
        qatarId: userProfile.qatarId,
        healthCardNumber: userProfile.healthCardNumber,
        patientType: userProfile.diabeticStatus,
      };
      setCurrentUser(authUser);
      localStorage.setItem('glucocoach_current_auth_user', JSON.stringify(authUser));
      if (patientName) {
        updateUserProfile({ name: patientName });
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const loginWithQatarHealthId = async (
    qatarId: string,
    healthCardNumber: string,
    patientName?: string,
    diabeticStatus?: 'pre-diabetes' | 'type-2' | 'preventative' | 'type-1'
  ) => {
    setIsAuthLoading(true);
    try {
      await ensureAuthenticatedUser();
      const displayName = patientName || userProfile.name || 'Salem Al-Kuwari';
      const authUser: AppAuthUser = {
        uid: 'patient-' + qatarId,
        email: `${qatarId}@health.gov.qa`,
        displayName,
        qatarId,
        healthCardNumber,
        patientType: diabeticStatus || userProfile.diabeticStatus,
        loginProvider: 'qatar_health',
      };
      setCurrentUser(authUser);
      localStorage.setItem('glucocoach_current_auth_user', JSON.stringify(authUser));
      updateUserProfile({
        name: displayName,
        qatarId,
        healthCardNumber,
        ...(diabeticStatus ? { diabeticStatus } : {}),
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const loginAsDemoPatient = async (profileKey: 'salem' | 'fatima' | 'dr_tariq') => {
    setIsAuthLoading(true);
    try {
      const demo = DEMO_PATIENTS[profileKey];
      if (demo) {
        setUserProfile(demo.profile);
        localStorage.setItem('glucocoach_profile', JSON.stringify(demo.profile));
        setCurrentUser(demo.auth);
        localStorage.setItem('glucocoach_current_auth_user', JSON.stringify(demo.auth));
        persistUserProfile(demo.profile);
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    setIsAuthLoading(true);
    try {
      await logoutFirebase();
      setCurrentUser(null);
      localStorage.removeItem('glucocoach_current_auth_user');
    } finally {
      setIsAuthLoading(false);
    }
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
  const [isMobileSimulator, setIsMobileSimulator] = useState<boolean>(false);

  const lastRecordedMeal = recordedMeals[0];

  // Today's cumulative sugar intake computed across recorded meals
  const todayIso = new Date().toISOString().slice(0, 10);
  const todayRecordedMeals = useMemo(() => {
    return recordedMeals.filter(
      (m) => m.displayDate === 'Today' || (m.takenAt && m.takenAt.startsWith(todayIso))
    );
  }, [recordedMeals, todayIso]);

  const todaySugarIntake = useMemo(() => {
    return Math.round(
      todayRecordedMeals.reduce((sum, m) => sum + (m.sugarGrams || 0), 0) * 10
    ) / 10;
  }, [todayRecordedMeals]);

  const remainingSugarBudget = useMemo(() => {
    const target = userProfile?.targetDailyAddedSugar || 25;
    return Math.max(0, Math.round((target - todaySugarIntake) * 10) / 10);
  }, [userProfile?.targetDailyAddedSugar, todaySugarIntake]);

  // Dynamic clinical suggestion for NEXT meal based on historical meals, daily check-ins, and last logged glucose level
  const nextMealPlan = useMemo(() => {
    return generatePersonalizedNextMealPlan({
      historicalMeals: recordedMeals,
      historicalCheckIns: dailyCheckIns,
      currentSugarLevel,
      userProfile,
    });
  }, [recordedMeals, dailyCheckIns, currentSugarLevel, userProfile]);

  const nextMealSuggestion = nextMealPlan.primarySuggestion;

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
    const safeSugar = Math.max(0, Number(mealData.sugarGrams || 0));
    const safeCarbs = Math.max(safeSugar, Number(mealData.carbsGrams || 0));

    const newMeal: RecordedMeal = {
      id: 'meal-' + Date.now(),
      name: mealData.name,
      nameAr: mealData.nameAr || mealData.name,
      mealType: mealData.mealType || autoType,
      takenAt: mealData.takenAt || now.toISOString(),
      displayTime: mealData.displayTime || timeStr,
      displayDate: mealData.displayDate || 'Today',
      sugarGrams: safeSugar,
      addedSugarGrams: Number(mealData.addedSugarGrams ?? (safeSugar > 4 ? safeSugar - 2 : 0)),
      teaspoons: mealData.teaspoons ?? Number((safeSugar / 4.2).toFixed(1)),
      sugarCubes: mealData.sugarCubes ?? Number((safeSugar / 4.0).toFixed(1)),
      carbsGrams: safeCarbs,
      proteinGrams: Number(mealData.proteinGrams || 0),
      calories: Number(mealData.calories || 0),
      spikeRisk:
        mealData.spikeRisk ||
        (safeSugar > 12 ? 'HIGH' : safeSugar > 4 ? 'MEDIUM' : 'LOW'),
      predominantSugarType: mealData.predominantSugarType || 'sucrose',
      pubchemCid: mealData.pubchemCid || (mealData.predominantSugarType === 'fructose' ? 5984 : mealData.predominantSugarType === 'glucose' ? 5793 : 5988),
      glycemicIndex: mealData.glycemicIndex || 65,
      glycemicLoad: mealData.glycemicLoad ?? Number(((65 * safeCarbs) / 100).toFixed(1)),
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
    specialNotes = '',
    providerId?: string
  ): KitchenFoodOrder => {
    const matchedProvider = providerId
      ? DUMMY_QATAR_FOOD_PROVIDERS.find((p) => p.id === providerId)
      : DUMMY_QATAR_FOOD_PROVIDERS[0];

    const providerFee = matchedProvider ? matchedProvider.deliveryFeeQAR : 10;
    const providerName = matchedProvider ? matchedProvider.name.en : 'Talabat Qatar';

    const newOrder: KitchenFoodOrder = {
      id: 'ord-' + Date.now(),
      meal,
      quantity,
      totalQAR: meal.priceQAR * quantity + providerFee,
      status: 'confirmed',
      customerName: userProfile.name || 'Salem Al-Kuwari',
      customerPhone: userProfile.emergencyContact?.phone || '+974 5512 8493',
      deliveryZone: userProfile.healthCenter ? userProfile.healthCenter.split(' ')[0] : 'Al Sadd',
      deliveryAddress,
      specialNotes,
      selectedMods,
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedDeliveryTime: `${matchedProvider?.deliveryTimeMin || 25} mins (${providerName})`,
      providerId: matchedProvider?.id || 'provider-talabat',
      providerName,
      isAutomated: false,
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
      notes: `Ordered on time via ${providerName} (${meal.deliveryKitchenName.en})`,
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

  // Automated On-Time Meal Order Configuration
  const [autoMealOrderConfig, setAutoMealOrderConfigState] = useState<AutoMealOrderConfig>(() => {
    const saved = localStorage.getItem('glucocoach_auto_meal_order');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      enabled: false,
      preferredProviderId: 'provider-talabat',
      lunchTime: '12:30',
      dinnerTime: '19:00',
      maxSugarGramsPerMeal: 5,
      autoConfirmWithoutPrompt: false,
      deliveryAddress: 'Building 14, St 840, Al Sadd, Doha',
      deliveryZone: 'Al Sadd, Zone 38, Doha',
    };
  });

  const updateAutoMealOrderConfig = (updates: Partial<AutoMealOrderConfig>) => {
    setAutoMealOrderConfigState((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('glucocoach_auto_meal_order', JSON.stringify(next));
      return next;
    });
  };

  const triggerAutoMealOrderNow = (mealType?: MealType): KitchenFoodOrder => {
    const currentHour = new Date().getHours();
    const targetType: MealType =
      mealType ||
      (currentHour < 11
        ? 'breakfast'
        : currentHour < 16
        ? 'lunch'
        : currentHour < 21
        ? 'dinner'
        : 'snack');

    // Pick lowest-sugar meal available (<5g total sugar)
    const lowSugarMeals = QATAR_HEALTHY_MEALS.filter(
      (m) => m.sugarGrams <= (autoMealOrderConfig.maxSugarGramsPerMeal || 5)
    );
    const chosenMeal =
      lowSugarMeals.find((m) => m.category === (targetType === 'breakfast' ? 'breakfast' : 'traditional')) ||
      lowSugarMeals[0] ||
      QATAR_HEALTHY_MEALS[0];

    const autoOrder = placeKitchenOrder(
      chosenMeal,
      1,
      ['Diabetic strict portion', 'Zero added sugar', 'Frontload fresh salad'],
      autoMealOrderConfig.deliveryAddress || 'Al Sadd, Zone 38, Doha',
      'Automated On-Time Low-Sugar Delivery',
      autoMealOrderConfig.preferredProviderId || 'provider-talabat'
    );

    autoOrder.isAutomated = true;
    updateAutoMealOrderConfig({ lastAutoOrderedAt: new Date().toISOString() });
    return autoOrder;
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
        nextMealPlan,
        todaySugarIntake,
        remainingSugarBudget,
        isMealLoggerOpen,
        setIsMealLoggerOpen,
        orders,
        foodProviders: DUMMY_QATAR_FOOD_PROVIDERS,
        placeKitchenOrder,
        activeKitchenOrder,
        setActiveKitchenOrder,
        selectedMealForOrder,
        setSelectedMealForOrder,
        openOrderModalForMeal,
        isOrderModalOpen,
        setIsOrderModalOpen,
        autoMealOrderConfig,
        updateAutoMealOrderConfig,
        triggerAutoMealOrderNow,
        isHighSugarAlarmOpen,
        setIsHighSugarAlarmOpen,
        highSugarAlarmInfo,
        triggerHighSugarAlarm,
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
        isMobileSimulator,
        setIsMobileSimulator,
        // Patient Portal & Authentication
        currentUser,
        isAuthLoading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAccountModalOpen,
        setIsAccountModalOpen,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        loginWithQatarHealthId,
        loginAsDemoPatient,
        logout,
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
